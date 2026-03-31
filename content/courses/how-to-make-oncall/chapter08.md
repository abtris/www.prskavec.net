---
title: OnCall Market
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 8

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 13
---

An on-call market is a structured, team-managed process for swapping shifts. Without one, swaps happen ad hoc — through direct messages, verbal agreements, or changes made directly in the pager tool by someone other than the engineer on duty. These informal swaps are fragile: they get forgotten, they create coverage gaps, and they make it hard to audit who was actually responsible for an incident.

A well-run on-call market solves this by making swaps visible, fair, and easy to complete safely.

## Why You Need a Formal Swap Process

Rotations are designed around a predictable schedule, but life is not predictable. Engineers take vacations, have medical appointments, attend conferences, or simply have an unusually bad week. A formal swap process acknowledges this reality and gives your team a safe release valve.

Without an explicit process, two failure modes emerge:

- **Invisible swaps**: An engineer asks a colleague to cover, the colleague agrees, but neither updates the pager tool. When an alert fires, the wrong person is paged — or worse, no one is.
- **Swap refusal culture**: Engineers are afraid to ask for help because there is no norm around it. They white-knuckle bad weeks alone, which leads to burnout and resentment.

A swap market addresses both by creating a lightweight social and technical norm.

## Fairness Rules

Keep the following principles to prevent the market from being gamed:

- **1:1 swaps only.** Every shift swap must be reciprocal — if you take someone's Saturday, you owe them a shift in return. No one should be able to sell shifts for money or credit.
- **Same-role swaps only.** Primary swaps with primary, secondary with secondary. Never allow a primary engineer to swap down to secondary without also arranging a replacement for the secondary slot.
- **No permanent volunteers.** If the same person keeps absorbing others' shifts, that is a roster health problem, not a market success story. Track it.
- **Advance notice window.** Require swaps to be posted at least 24–48 hours before the shift starts. Emergency exceptions happen, but a pattern of last-minute swaps signals schedule planning issues.

## Running the Market in Practice

Most teams run their swap market in a dedicated Slack or Teams channel. A simple, effective format:

```
[SWAP REQUEST] Primary: Tue 18 Mar – Thu 20 Mar
I need coverage for these days. Can offer: next weekend (Sat 29 – Sun 30 Mar).
```

The person accepting replies in thread, confirms the exchange, and then **both engineers update the pager tool immediately** — not after the shift, not "later today."

Establish a norm: the swap is not complete until it is reflected in the on-call schedule. The requester is responsible for confirming the update happened.

## Tooling Support

Most modern pager tools support shift overrides, which are the correct mechanism for recording a swap:

| Tool | Swap/Override Feature |
|---|---|
| PagerDuty | Schedule Overrides — override a specific time window with another user |
| Opsgenie / JSM | Schedule overrides in the rotation editor |
| ilert | On-call override per user |
| Grafana OnCall | Manual override for a time window |
| Squadcast | Override a rotation slot directly |

Prefer using the tool's native override rather than editing the rotation schedule itself. Overrides are time-bounded and automatically revert — they leave the base rotation intact and create a clear audit trail.

## Automated Safety Checks

Even with a formal process, mistakes happen. Automated checks catch them before they cause problems:

- **Overlap check**: Verify that no engineer appears as both primary and secondary in any time window. This is the most common mistake in manual swaps.
- **Coverage gap check**: Verify that every time window has exactly one primary and one secondary assigned. A missing secondary is a silent risk.
- **Advance horizon check**: Scan the next 7–14 days for any unresolved gaps or conflicts. Surface these in your team channel at the start of the week so there is time to fix them.

You can implement these as a simple script that queries your pager tool's API and posts a daily or weekly summary to Slack. PagerDuty, OpsGenie/JSM, Grafana OnCall, and most other tools expose schedule data through a REST API.

## When the Market Breaks Down

If your swap market is constantly busy, that is a signal — not a success. A high swap volume usually means:

- The rotation is too frequent (weekly for a small team is often too much)
- The on-call load is too heavy (too many pages, too many hours of active incident work)
- The roster is too small (people feel they cannot take time off without disrupting the team)

Treat a consistently active swap market as a roster health metric. Review it alongside your page volume and incident duration data in your regular on-call retrospective.
