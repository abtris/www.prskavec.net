---
title: Primary vs secondary
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 3

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 4
---

When you have a primary and secondary on-call, several design decisions shape how effective the arrangement is. Here are the key questions to answer for your team.

## Should the same people rotate through both rosters?

The most common approach is to rotate the **same pool of engineers** through both primary and secondary slots, just offset by one week. This keeps the secondary familiar with the current state of the system and means everyone shares the on-call burden equally.

A less common alternative is to have a separate, dedicated secondary pool. This works well if there is a significant experience gap on the team, but it can create resentment if senior engineers feel they are permanently on standby to fix junior mistakes.

## Should junior engineers be on primary?

Putting junior engineers on primary can accelerate their learning. The key condition is that the secondary must be genuinely available and willing to help, not just nominally reachable.

If your junior engineers are not yet ready to handle pages independently, consider a **shadow rotation** first: they observe the primary for one or two full rotations before taking on primary responsibility themselves.

## What if both primary and secondary are stuck?

This should be rare, but you need a defined escalation path for when it happens. Options include:

- **Manager on-call**: A team lead or engineering manager is listed as a third escalation tier. Their role is not to fix the incident technically, but to coordinate resources, make judgment calls, and communicate with stakeholders.
- **Team-wide page**: A broadcast to all team members as a last resort. This is disruptive and should be reserved for true severity-1 situations.
- **Cross-team escalation**: A defined contact at a platform or infrastructure team who can assist when the incident crosses service boundaries.

Document this escalation path in your runbooks so that on-call engineers do not have to figure it out under pressure.

## Escalation Timeouts

Define how long the primary has to acknowledge and begin responding before the secondary is automatically paged. A common setting is **5-10 minutes** for acknowledgment, after which the secondary receives the same alert. If the secondary also does not acknowledge within another 5-10 minutes, the third-level escalation fires.

Most on-call tools (PagerDuty, Grafana OnCall, ilert) support configuring these timeouts as part of an escalation policy. Set them once and review them quarterly.

## Do You Need a Manager On-Call?

A dedicated manager on-call rotation is worth considering when:

- Incidents frequently require cross-team coordination or external vendor escalation.
- Business stakeholders need regular status updates during incidents.
- Your on-call engineers are junior and benefit from having someone to make judgment calls.

If your incidents are mostly self-contained and your engineers are experienced, a manager on-call adds overhead without much value. A simple on-call rotation with a well-documented escalation path is sufficient.
