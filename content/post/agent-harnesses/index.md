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

In less than two years, coding agents went from novelty to daily driver. [Claude Code](https://www.anthropic.com/claude-code) and [OpenAI Codex](https://openai.com/codex/) read your repo, run commands, edit files, and finish real work. I use them every day. You probably do too.

Using a tool is one thing. Standardizing your whole company on a single vendor's closed agent is another. That decision is easy to make and very expensive to walk back, so it is worth thinking through before you make it.

## What is an agent harness?

When people say "Claude Code" or "Codex," they usually mean two things glued together:

1. **The model**, the LLM that does the reasoning (Claude, GPT, and so on).
2. **The harness**, everything around the model: the tool-calling loop, file editing, command execution, context management, permissions, prompts, and the UI.

The harness is what turns a chat model into an *agent*. It decides which tools exist, how context is assembled, when to ask for permission, and how errors get recovered. The model is a commodity you rent by the token. The harness is where your actual workflow lives.

And the harness is the valuable part. The vendor owns it.

## The case against vendor lock-in

### 1. You couple your workflow to someone else's roadmap

Adopt Claude Code or Codex wholesale and your engineers' muscle memory, your CI integrations, your custom commands, and your prompts all get shaped by that one harness. When the vendor changes pricing, drops a feature, throttles your usage, or pivots, you pay for it. You don't control the roadmap and you can't fork it.

### 2. The model is the easy part to swap, if the harness lets you

A new best model shows up every few months. The model that fits your codebase best in Q1 may be second-best by Q3. A good setup lets you switch when the price/performance curve moves. A closed vendor harness ties you to their model family, and that costs you the biggest lever you have: picking the best model for the task at the best price.

### 3. Data and compliance boundaries are not negotiable for many companies

Where does your code go? What gets logged, retained, and used for training? With a closed harness you take the vendor's answers as given. For regulated industries, air-gapped environments, or anyone with serious IP concerns, that is not enough. An open harness lets you choose providers, route to self-hosted or enterprise endpoints, and keep an audit trail you actually own.

### 4. Lock-in is cheap to enter and expensive to leave

The start is great. Then you have hundreds of engineers with vendor-specific habits, internal tooling built against a proprietary CLI, and no abstraction layer. Migrating later means retraining people and rebuilding integrations. That switching cost is exactly what gives the vendor pricing power over you.

### 5. Your competitive edge should not be a SaaS subscription

If everyone in your industry runs the same off-the-shelf agent the same way, where is your advantage? The leverage is in *how* you wire agents into your codebase, your domain knowledge, your tests, and your review process. That belongs in something you control.

## The alternative: own the harness, rent the model

This is not an argument against AI coding agents. It is an argument for putting the boundary in the right place. Here is the setup I recommend.

### Own the harness with pi

[pi](https://pi.dev) is a minimal, extensible terminal coding harness. The idea is to adapt the tool to your workflow instead of the other way around, and you do that without forking the agent's internals. You extend it with TypeScript extensions, skills, prompt templates, and themes, then package and share them across your team over npm or git.

That gives you what you want from a company harness:

- Your custom tools, prompts, permissions, and skills become version-controlled artifacts in your repo, not settings trapped in a vendor's cloud.
- It runs in interactive, print/JSON, RPC, and SDK modes, so the same harness powers your engineers' terminals and your CI pipelines and internal apps.
- It ships with sensible defaults but stays small, so you add only the complexity you need.

You get the ergonomics of Claude Code or Codex, but the workflow logic is yours and travels with your codebase.

### Rent the model through a gateway

Keep the model pluggable. The simplest path is [OpenRouter](https://openrouter.ai), a model gateway that gives you access to basically every model worth using behind one interface. Swap Anthropic, OpenAI, Google, and open-weight models on price/performance without rewriting anything.

If your data or compliance requirements are stricter, and for many companies they are, go through a cloud provider gateway instead. [Amazon Bedrock](https://aws.amazon.com/bedrock/) and [Azure AI Foundry](https://azure.microsoft.com/en-us/products/ai-foundry) give you the same model menu inside your existing cloud account, with your org's networking, IAM, logging, and data-residency guarantees already in place. For regulated or IP-sensitive work, that is often the right answer.

Either way, standardize on the [OpenAI-compatible API](https://platform.openai.com/docs/api-reference) shape as the lowest common denominator, so swapping providers is a config change and not a migration.

### Measure and route

Once the model is a swappable component, you can benchmark cost and quality per task and route on purpose: a cheap fast model for boilerplate, a strong one for tricky refactors. With pi owning the loop and a gateway in front, that routing is yours to tune.

## "But Claude Code / Codex is just better right now"

Maybe today. The gap between the leading harness and the open ones is closing fast, and the open ones are built out in the open. Optimizing for "best this quarter" while you lock yourself in for years is a bad trade, especially for something as foundational as how your company writes software.

Use the good tools. Just don't let one of them become the thing you can't leave.

## Takeaways

- The harness, not the model, is where your workflow lives, and closed vendors own it.
- Treat the model as a swappable commodity. Lock-in takes that lever away.
- Data, compliance, and cost control all get harder when the harness is a black box.
- Use an extensible harness like [pi](https://pi.dev) and keep your prompts, tools, and skills version-controlled in your own repo.
- Rent models through a gateway: [OpenRouter](https://openrouter.ai) for breadth, or [Bedrock](https://aws.amazon.com/bedrock/) / [Azure AI Foundry](https://azure.microsoft.com/en-us/products/ai-foundry) when compliance and data residency matter.

Adopt agents fast, but keep the boundary, the harness and the choice of model, in your own hands.
