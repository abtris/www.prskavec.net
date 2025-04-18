---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Schema-First Telemetry in Go: A New Approach to Observability"
subtitle: ""
summary: ""
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

Modern Go services generate **telemetry** – metrics, logs, traces – using instrumentation embedded directly in code. Typically, this is a **code-first approach**, where developers call APIs (counters, loggers, tracers) and attach key-value attributes on the fly. This works, but at scale it can lead to fragmented data and missing context. **Schema-first telemetry** flips this paradigm: you define upfront a schema (like an IDL file) for your telemetry data, including its semantic metadata, and use generated code to emit telemetry. In this post, we’ll introduce schema-first telemetry via Meta’s research, compare it to how OpenTelemetry handles schemas today, explore what others in the community are doing, and show Go examples of how you might implement schema-first telemetry on top of OpenTelemetry. We’ll also discuss diagrams that illustrate code-first vs. schema-first, the telemetry lifecycle in schema-first, and how rich metadata improves discoverability and interoperability.

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

In this snippet, the keys `"service.id"`, `"endpoint"`, and `"status_code"` are just strings. You choose them in code, perhaps following suggested naming conventions. This approach is straightforward, but **all the knowledge about these fields is implicit** – the code is the only place where the “schema” exists. There’s no formal description of what `"service.id"` means or what values `"status_code"` can take, except maybe in documentation or tribal knowledge. Some common issues with the code-first approach include:

- **Discoverability:** Consumers of telemetry (like engineers writing queries or dashboards) have to guess or search what attributes are available and what they mean. If you have many services, each might use slightly different keys for the same concept (e.g., `"userId"` vs `"user.id"`).
- **Consistency:** Nothing enforces consistency. Developers may mis-name a field or use it differently than others. OpenTelemetry provides *semantic conventions* – standard names for common attributes – but these are not strictly enforced, only encouraged.
- **Lack of Semantic Info:** The telemetry backend treats most data as opaque strings. It might not know that `"status_code"` is an integer representing an HTTP status, or that `"endpoint"` is a URL path. Units and types are often lost (everything becomes a string label).
- **Change Management:** Evolving telemetry is risky. If you rename an attribute in code, any dashboards or alerts depending on the old name break. Without a schema, there’s no easy way to notify or automatically migrate consumers of that change.

In a code-first world, if you decide to add a new attribute (say, a shard ID) to a metric, you simply add another key-value in the code. It’s easy for the developer, but that new field’s existence and meaning has to be communicated to everyone downstream – usually via documentation or code review.

## What is Schema-First Telemetry?

A **schema-first approach** means you explicitly define the structure and metadata of telemetry **before** writing instrumentation code. Think of it like designing a schema for a database or an API. Yuri Shkuro (Meta) describe using Thrift IDL files to define telemetry data types (metrics, log events, etc.), including rich annotations for semantics. This schema is the **single source of truth** for what telemetry your app can emit.

Key aspects of schema-first telemetry:

- **IDL-based Schema Definition:** You write an IDL (Interface Definition Language) file describing your telemetry data. For example, a metric “RequestCounter” might be defined as a struct with fields for `service_id`, `endpoint`, `status_code`, etc., each with a type and description.
- **Rich Metadata Annotations:** The schema can include annotations for things like human-readable descriptions, units, acceptable values, privacy levels, etc. For instance, you might annotate that `status_code` is an HTTP status and an integer, or tag fields with `@DisplayName` and `@Description` in the IDL. This metadata travels with the schema.
- **Code Generation:** A tool generates language-specific code (for Go, it could generate Go structs or helper functions) from the schema. Developers use this generated code instead of manually writing key strings. This ensures they only emit data that conforms to the schema.
- **Compile-time Checks:** Because telemetry fields are now struct fields or typed constants, many errors (like typos in attribute names or assigning wrong types) become compile-time errors. If you try to record a string into a field defined as an int, the code won’t compile – a big win for robustness.
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

Under the hood, `telemetry.Record` might iterate over the struct’s fields and convert them to OpenTelemetry attributes. It might use a mapping of field names to attribute keys. For example, `ServiceID` -> `"service.id"`, `Endpoint` -> `"endpoint"`, `StatusCode` -> `"http.status_code"`, etc., based on the schema definition. The end result is similar telemetry data being sent out, but it was produced in a **schema-driven** way rather than ad-hoc in code.

**Adding a new field** in schema-first involves updating the schema first. Let’s say we want to add `shard_id` to the `RequestCounter`. We’d add it to the IDL:

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

From the developer’s perspective, adding this field was a small change to the struct (one extra line in IDL, and using the new field in code). From the system’s perspective, however, a lot more is happening behind the scenes to make this seamless and safe – which brings us to the telemetry **lifecycle** in a schema-first model.

## Telemetry Lifecycle in a Schema-First Model

In a schema-first system like the one at Meta, there is an end-to-end flow that ensures schema changes and data emission stay in sync:

1. **Schema Definition/Change:** A developer edits the schema file (IDL) to add or modify telemetry fields (for example, add `shard_id` to `RequestCounter`). This is done alongside the code that will emit the data. Both changes can go in a single pull request.
2. **CI Validation:** A continuous integration step checks the schema change for backward compatibility (no forbidden changes like renaming a field outright). It may also generate the new code and run tests. If the schema change would break consumers (e.g., deleting a field or changing its type in a non-backwards-compatible way), the CI rejects it. This ensures stability.
3. **Schema Registry Update:** When the change is approved and merged, an **actualization service** updates the central **metadata store** or schema registry with the new schema version. Now the organization’s observability platform “knows” about the new `shard_id` field for `RequestCounter`.
4. **Telemetry Emission:** The application runs with the updated code. The OpenTelemetry SDK (or a custom telemetry SDK) serializes the telemetry. In Meta’s case, they even serialize it as a **binary Thrift payload** on the wire for efficiency. Importantly, each telemetry data point can carry a reference to the schema version used.
5. **Backend Ingestion:** The telemetry backend receives the data. Seeing the schema reference (e.g., a schema URL or version), it can parse the data using the correct schema. Because the backend was informed of the schema update, it **already understands the new field** by the time data arrives. This avoids the typical problem of “surprise” fields that nobody knows about.
6. **Query & Analysis:** When you go to query this data (maybe in a monitoring UI or via a query language), the tools can pull the schema metadata from the registry. This means UIs can present human-friendly names or descriptions for fields, enforce correct units or types in queries, and even suggest joins across telemetry streams if they share common schema elements. The rich annotations we discussed (like descriptions, units, etc.) are available to make exploration easier.

**Diagram – Schema-First Telemetry Flow:** In a schema-first system, *both* the code and the schema evolve together. Imagine a diagram where a developer’s single PR flows through two parallel paths: one updates the schema in the registry (after passing validation), another updates the application code. When the app emits telemetry, it includes a schema identifier. The backend uses that to look up field definitions and semantics, and users querying the data can retrieve those definitions from the registry to understand the data. In contrast, a code-first diagram would show no schema registry at all – only code emitting data and consumers left to interpret it on their own.

## OpenTelemetry Today: Schemas and Semantic Conventions

How does this compare with **OpenTelemetry (OTel)**, the open-source observability framework many Go developers use? OTel wasn’t originally schema-first, but it recognized some of these issues and introduced a *schema concept* in version 1.8 of the spec.

OTel provides **Semantic Conventions** – essentially a catalog of standard attribute names for common scenarios (HTTP, database, messaging, etc.). These are defined in YAML files and published as part of the spec. In Go, they’re available as constants (for example, `semconv.HTTPMethodKey` for the `"http.method"` attribute). Semantic conventions impose a bit of structure and consistency: if everyone follows them, all services will use `"http.method"` to mean the same thing. However, as Shkuro et al. point out, these are “only conventions” – nothing prevents a developer from deviating or misusing them. There is no automatic validation that your values make sense (e.g., ensuring an `"http.status_code"` attribute is a number and not a string saying "OK").

To help with evolving conventions, OpenTelemetry also introduced **Telemetry Schemas** identified by a Schema URL. Here’s how it works: an instrumentation library can embed a schema URL like `https://opentelemetry.io/schemas/1.9.0` in the data it emits. This indicates, “I’m using version 1.9.0 of the conventions.” If a backend sees data from an older schema version, it can (in theory) automatically **translate** attributes to the newer schema (for example, if a key was renamed between OTel 1.8.0 and 1.9.0). Essentially, OTel schemas facilitate **version negotiation and transformation** – a bit like a migration script for telemetry data. This is a useful feature to handle gradual changes in conventions without breaking dashboards.

However, OTel’s Schema URL mechanism is still about evolving *conventions* – it doesn’t give you a per-application custom schema with rich types. The OTel schema does *not* formally describe the data’s shape beyond listing name changes between versions. So, while it helps with compatibility, it **doesn’t address the full schema-first vision** of strongly typed telemetry with all semantics captured.

**Comparing Approaches:**

- *Schema Definition:* Meta’s approach defines exact fields and types for each telemetry signal (e.g., the fields in `RequestCounter`). OTel defines common fields in a looser way (a list of recommended keys for things like HTTP, etc., which you may or may not use).
- *Enforcement:* In schema-first, your code won’t compile if you try to emit something that’s not in the schema or of the wrong type. In OTel, you can always add any attribute key on a span or metric – no compile-time checks. Errors or inconsistencies might only be caught (if at all) in the backend or not noticed until someone queries and finds nonsense values.
- *Evolution:* Schema-first supports safe evolution through versioned schemas and automated compatibility checks. OTel’s schema URLs allow backends to adapt to renamed fields, but they don’t solve deeper changes (like splitting a field into two, or changing data types) and don’t prevent issues if producers and consumers aren’t in lockstep.
- *Metadata Richness:* In schema-first, metadata like unit (e.g. milliseconds vs seconds for a latency metric) can be captured in the schema. In OTel’s code-first model, if you use a semantic convention, the unit might be suggested by convention (e.g., `"ms"` for milliseconds), but it’s not automatically enforced. It’s up to the developer to remember and the backend to interpret. Many existing telemetry systems treat all labels as opaque strings with no units or data type info.

**In short**, OpenTelemetry is moving towards more schema awareness (with schema URLs and generated semantic convention libraries), but it is still largely a code-first ecosystem. The schema-first approach, as championed by Meta, goes further by treating telemetry schemas like first-class artifacts in your development workflow.

## Evolving the Ecosystem: Schema-First Telemetry Elsewhere

Meta isn’t alone in recognizing the need for better telemetry metadata. Other organizations and open-source projects are also pushing in this direction:

- **Elastic Common Schema (ECS):** Elastic created ECS as a unified schema for logs and metrics (primarily for Elasticsearch ingestion). It defines a common set of field names and types for many domains (cloud, host, network, http, etc.), so that disparate sources can be correlated. For example, ECS says use `source.ip` for an IP address, rather than every app inventing its own field. In 2023, Elastic announced they are working with OpenTelemetry to merge ECS with OTel’s semantic conventions, aiming for one common open schema. This is still about standardizing field naming, not a compiled schema per app, but it shows industry desire for **schema convergence**. If ECS and OTel unify, a Go developer might one day rely on a single set of well-known field names for all telemetry, which is a step toward consistency.
- **CloudEvents Schema References:** The CloudEvents standard (for describing event payloads in a common way) includes a `dataschema` attribute that is a URI pointing to the schema of the event’s data. This is conceptually similar to OTel’s schema URL – it tells consumers where to find the schema to interpret the event. It doesn’t enforce the schema on the producer side, but it encourages use of formal schemas for event data.
- **OpenTelemetry Weaver (Project OTel Weaver):** This is a proof-of-concept CLI tool from the OpenTelemetry community exploring schema-first ideas ([GitHub - f5/otel-weaver: OTel Weaver a schema-first approach to OpenTelemetry (status: POC)](https://github.com/f5/otel-weaver#:~:text=,not%20ready%20for%20production%20use)) ([GitHub - f5/otel-weaver: OTel Weaver a schema-first approach to OpenTelemetry (status: POC)](https://github.com/f5/otel-weaver#:~:text=OTel%20Weaver%20is%20a%20CLI,tool%20that%20enables%20users%20to)). OTel Weaver can generate a client SDK from a telemetry schema and allows searching and resolving of schema definitions. It’s inspired by the vision laid out in an OpenTelemetry discussion (OTEP 0243) about **Application Telemetry Schema** and **Component Telemetry Schema**. The goal is to let developers define custom schemas (for their specific application’s telemetry) on top of the global conventions, and have tools to generate code and validate telemetry against those schemas. As of now, this is in early stages (not production-ready), but it shows that the open-source community is actively working on enabling schema-first workflows in the future.
- **Datadog Reference Tables:** Some observability vendors approach the metadata problem by allowing users to enrich telemetry after the fact. Datadog, for instance, has *Reference Tables* which let you join telemetry data with external data (like CMDB info or business metadata). While not the same as schema-first, it stems from the same pain point – needing more context and meaning in telemetry. Reference Tables are an a posteriori enrichment (add metadata after data is collected), whereas schema-first bakes the metadata in a priori. At Meta, they had experience with an a posteriori metadata store and found it can drift out of sync if not tightly coupled, which is why they moved to schema-first for critical systems.
- **Chronosphere’s Approach:** Chronosphere (an observability platform) emphasizes standardizing telemetry metadata and naming across an organization. In a blog post on OTel attribute naming, they note *“metadata plays a key role in making observability data meaningful”* and advocate for clear conventions and company-wide standards. This isn’t a full schema-first system, but the recommended practice of **defining a naming standard document** and using workshops to get teams aligned is essentially a manual schema governance process. It reflects the same goals: consistency, discoverability, and interoperability of telemetry.

In summary, there’s a broad recognition that **we need stronger contracts for telemetry data**. Whether via formal schemas, unified conventions, or metadata enrichment, the industry is converging on the idea that telemetry should be more self-describing and evolvable without breaking consumers. Schema-first telemetry is a leading technique to achieve that.

## Go Example: Schema-First Telemetry in Practice

Let’s bring this back to a Go developer’s perspective. How might you implement schema-first ideas in Go *today* using OpenTelemetry? While we may not yet have full tooling, you can adopt some patterns:

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

   Add comments or struct tags as needed to document the fields. This struct acts like a mini schema. It doesn’t enforce anything by itself, but it’s a start.

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

5. **Optional – Schema Registration:** If you want to go one step further, you could maintain a simple registry or metadata map in your code that describes these events. For example:

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

   This could be used to programmatically expose the schema (say, via an HTTP endpoint in your service that returns the schema JSON, or in logs at startup). It’s a rudimentary version of a schema registry. Consumers (or your team’s documentation) could pull this info to know what telemetry to expect. While not as robust as a real schema registry, it instills the habit of **treating telemetry fields as contract**.

In a true schema-first setup, much of this would be automated – you’d have an IDL, codegen, etc. But even without full tool support, these practices in Go can bring you closer to schema-first benefits. You get type safety, clarity, and a self-documenting approach.

## Benefits: Why Schema-First Telemetry Matters

**For developers**, schema-first means a better experience when instrumenting code. You get **auto-complete** for telemetry fields (since they are struct fields or constants), and compile-time feedback if you misuse them. It reduces the cognitive load of remembering “what keys should I use here?” because the schema is defined in one place. As Meta’s engineers found, using a type-safe API is “more ergonomic and robust” than generic key-value pairs. It’s akin to the difference between using raw SQL strings versus using an ORM with defined models – the latter catches errors earlier and is easier to navigate with an IDE.

**For telemetry consumers (SREs, analysts, etc.)**, it means telemetry data comes with a map. Data is more **discoverable** – you can list all metrics and their dimensions from the schema registry or metadata store without reading all the source code. The data is more **interpretable** – units and descriptions are readily available, so you don’t have to guess if a duration is in seconds or milliseconds, or what “xyz_flag=true” really signifies. Different telemetry streams can be **correlated** more reliably because shared dimensions are clearly identified. For example, if logs and metrics both have a `customer.id` field per schema, you can confidently join on that; whereas if one had `user` and the other `customerId` in a code-first world, you might not even realize they refer to the same concept.

**For platform engineers and architects**, a schema-first approach enables better **governance and tooling**. You can enforce policies (like “every metric must have a unit annotation” or “PII data must be marked in the schema and handled accordingly”) centrally. It also opens the door to optimizations – for instance, if you know a field is an enum with a limited set of values, you could encode it more efficiently than a free-form string. Meta noted performance benefits by serializing telemetry as a struct (no repeated keys in each record) and using binary encoding. The schema also allows building automated compatibility layers – similar to OTel’s schema transforms, but potentially more powerful because you understand the data types, not just names.

Of course, **schema-first is not free**. It introduces an upfront step – writing or updating the schema – that code-first avoids. The Meta paper acknowledges this added friction, but found it “a worthy trade-off” given the benefits. Tooling (like schema wizards or templates) can mitigate the overhead. Once you have a schema, using it is straightforward, especially if integrated with your build system (Meta integrates schema codegen into their Buck build).

## Conclusion

Schema-first application telemetry brings strong typing and rich metadata into the observability realm. For Go developers, it means moving from ad-hoc strings in code to defined structs and schemas that describe your metrics, logs, and traces. Meta’s implementation shows that this approach can unlock compile-time validation, easier multi-signal correlation, and automatic enforcement of consistency. OpenTelemetry today provides semantic conventions and schema versioning, which address part of the problem, but a fuller schema-first model is on the horizon with community efforts like OTel Weaver and the unification of industry schemas.

Adopting a schema-first mindset, even informally, can improve the quality of telemetry your Go services emit. Start by defining and documenting your telemetry fields in one place (be it an IDL, a Go struct, or even a markdown file in your repo). Use code generation or helper libraries to ensure everyone uses the same definitions. Over time, this could evolve into a more automated schema-first toolchain as the ecosystem develops.

**In the end, telemetry with a schema is like code with types** – it’s safer, clearer, and easier to evolve. As observability becomes ever more crucial in cloud-native systems, schema-first techniques may well become a standard part of a Go developer’s toolkit for building reliable and introspectable services.

**Sources:**

- [Yuri Shkuro et al., *“Positional Paper: Schema-First Application Telemetry”* Meta (2022)](https://arxiv.org/abs/2206.11380).
- [Yuri Shkuro, *"Schema-first Application Telemetry"*, SRECon 2022](https://www.shkuro.com/talks/2022-10-27-schema-first-application-telemetry/)
- OpenTelemetry Project, *[Semantic Conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/) and [Telemetry Schema](https://opentelemetry.io/docs/specs/otel/schemas/)* in spec and OTEPs.
- [Elastic Blog, *“Elastic Common Schema contributes to OpenTelemetry”* Ken Exner (2023)](https://www.elastic.co/blog/ecs-elastic-common-schema-otel-opentelemetry-announcement).
- [Chronosphere Blog, *“Top 3 OpenTelemetry Attribute Naming Best Practices”* (2024)](https://chronosphere.io/learn/top-3-opentelemetry-attribute-naming-best-practices/).
- [Datadog Blog, *“Enrich Your Telemetry with Custom Metadata (Reference Tables)”* (2022)](https://www.datadoghq.com/blog/reference-tables/).
- [OpenTelemetry Weaver](https://github.com/open-telemetry/weaver)
