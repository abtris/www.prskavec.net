---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Agent Harnesses: Why You Shouldn't Bet Your Company on Claude Code or Codex"
subtitle: ""
summary: "Coding agents are great, but locking your company into Claude Code or Codex is a strategic mistake. Here is why agent harnesses matter and what to do instead."
authors: ["abtris"]
tags: ["ai","agents","tooling"]
categories: []
date: 2026-06-02T09:00:00+01:00
lastmod: 2026-06-02T09:00:00+01:00
featured: true
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
projects: []
---

Coding agents have gone from novelty to daily driver in less than two years. Tools like [Claude Code](https://www.anthropic.com/claude-code) and [OpenAI Codex](https://openai.com/codex/) are genuinely impressive: they read your repo, run commands, edit files, and close the loop on real work. I use them. You probably do too.

But there is a difference between *using* a tool and *betting your company on it*. If you standardize your whole organization on a single vendor's closed agent, you are making a strategic decision that is easy to start and very expensive to walk back. Let me explain why, and what to do instead.

## What is an agent harness?

When people say "Claude Code" or "Codex," they usually mean two things glued together:

1. **The model** — the LLM that does the reasoning (Claude, GPT, etc.).
2. **The harness** — everything around the model: the tool-calling loop, file editing, command execution, context management, permissions, prompts, and the UI.

The harness is the part that actually turns a chat model into an *agent*. It decides which tools exist, how context is assembled, when to ask for permission, and how errors are recovered. The model is a commodity you rent by the token. The harness is where your real workflow lives.

Here is the uncomfortable truth: **the harness is the valuable part, and the vendor owns it.**

## The case against vendor lock-in

### 1. You are coupling your workflow to someone else's roadmap

When you adopt Claude Code or Codex wholesale, your engineers' muscle memory, your CI integrations, your custom commands, and your prompts all get shaped by that specific harness. The moment the vendor changes pricing, deprecates a feature, throttles your usage, or pivots, you absorb the cost. You don't control the roadmap and you can't fork it.

### 2. The model is the easy part to swap — if your harness allows it

Models leapfrog each other every few months. The best model for your codebase in Q1 may be second-best by Q3. A good setup lets you switch models when the price/performance curve moves. A closed vendor harness ties you to *their* model family. You lose the single biggest lever you have: choosing the best model for the task at the best price.

### 3. Data and compliance boundaries are not negotiable for many companies

Where does your code go? What is logged, retained, and used for training? With a closed harness you accept the vendor's answers. For regulated industries, air-gapped environments, or anyone with serious IP concerns, "trust us" is not an architecture. An open harness lets you choose providers, route to self-hosted or enterprise endpoints, and keep an audit trail you actually own.

### 4. Lock-in is cheap to enter and expensive to exit

The honeymoon is fantastic. Then you have hundreds of engineers with vendor-specific habits, internal tooling built against a proprietary CLI, and no abstraction layer. Migrating later means retraining people and rebuilding integrations. The cost of switching is exactly what gives the vendor pricing power over you.

### 5. Your competitive edge should not be a SaaS subscription

If everyone in your industry uses the same off-the-shelf agent the same way, where is your advantage? The leverage comes from *how* you wire agents into your codebase, your domain knowledge, your tests, and your review process. That belongs in something you control.

## The alternative: own the harness, rent the model

This is not an argument against AI coding agents. It is an argument for putting the boundary in the right place. Here is the setup I actually recommend.

### Own the harness with pi

[pi](https://pi.dev) is a minimal, extensible terminal coding harness. The whole philosophy is "adapt the tool to your workflow, not the other way around" — and crucially, you do that *without forking the agent's internals*. You extend it with TypeScript [extensions](https://pi.dev), [skills](https://pi.dev), prompt templates, and themes, then package and share those across your team via npm or git.

That is exactly the property you want from a company harness:

- Your custom tools, prompts, permissions, and skills become **version-controlled artifacts in your repo**, not settings trapped in a vendor's cloud.
- It runs in **interactive, print/JSON, RPC, and SDK modes**, so the same harness powers your engineers' terminals *and* your CI pipelines and internal apps.
- It ships with sensible defaults but stays small, so you only add the complexity you actually need.

You get the ergonomics of Claude Code or Codex, but the workflow logic belongs to you and travels with your codebase.

### Rent the model through a gateway

Keep the model pluggable. The easiest path is [opencode.ai](https://opencode.ai), which acts as a model gateway giving you access to basically every model worth using behind one consistent interface. Swap Anthropic, OpenAI, Google, and open-weight models based on price/performance without rewriting anything.

If you have stricter data or compliance requirements — and many companies do — go through a **cloud provider gateway** instead. [Amazon Bedrock](https://aws.amazon.com/bedrock/) and [Azure AI Foundry](https://azure.microsoft.com/en-us/products/ai-foundry) give you the same model menu inside your existing cloud account, with your org's networking, IAM, logging, and data-residency guarantees already in place. For regulated or IP-sensitive work, that is often the right answer.

Either way, standardize on the [OpenAI-compatible API](https://platform.openai.com/docs/api-reference) shape as the lowest common denominator so swapping providers is a config change, not a migration.

### Measure and route

Once the model is a swappable component, you can benchmark cost and quality per task and route deliberately: a cheap fast model for boilerplate, a strong model for tricky refactors. With pi owning the loop and a gateway in front, that routing is yours to tune.

## "But Claude Code / Codex is just better right now"

Maybe today. That is exactly the trap. The quality gap between the leading harness and the open ones is closing fast, and the open ones move in the open. Optimizing for "best this quarter" at the cost of "locked in for years" is a bad trade for anything as foundational as how your company writes software.

Use the good tools. Just don't build your house on rented land.

## Takeaways

- The **harness** — not the model — is where your workflow lives, and closed vendors own it.
- The **model** should be a swappable commodity; lock-in robs you of that lever.
- Data, compliance, and cost control are all weaker when the harness is a black box.
- Use an extensible harness like **[pi](https://pi.dev)** and keep your prompts, tools, and skills version-controlled in your own repo.
- Rent models through a gateway — **[opencode.ai](https://opencode.ai)** for breadth, or **Bedrock / Azure AI Foundry** when compliance and data residency matter.

Adopt agents aggressively. Own the boundary deliberately.
