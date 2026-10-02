---
title: Choosing an on-call pattern
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
lastmod: "2026-10-02T00:00:00+02:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 70

weight: 8
---

Weekly shifts are one option. Start with the hours your service needs a human response, the people who can resolve incidents, and how often the pager interrupts them. Then choose the rotation. A quiet service and a service that wakes someone every night need different arrangements, even if both promise 24/7 coverage.

There are three separate choices: **coverage window** (business hours or 24/7), **shift length and rotation cadence** (daily or weekly), and **escalation roles** (primary and secondary). You can combine them. For example, a team can rotate weekly while handing coverage between regions every eight hours.

## Compare the patterns

These are planning examples, not universal minimum team sizes. Except for the staffed-operations example below, each row assumes **one primary and one different secondary available throughout the coverage window**, sharing the same pool of trained responders. Both roles count toward standby time. Add capacity for leave, training, recovery after incidents, and uneven skills.

“Coverage” means the service's response window. “Standby” means one person's time assigned to either role; it is not hours spent actively fixing incidents. Business hours below mean Monday–Friday, 09:00–17:00, excluding holidays.

| Pattern | Example roster: primary + secondary | Time zones / sites | Service coverage | One person's assignment | Nights and weekends | Best fit / main cost |
| --- | --- | --- | --- | --- | --- | --- |
| **Business-hours only** | 4 people; illustrative daytime pool | 1, or a clearly defined customer time zone | 40 h/week | 8 h/day; rotate daily or weekly | No scheduled response outside the window | Services that can wait until the next business day. The response promise must explicitly allow this. |
| **[Weekly, single site](../chapter07-1/#one-site)** | 8 people; baseline calculation below | 1 | 168 h/week (24/7) | 168 h for an assigned week | One person carries each role through seven nights and a weekend | Low page volume and incidents that benefit from continuity. Restricts personal plans for a whole week. |
| **Daily, single site** | 8 people; same total coverage as weekly | 1 | 168 h/week | 24 h per assignment | Each assignment includes a night; distribute weekend days separately | Shorter periods of restricted availability. Needs daily handovers and deliberate weekend fairness. |
| **Separate weekday and weekend rotations** | 8 people shared across both schedules | 1 | 168 h/week | 120 h weekday block + a different person's 48 h weekend block; weekend can also split into two 24 h blocks | Weekday nights remain; weekends have a separate roster | Teams wanting predictable free weekends and easier swaps. Balance weekend duty separately from weekday hours. |
| **Day/night split at one site** | 8 people; arithmetic baseline, not a night-work staffing recommendation | 1 | 168 h/week | 12 h day or night windows | Local night work and weekends remain | A long standby block is the main problem. Two handovers/day; shorter shifts alone do not solve sleep disruption. |
| **Two-region follow-the-sun** | 12 people: 6/site, following Google's dual-site guidance [1] | 2 sufficiently separated regions | 168 h/week | 12 h/day; 84 h if assigned that window for seven days | Usually some hours outside local business hours; weekends remain | Teams already operating in two regions. Reduces overnight duty, but two eight-hour workdays cover only 16 hours. |
| **Three-region follow-the-sun** | 18 people: 6/site as a conservative planning example, not a published minimum | 3 regions with complementary working hours | 168 h/week | 8 h/day; 56 h if assigned that window for seven days | Can avoid local nights if actual time windows align; weekends remain | Global teams with equivalent access and skills in every region. Three handovers/day and more coordination. |
| **Optional hybrid: daily primary, weekly secondary** | 8 people, with collision checks between rosters | 1; can combine with regional coverage | 168 h/week | Primary: 24 h; secondary: 168 h | Secondary is still restricted for a whole week | Short primary assignments with a backup retaining incident context. Secondary must be lightly interrupted, with recovery time when called. |

PagerDuty documents daily, weekly, split weekday/weekend, day/night, and regional schedule configurations [2]. The roster counts above are calculations or stated planning choices; a tool's sample schedule does not establish sustainable staffing.

The mixed daily/weekly row is an optional design combination, rather than a pattern whose prevalence these sources establish. PagerDuty's regional example also uses a separate whole-weekend assignment; the table's seven-day regional coverage is a planning extension of that example, with weekends explicitly staffed in each region.

For weekday/weekend blocks, choose explicit boundaries, such as Monday 09:00–Saturday 09:00 and Saturday 09:00–Monday 09:00. If the team wants the weekend roster to start Friday evening, recalculate the hours: it is no longer a 120/48 split.

## How many people do we need?

For a single shared pool, start with:

> Average standby hours per person per week = covered hours per week × simultaneous roles ÷ trained responders.

For 24/7 coverage with primary and secondary, this is **168 × 2 = 336 person-hours of standby per week**. With eight people, the average is **42 hours per person per week** across the full rotation. With four people, it is 84 hours. Changing to daily shifts does not change either total.

Eight people can each take one primary week and one secondary week in an eight-week cycle: two of eight weeks assigned, or **25% of calendar time**. This is the basis for Google's eight-person single-site minimum under its assumptions [1]. It is not 25% of a 40-hour working week, and it is not 42 hours of incident work. Standby can overlap normal working hours. An assigned weekly block is still 168 consecutive hours, even when the long-run average is 42.

Google's SRE Workbook adds a useful distinction: eight is the bare single-site minimum; **nine provides capacity for one temporary absence**. For multisite teams, it describes five per site as bare minimum and six per site with that extra capacity [3]. More leave, simultaneous absences, or a heavy incident load can require more people.

For the four-person business-hours example, the same arithmetic gives **40 × 2 ÷ 4 = 20 standby hours per person per week**. That occupies half of each person's normal working hours on average. It is only useful if the interrupt load leaves enough time for other work.

For regional rotations, calculate capacity **per site and per role**, not just globally. A site with too few independently capable responders cannot be rescued by a generous global headcount unless another region can actually cover its window. Google's dual-site guidance uses six people per site to account for the constraints of a workable local rotation [1]. The three-region example applies the same six-person planning allowance to each site; it is not a Google recommendation for three sites.

These calculations exclude overlapping handovers and extra incident roles. Budget those separately. Track active response time, overnight wake-ups, and recovery time alongside standby hours: a quiet secondary shift and a busy primary shift can have equal scheduled hours but very different costs.

## When staffed shifts are a better fit

If alerts routinely require continuous work, consider a staffed operations team with eight- or twelve-hour shifts and a defined engineering escalation path. This is a different staffing model: someone is working throughout the shift, rather than remaining available while doing other work or sleeping.

One continuously staffed seat requires **168 working hours/week**. At 40 hours per person, that is **4.2 full-time equivalents before leave, breaks, training, and sickness**. If each person provides 30 hours/week of usable coverage after those allowances, round 168 ÷ 30 up to **6 people per seat**. Two continuously staffed seats need 12 under the same assumption. Those are capacity examples, not a finished legal or operational roster; engineering escalation needs its own coverage too.

A central operations team or an external provider can supply this first response layer. Either needs the access, runbooks, and authority to mitigate incidents. If it can only forward pages, engineers still carry the underlying on-call burden.

## Choose for your use case

- **Customers can wait until the next business day:** choose business-hours coverage and publish the response window. Global users do not automatically require 24/7 human response; the service promise decides.
- **One region, quiet pager:** weekly shifts are simple. Choose daily shifts if a whole week of restricted availability is the bigger problem for the team.
- **Weekends cause most scheduling friction:** separate weekday and weekend rotations, then track weekend days, holidays, and nights as well as total hours.
- **Two established regions:** consider twelve-hour regional windows. Check the actual local start and end times before promising that nobody works at night.
- **Three established regions:** use eight-hour follow-the-sun windows if their coverage forms a complete 24-hour day. Include handover overlap and a separate weekend plan.
- **Daily handovers lose too much context:** consider daily primary with weekly secondary. Keep a written incident handover; the secondary should not become the only person who knows what is happening.
- **Frequent overnight pages or near-continuous incident work:** fix alert noise and recurring failures, and reassess staffing. Shorter rotations distribute the load but do not reduce it.
- **Too few trained responders for the promised coverage:** pool compatible services or teams, train more responders, fund additional coverage, or renegotiate the response window. Check that pooled responders can resolve incidents across every included service.

Before adopting a schedule, map every coverage window to UTC and local time, including daylight-saving transition weeks. Three offices do not necessarily cover three useful time zones. Check weekends, public holidays, leave, and what happens when a region is unavailable. Specify who owns an incident across a handover and who covers while the outgoing responder rests.

As a concrete workload check, Google's SRE Workbook recommends limiting shifts to **12 hours when the rotation receives one or more pages per day** [3]. A weekly rotation can still work with daily relief windows; it should not mean seven days without relief from a busy pager.

Try the schedule for one full rotation cycle, then review pages per shift, overnight interruptions, active incident hours, swaps, missed acknowledgments, and the team's feedback. Agree in advance which problems would make you change the pattern.

## Worked example: weekly rotations

For a detailed schedule, continue to [Chapter 7.1: Weekly rotations](../chapter07-1/). It works through primary and secondary rosters at one, two, and three sites, including the time-zone coverage. Use it after choosing whether weekly assignments suit your team.

## Sources

1. Google, [Site Reliability Engineering: Being On-Call](https://sre.google/sre-book/being-on-call/) — primary/secondary roles, the 25% on-call limit under Google's model, and single-site/dual-site staffing guidance.
2. PagerDuty, [Schedule Examples](https://support.pagerduty.com/main/docs/schedule-examples) — examples of configuring coverage windows and rotation patterns. Configuration examples are not staffing recommendations.
3. Google, [The Site Reliability Workbook: On-Call](https://sre.google/workbook/on-call/) — shift-length guidance, local day/night splitting, and capacity for temporary staffing reductions.
