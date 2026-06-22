---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Schema-First Telemetry in Go: A New Approach to Observability"
subtitle: ""
summary: "Modern Go services generate telemetry (metrics, logs, traces) with instrumentation embedded directly in code. Usually this is code-first: developers call APIs (counters, loggers, tracers) and attach key-value attributes on the fly. It works, but at scale it leads to fragmented data and missing context. Schema-first telemetry turns that around: you define a schema (like an IDL file) for your telemetry data up front, including its semantic metadata, and emit telemetry from generated code."
authors: ["abtris"]
tags: []
categories: ["observability"]
date: 2025-04-18T08:05:13+02:00
lastmod: 2025-04-18T08:05:13+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Modern Go services generate **telemetry** (metrics, logs, traces) with instrumentation embedded directly in code. Usually this is a **code-first** approach: developers call APIs (counters, loggers, tracers) and attach key-value attributes on the fly. It works, but at scale it leads to fragmented data and missing context. **Schema-first telemetry** turns that around: you define a schema (like an IDL file) for your telemetry data up front, including its semantic metadata, and emit telemetry from generated code. This post introduces schema-first telemetry through Meta’s research, compares it to how OpenTelemetry handles schemas today, looks at what others in the community are doing, and shows Go examples of how you might implement it on top of OpenTelemetry.

## The Limitations of Code-First Telemetry

Most of us instrument applications in a **code-first** fashion. For example, using OpenTelemetry in Go, you might record a metric like this:

```go
// Code-first instrumentation example (OpenTelemetry)
counter := metric.Must(meter).NewInt64Counter("request_count")
counter.Add(ctx, 1,
    attribute.String("service.id", "foo"),
    attribute.String("endpoint", "/api/v1/resource"),
    attribute.Int("status_code", 200),
)
```

In this snippet, the keys `"service.id"`, `"endpoint"`, and `"status_code"` are just strings. You choose them in code, perhaps following suggested naming conventions. This is straightforward, but all the knowledge about these fields is implicit. The code is the only place where the “schema” exists. There’s no formal description of what `"service.id"` means or what values `"status_code"` can take, beyond maybe documentation or tribal knowledge. Common problems with the code-first approach:

- **Discoverability:** Consumers of telemetry (engineers writing queries or dashboards) have to guess or search what attributes exist and what they mean. With many services, each might use slightly different keys for the same concept (e.g., `"userId"` vs `"user.id"`).
- **Consistency:** Nothing enforces consistency. Developers may mis-name a field or use it differently than others. OpenTelemetry offers *semantic conventions*, standard names for common attributes, but these are encouraged, not enforced.
- **Lack of semantic info:** The backend treats most data as opaque strings. It might not know that `"status_code"` is an integer HTTP status, or that `"endpoint"` is a URL path. Units and types are often lost; everything becomes a string label.
- **Change management:** Evolving telemetry is risky. Rename an attribute in code and any dashboard or alert that depends on the old name breaks. Without a schema there’s no easy way to notify or automatically migrate consumers.

In a code-first world, adding a new attribute (say a shard ID) to a metric is just another key-value in the code. Easy for the developer, but that new field’s existence and meaning still has to reach everyone downstream, usually through documentation or code review.

## What is Schema-First Telemetry?

A **schema-first approach** means you define the structure and metadata of telemetry **before** writing instrumentation code, much like designing a schema for a database or an API. Yuri Shkuro (Meta) describes using Thrift IDL files to define telemetry data types (metrics, log events, and so on) with rich annotations for semantics. The schema becomes the single source of truth for what telemetry your app can emit.

Key aspects of schema-first telemetry:

- **IDL-based Schema Definition:** You write an IDL (Interface Definition Language) file describing your telemetry data. For example, a metric “RequestCounter” might be defined as a struct with fields for `service_id`, `endpoint`, `status_code`, etc., each with a type and description.
- **Rich Metadata Annotations:** The schema can include annotations for things like human-readable descriptions, units, acceptable values, privacy levels, etc. For instance, you might annotate that `status_code` is an HTTP status and an integer, or tag fields with `@DisplayName` and `@Description` in the IDL. This metadata travels with the schema.
- **Code Generation:** A tool generates language-specific code (for Go, it could generate Go structs or helper functions) from the schema. Developers use this generated code instead of manually writing key strings. This ensures they only emit data that conforms to the schema.
- **Compile-time checks:** Because telemetry fields are now struct fields or typed constants, many errors (typos in attribute names, wrong types) become compile-time errors. Try to record a string into a field defined as an int and the code won’t compile, which is a real win for robustness.
- **Schema Registry & Versioning:** The schemas are versioned and stored in a registry (or metadata store). Both producers and consumers (backends, query tools) can retrieve the schema to know how to parse and interpret telemetry data. When updating a schema, you might bump a version or use a compatibility check in CI.

### Example: Defining and Using a Telemetry Schema

Let’s illustrate with a simplified example inspired by Meta’s approach. Suppose we want a metric for counting requests. In schema-first style, we define it in an IDL (here using pseudo-Go syntax for clarity):

```go
// Schema (could be in Thrift, Proto, etc.)
type ServiceID string    // alias type for service identifier
type StatusCode int32    // alias type for HTTP status code
struct RequestCounter {
    1: ServiceID  service_id   // e.g., "orderservice"
    2: string     endpoint     // e.g., "/api/v1/submit"
    3: StatusCode status_code  // e.g., 200
    // (We can add more fields later, like shard_id)
}
```

This schema says: a `RequestCounter` metric event has three fields with specified types. We could add metadata annotations too, such as descriptions or units (not shown here for brevity).

From this schema, a code generator would produce a Go struct and helpers. In Go, the generated code might look like:

```go
// Generated code (simplified)
type RequestCounter struct {
    ServiceID   string
    Endpoint    string
    StatusCode  int32
}
// ... plus maybe helper methods or validators
```

Now, to emit telemetry in our application, we use this struct with the OpenTelemetry API:

```go
// Using schema-first generated struct in instrumentation
rc := RequestCounter{
    ServiceID:  "orderservice",
    Endpoint:   "/api/v1/submit",
    StatusCode: 200,
}
// The telemetry SDK could provide a helper to record struct data:
telemetry.Record(ctx, rc)
```

Under the hood, `telemetry.Record` could iterate over the struct’s fields and convert them to OpenTelemetry attributes, using a mapping of field names to attribute keys. For example, `ServiceID` -> `"service.id"`, `Endpoint` -> `"endpoint"`, `StatusCode` -> `"http.status_code"`, based on the schema definition. The result is similar telemetry data, but produced in a schema-driven way rather than ad-hoc in code.

**Adding a new field** in schema-first starts with the schema. Say we want to add `shard_id` to the `RequestCounter`. We add it to the IDL:

```go
    4: string ShardID  // add shard identifier for sharded services
```

This change is made in the schema (with perhaps a description annotation for clarity). The codegen then updates the Go struct:

```go
type RequestCounter struct {
    ServiceID  string
    Endpoint   string
    StatusCode int32
    ShardID    string  // new field
}
```

Now the application code can start populating `ShardID` when recording the metric:

```go
rc := RequestCounter{
    ServiceID:  "orderservice",
    Endpoint:   "/api/v1/submit",
    StatusCode: 200,
    ShardID:    "shard-42",      // new dimension
}
telemetry.Record(ctx, rc)  // now includes shard_id
```

From the developer’s side, adding the field was a small change: one extra line in the IDL, plus using the new field in code. From the system’s side, a lot more happens behind the scenes to keep it seamless and safe. That is the telemetry **lifecycle** in a schema-first model.

## Telemetry Lifecycle in a Schema-First Model

In a schema-first system like the one at Meta, there is an end-to-end flow that ensures schema changes and data emission stay in sync:

1. **Schema Definition/Change:** A developer edits the schema file (IDL) to add or modify telemetry fields (for example, add `shard_id` to `RequestCounter`). This is done alongside the code that will emit the data. Both changes can go in a single pull request.
2. **CI Validation:** A continuous integration step checks the schema change for backward compatibility (no forbidden changes like renaming a field outright). It may also generate the new code and run tests. If the schema change would break consumers (e.g., deleting a field or changing its type in a non-backwards-compatible way), the CI rejects it. This ensures stability.
3. **Schema Registry Update:** When the change is approved and merged, an **actualization service** updates the central **metadata store** or schema registry with the new schema version. Now the organization’s observability platform “knows” about the new `shard_id` field for `RequestCounter`.
4. **Telemetry Emission:** The application runs with the updated code. The OpenTelemetry SDK (or a custom telemetry SDK) serializes the telemetry. In Meta’s case, they even serialize it as a **binary Thrift payload** on the wire for efficiency. Importantly, each telemetry data point can carry a reference to the schema version used.
5. **Backend Ingestion:** The telemetry backend receives the data. Seeing the schema reference (e.g., a schema URL or version), it can parse the data using the correct schema. Because the backend was informed of the schema update, it already understands the new field by the time data arrives. This avoids the usual problem of “surprise” fields nobody knows about.
6. **Query & Analysis:** When you go to query this data (maybe in a monitoring UI or via a query language), the tools can pull the schema metadata from the registry. This means UIs can present human-friendly names or descriptions for fields, enforce correct units or types in queries, and even suggest joins across telemetry streams if they share common schema elements. The rich annotations we discussed (like descriptions, units, etc.) are available to make exploration easier.

## OpenTelemetry Today: Schemas and Semantic Conventions

How does this compare with **OpenTelemetry (OTel)**, the open-source observability framework many Go developers use? OTel wasn’t originally schema-first, but it recognized some of these issues and introduced a *schema concept* in version 1.8 of the spec.

OTel provides **Semantic Conventions**, a catalog of standard attribute names for common scenarios (HTTP, database, messaging, and so on). They’re defined in YAML files and published as part of the spec. In Go they’re available as constants (for example, `semconv.HTTPMethodKey` for the `"http.method"` attribute). Semantic conventions add some structure and consistency: if everyone follows them, all services use `"http.method"` to mean the same thing. But as Shkuro et al. point out, these are “only conventions”. Nothing prevents a developer from deviating or misusing them, and there is no automatic validation that your values make sense (e.g., that an `"http.status_code"` attribute is a number and not a string saying "OK").

To help conventions evolve, OpenTelemetry also introduced **Telemetry Schemas** identified by a Schema URL. An instrumentation library can embed a schema URL like `https://opentelemetry.io/schemas/1.9.0` in the data it emits, signaling “I’m using version 1.9.0 of the conventions.” If a backend sees data from an older schema version, it can in theory automatically translate attributes to the newer schema (for example, if a key was renamed between OTel 1.8.0 and 1.9.0). So OTel schemas enable version negotiation and transformation, a bit like a migration script for telemetry data, which is useful for handling gradual changes in conventions without breaking dashboards.

But OTel’s Schema URL mechanism is still about evolving *conventions*. It doesn’t give you a per-application custom schema with rich types, and it doesn’t formally describe the data’s shape beyond listing name changes between versions. So it helps with compatibility, but it doesn’t reach the full schema-first vision of strongly typed telemetry with all semantics captured.

**Comparing Approaches:**

- *Schema Definition:* Meta’s approach defines exact fields and types for each telemetry signal (e.g., the fields in `RequestCounter`). OTel defines common fields in a looser way (a list of recommended keys for things like HTTP, etc., which you may or may not use).
- *Enforcement:* In schema-first, your code won’t compile if you try to emit something that’s not in the schema or of the wrong type. In OTel, you can always add any attribute key on a span or metric, with no compile-time checks. Errors or inconsistencies might only surface in the backend, or not until someone queries and finds nonsense values.
- *Evolution:* Schema-first supports safe evolution through versioned schemas and automated compatibility checks. OTel’s schema URLs let backends adapt to renamed fields, but they don’t solve deeper changes (splitting a field in two, changing data types) and don’t prevent problems if producers and consumers aren’t in lockstep.
- *Metadata Richness:* In schema-first, metadata like unit (e.g. milliseconds vs seconds for a latency metric) can be captured in the schema. In OTel’s code-first model, if you use a semantic convention the unit might be suggested by convention (e.g., `"ms"` for milliseconds), but it’s not enforced. It’s up to the developer to remember and the backend to interpret. Many existing telemetry systems treat all labels as opaque strings with no unit or type info.

OpenTelemetry is moving toward more schema awareness (schema URLs, generated semantic-convention libraries), but it is still largely a code-first ecosystem. The schema-first approach, as championed by Meta, goes further: it treats telemetry schemas as first-class artifacts in your development workflow.

## Evolving the Ecosystem: Schema-First Telemetry Elsewhere

Meta isn’t alone in seeing the need for better telemetry metadata. Other organizations and open-source projects are pushing in the same direction:

- **Elastic Common Schema (ECS):** Elastic created ECS as a unified schema for logs and metrics (primarily for Elasticsearch ingestion). It defines a common set of field names and types across many domains (cloud, host, network, http, and so on) so disparate sources can be correlated. For example, ECS says use `source.ip` for an IP address rather than every app inventing its own field. In 2023, Elastic announced it is working with OpenTelemetry to merge ECS with OTel’s semantic conventions, aiming for one common open schema. This is still about standardizing field naming, not a compiled per-app schema, but it shows the industry’s appetite for schema convergence. If ECS and OTel unify, a Go developer might one day rely on a single set of well-known field names for all telemetry.
- **CloudEvents schema references:** The CloudEvents standard (for describing event payloads in a common way) includes a `dataschema` attribute, a URI pointing to the schema of the event’s data. This is conceptually similar to OTel’s schema URL: it tells consumers where to find the schema to interpret the event. It doesn’t enforce the schema on the producer side, but it encourages formal schemas for event data.
- **OpenTelemetry Weaver (Project OTel Weaver):** This is a proof-of-concept CLI tool from the OpenTelemetry community exploring schema-first ideas ([GitHub - f5/otel-weaver: OTel Weaver a schema-first approach to OpenTelemetry (status: POC)](https://github.com/f5/otel-weaver#:~:text=,not%20ready%20for%20production%20use)) ([GitHub - f5/otel-weaver: OTel Weaver a schema-first approach to OpenTelemetry (status: POC)](https://github.com/f5/otel-weaver#:~:text=OTel%20Weaver%20is%20a%20CLI,tool%20that%20enables%20users%20to)). OTel Weaver can generate a client SDK from a telemetry schema and allows searching and resolving of schema definitions. It’s inspired by the vision laid out in an OpenTelemetry discussion (OTEP 0243) about **Application Telemetry Schema** and **Component Telemetry Schema**. The goal is to let developers define custom schemas (for their specific application’s telemetry) on top of the global conventions, and have tools to generate code and validate telemetry against those schemas. As of now, this is in early stages (not production-ready), but it shows that the open-source community is actively working on enabling schema-first workflows in the future.
- **Datadog Reference Tables:** Some observability vendors tackle the metadata problem by letting users enrich telemetry after the fact. Datadog, for instance, has *Reference Tables* that let you join telemetry data with external data (CMDB info, business metadata). It isn’t schema-first, but it comes from the same pain point: needing more context and meaning in telemetry. Reference Tables enrich a posteriori (add metadata after data is collected), whereas schema-first bakes it in a priori. At Meta they had experience with an a posteriori metadata store and found it can drift out of sync if not tightly coupled, which is why they moved to schema-first for critical systems.
- **Chronosphere’s approach:** Chronosphere (an observability platform) emphasizes standardizing telemetry metadata and naming across an organization. In a blog post on OTel attribute naming, they note that *“metadata plays a key role in making observability data meaningful”* and advocate for clear conventions and company-wide standards. This isn’t a full schema-first system, but the recommended practice of defining a naming-standard document and running workshops to align teams is essentially a manual schema-governance process. The goals are the same: consistency, discoverability, and interoperability of telemetry.

There’s broad recognition that telemetry needs stronger contracts. Whether through formal schemas, unified conventions, or metadata enrichment, the industry is converging on telemetry that is more self-describing and can evolve without breaking consumers. Schema-first is one of the leading techniques to get there.

## Go Example: Schema-First Telemetry in Practice

Back to the Go developer’s perspective. How might you apply schema-first ideas in Go *today* with OpenTelemetry? The full tooling isn’t here yet, but you can adopt some patterns:

1. **Define Structs for Telemetry Data:** Instead of sprinkling string keys throughout your code, define Go structs to represent the telemetry events or metrics you intend to emit. This gives you a single place to see all fields and their types.

   ```go
   // Define a struct as a pseudo-schema for a log or metric event
   type OrderSubmittedEvent struct {
       OrderID   string  // business identifier
       Value     float64 // value of the order
       CustomerID string // customer identifier
       Region    string  // region of the request
   }
   ```

   Add comments or struct tags to document the fields. This struct is a mini-schema. It doesn’t enforce anything on its own, but it’s a start.

2. **Use Constructor Functions to Enforce Required Fields or Types:** You can provide functions to create these events, which can apply validation.

   ```go
   func NewOrderSubmittedEvent(orderID string, value float64, customerID, region string) OrderSubmittedEvent {
       // Here you might enforce some constraints or default values
       return OrderSubmittedEvent{orderID, value, customerID, region}
   }
   ```

3. **Conversion to OTel Attributes:** Implement a method to convert your struct to OTel attributes. For example:

   ```go
   import "go.opentelemetry.io/otel/attribute"

   func (e OrderSubmittedEvent) Attributes() []attribute.KeyValue {
       return []attribute.KeyValue{
           attribute.String("order.id", e.OrderID),
           attribute.Float64("order.value", e.Value),
           attribute.String("customer.id", e.CustomerID),
           attribute.String("region", e.Region),
       }
   }
   ```

   Here we decide on the actual keys (like `"order.id"`, `"customer.id"`). Ideally, follow existing semantic conventions or your organization’s schema guidelines for naming (e.g., if “region” should be `cloud.region` per OTel conventions, use that). This method is essentially encoding the schema knowledge.

4. **Emit Telemetry Using the Struct:** Now use the struct in your instrumentation code:

   ```go
   meter := global.Meter("myapp/orders")
   ordersCounter := metric.Must(meter).NewInt64Counter("orders_submitted_total")

   // When an order is submitted:
   evt := NewOrderSubmittedEvent(orderID, value, customerID, region)
   ordersCounter.Add(ctx, 1, evt.Attributes()...)
   ```

   This ensures every time you record `orders_submitted_total`, you attach the full set of attributes as defined in the struct. If you forget a field, the compiler will complain if it’s not set (since the struct requires you to provide all fields in `NewOrderSubmittedEvent`). If you ever rename a field in the struct, you’ll update it in one place (the `Attributes()` method), rather than hunting down every occurrence of the string literal.

5. **Optional, schema registration:** If you want to go one step further, you could maintain a simple registry or metadata map in your code that describes these events. For example:

   ```go
   var TelemetrySchema = map[string]map[string]string{
       "OrderSubmittedEvent": {
           "order.id":    "ID of the order",
           "order.value": "Value of the order in USD",
           "customer.id":"ID of the customer who placed the order",
           "region":     "Geographical region of the request",
       },
   }
   ```

   This could expose the schema programmatically (say, an HTTP endpoint that returns the schema JSON, or a log line at startup). It’s a rudimentary schema registry. Consumers (or your team’s documentation) could pull it to know what telemetry to expect. It’s not as robust as a real schema registry, but it builds the habit of treating telemetry fields as a contract.

In a true schema-first setup, much of this would be automated: an IDL, codegen, and so on. But even without full tool support, these Go patterns get you closer to the benefits, with type safety, clarity, and a self-documenting approach.

## Benefits: Why Schema-First Telemetry Matters

**For developers**, schema-first means a better experience when instrumenting code. You get auto-complete for telemetry fields (they’re struct fields or constants) and compile-time feedback when you misuse them. It cuts the cognitive load of remembering “what keys should I use here?” because the schema lives in one place. As Meta’s engineers found, a type-safe API is “more ergonomic and robust” than generic key-value pairs. It’s like the difference between raw SQL strings and an ORM with defined models: the latter catches errors earlier and is easier to navigate in an IDE.

**For telemetry consumers** (SREs, analysts, and so on), the data comes with a map. It’s more discoverable: you can list all metrics and their dimensions from the schema registry without reading the source. It’s more interpretable: units and descriptions are right there, so you don’t have to guess whether a duration is in seconds or milliseconds, or what “xyz_flag=true” really means. Streams correlate more reliably because shared dimensions are clearly identified. If logs and metrics both carry a `customer.id` field per schema, you can join on it with confidence; in a code-first world where one used `user` and the other `customerId`, you might not even realize they refer to the same thing.

**For platform engineers and architects**, schema-first enables better governance and tooling. You can enforce policies centrally, like “every metric must have a unit annotation” or “PII must be marked in the schema and handled accordingly.” It also opens the door to optimizations: if a field is an enum with a limited set of values, you can encode it more efficiently than a free-form string. Meta reported performance gains from serializing telemetry as a struct (no repeated keys per record) and using binary encoding. The schema also allows automated compatibility layers, similar to OTel’s schema transforms but potentially more powerful, because you know the data types, not just the names.

Schema-first isn’t free. It adds an upfront step, writing or updating the schema, that code-first avoids. The Meta paper acknowledges this friction but calls it “a worthy trade-off” given the benefits. Tooling (schema wizards, templates) can soften the overhead, and once a schema exists, using it is straightforward, especially when it’s wired into your build (Meta integrates schema codegen into their Buck build).

## Conclusion

Schema-first application telemetry brings strong typing and rich metadata to observability. For Go developers it means moving from ad-hoc strings in code to defined structs and schemas that describe your metrics, logs, and traces. Meta’s implementation shows the payoff: compile-time validation, easier multi-signal correlation, and automatic enforcement of consistency. OpenTelemetry today gives you semantic conventions and schema versioning, which solve part of the problem, and a fuller schema-first model is coming with community efforts like OTel Weaver and the unification of industry schemas.

Even an informal schema-first mindset can improve the telemetry your Go services emit. Start by defining and documenting your telemetry fields in one place, whether an IDL, a Go struct, or a markdown file in your repo. Use code generation or helper libraries so everyone shares the same definitions. Over time this can grow into a more automated schema-first toolchain as the ecosystem matures.

Telemetry with a schema is like code with types: safer, clearer, and easier to change. As observability keeps growing in importance for cloud-native systems, schema-first techniques may well become a standard part of the Go developer’s toolkit for building reliable, introspectable services.

**Sources:**

- [Yuri Shkuro et al., *“Positional Paper: Schema-First Application Telemetry”* Meta (2022)](https://arxiv.org/abs/2206.11380).
- [Yuri Shkuro, *"Schema-first Application Telemetry"*, SRECon 2022](https://www.shkuro.com/talks/2022-10-27-schema-first-application-telemetry/)
- OpenTelemetry Project, *[Semantic Conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/) and [Telemetry Schema](https://opentelemetry.io/docs/specs/otel/schemas/)* in spec and OTEPs.
- [Elastic Blog, *“Elastic Common Schema contributes to OpenTelemetry”* Ken Exner (2023)](https://www.elastic.co/blog/ecs-elastic-common-schema-otel-opentelemetry-announcement).
- [Chronosphere Blog, *“Top 3 OpenTelemetry Attribute Naming Best Practices”* (2024)](https://chronosphere.io/learn/top-3-opentelemetry-attribute-naming-best-practices/).
- [Datadog Blog, *“Enrich Your Telemetry with Custom Metadata (Reference Tables)”* (2022)](https://www.datadoghq.com/blog/reference-tables/).
- [OpenTelemetry Weaver](https://github.com/open-telemetry/weaver)
