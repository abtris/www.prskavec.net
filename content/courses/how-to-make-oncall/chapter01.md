---
title: Roster
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 1

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 2
---

The roster is a term used for on-call planning, which describes a group of people who are part of a single on-call rotation. The number of roster layers you have for escalations depends on your company’s standards, industry requirements, and the particular composition of your team. The most commonly used setup includes a primary and secondary on-call in which the role of the secondary is to step up if the primary is overwhelmed. Typically, engineers in both rosters have similar skills.

An alternative is a Tier 1 on-call that escalates to Tier 2. Tier 2 consists of incident commanders or veteran on-call engineers with elevated access rights, capable of resolving even the most complex incidents.

You can have multiple teams, and every team can have a different roster. Still, they can share responsibility for a user support on-call that isn’t directly related to production systems.

## Roster Size

A roster needs enough people to make on-call sustainable. As a rule of thumb:

- **Minimum viable roster**: 5–6 people. Fewer than this means engineers are on-call too frequently, which leads to burnout.
- **Comfortable roster**: 8–10 people. This gives each person roughly one week of primary on-call per two months.
- **Large roster**: 12+ people. Common in larger organizations. Consider splitting into sub-teams with separate rosters to keep rotations focused.

If your team is too small to run a healthy rotation, consider options such as hiring contractors for on-call coverage, cross-training engineers from adjacent teams, or temporarily reducing the scope of what is covered by on-call.

## Rotation Frequency

The most common rotation cadence is **weekly**. Each engineer takes one full week as primary (and optionally one week as secondary) and then is off-call for the remainder of the cycle.

Some teams prefer shorter rotations — for example, daily or every few days — to limit the disruption any one person experiences. However, shorter rotations increase handoff overhead and can make it harder for the on-call engineer to build context about ongoing incidents.

A useful heuristic: match your rotation length to the typical duration of incidents in your system. If most incidents resolve within hours, weekly is fine. If incidents can drag on for days, shorter rotations reduce the risk of one person carrying the full burden alone.

## Health and Burnout

On-call duty is inherently stressful. Frequent night-time pages, even if quickly resolved, fragment sleep and accumulate cognitive debt over time. To keep your team healthy:

- Track the number of pages per shift and set a threshold that triggers a review (e.g., more than 5 pages per night on average).
- Rotate people off on-call promptly after a difficult week — avoid back-to-back rotations.
- Give engineers protected recovery time after severe incidents (see the chapter on shift swaps).
- Make it easy and culturally safe to say "I'm exhausted and need a swap."

## Multi-Team Rosters

You can have multiple teams, each with its own roster. In large organizations, it is common to have:

- A **platform or infrastructure** on-call for system-level issues.
- A **product engineering** on-call per major service area.
- A **customer-facing support** on-call that handles user-reported issues before escalating to engineering.

Teams can collaborate by routing alerts to the right roster based on the affected service, rather than having a single engineer responsible for everything. This requires clear ownership mapping (often maintained in a service catalog or runbook index).
