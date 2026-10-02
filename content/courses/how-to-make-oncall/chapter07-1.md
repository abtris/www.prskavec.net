---
title: "Weekly rotations: a worked example"
chapter_number: "7.1"
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
lastmod: "2026-10-02T00:00:00+02:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 75

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 9
---

This is a worked example of one option from [Chapter 7: Choosing an on-call pattern](../chapter07/). Here we choose weekly assignments, with a primary and a different secondary available at all times. At multiple sites, the same people own their local windows for a week, but responsibility passes between sites every day.

For more background, I recommend Chapter 14 on on-call in *The Practice of Cloud System Administration* [^3].

## Assumptions and hours

The schedules below use deliberately small rosters to show the arithmetic. They are not recommended staffing levels. The [comparison in Chapter 7](../chapter07/#how-many-people-do-we-need) explains the need for additional capacity and the distinction between standby and active incident work.

We use a seven-day week, two simultaneous roles, and an eight-hour local working day from Monday to Friday. Shift windows are adjacent: an ending hour belongs to the next shift. Handover overlap would require extra coverage time.

| Weekly assignment | 1 site | 2 sites | 3 sites |
| --- | ---: | ---: | ---: |
| Service coverage (hours/week) | 168 | 168 | 168 |
| Simultaneous roles (primary + secondary) | 2 | 2 | 2 |
| Total standby across both roles (person-hours/week) | 336 | 336 | 336 |
| Daily window owned by each site (hours) | 24 | 12 | 8 |
| Standby for one assigned person that week (hours) | 168 | 84 | 56 |
| Coverage handovers per role | 1/week | 2/day | 3/day |
| People per site in the example | 8 | 4 | 3 |
| Total people in the example | 8 | 8 | 9 |
| Cycle to serve once in each role (weeks) | 8 | 4 | 3 |
| Average combined standby per person (hours/week over the cycle) | 42 | 42 | 37.3 |
| Combined standby as a share of calendar time | 25% | 25% | 22.2% |
| Outside working hours on an assigned weekday, if the window includes a full local workday (hours) | 16 | 4 | 0 |
| Weekend standby for one assigned person (hours across both days) | 48 | 24 | 16 |
| Total outside working hours for one assigned week under that assumption (hours) | 128 | 44 | 16 |

The last three rows assume each site's window includes its full eight-hour workday. The Singapore/London/San Francisco combination below covers the day using these winter office hours. Replacing London with Paris creates an overlap and a gap, so that combination needs adjusted shifts. Weekends still need coverage even when all shifts are in local daytime.

## One site

| Four-week excerpt | 1w | 2w | 3w | 4w |
| --- | :-: | :-: | :-: | :-: |
| Primary | Ann | Ben | Cara | Dan |
| Secondary | Eve | Finn | Gina | Hank |

This table shows the first four weeks of an eight-week cycle. In weeks 5–8, repeat the names with the primary and secondary roles swapped. Each person then serves once in each role per cycle. I don't recommend back-to-back shifts, as many teams do — it's not healthy. These small rosters leave little room for absence. You need extra capacity for vacations, sick days, and recovery after incidents; see the staffing guidance in Chapter 7.

## Two sites

| Four-week excerpt | 1w | 2w | 3w | 4w |
| --- | :-: | :-: | :-: | :-: |
| Site 1 – Primary | Ann | Eve | Gina | Cara |
| Site 1 – Secondary | Cara | Ann | Eve | Gina |
| Site 2 – Primary | Ben | Finn | Hank | Dan |
| Site 2 – Secondary | Dan | Ben | Finn | Hank |

We have 8 people rotating every 4 weeks. The SRE book recommends 6 people per site, and I agree. This calculation is a bare minimum — I recommend at least 6 people per site.

## Three sites

| Three-week cycle, then repeat | 1w | 2w | 3w | 4w = 1w |
| --- | :-: | :-: | :-: | :-: |
| Site 1 – Primary | Ann | Dan | Gina | Ann |
| Site 1 – Secondary | Gina | Ann | Dan | Gina |
| Site 2 – Primary | Ben | Eve | Hank | Ben |
| Site 2 – Secondary | Hank | Ben | Eve | Hank |
| Site 3 – Primary | Cara | Finn | Ivy | Cara |
| Site 3 – Secondary | Ivy | Cara | Finn | Ivy |

We have 9 people rotating every 3 weeks. Still, I would go with 6 people per site.

Many other scenarios you can find here in [PagerDuty documentation](https://support.pagerduty.com/main/docs/schedule-examples). I recommend looking into it for inspiration.

## Time Zones

The last important consideration for multi-site teams is time zones. You often can't choose where your teams are located. If you can, try to make it work for on-call, which needs enough time zone distance for shift coverage, but not so much that it creates communication gaps. Finding the optimal balance is hard.

An 8-hour time zone difference works well from my perspective. I show an example with a few time zones and what three-site and two-site coverage looks like.

I worked with US (PST) and EU teams — the common overlap is very limited at 2-3 hours, but for two-site shifts it works well. If you need a third location, looking east to Singapore or Thailand is a good option.

Adding India to a European team adds relatively little daytime coverage: Mumbai is 4.5 hours ahead of Paris in winter and 3.5 hours in summer. Whether a US/Europe/India arrangement works depends on the actual shift windows, not just the number of sites.

> **Note:** the offsets below are for winter (standard time). During summer daylight saving time (DST) most of these shift by an hour, so the overlap windows move accordingly.

Working hours 09:00–17:00, mapped against UTC. Each row represents one hour starting at the displayed time; 17:00 is outside the workday. A cell shows the local starting hour when a site is working.

| UTC | Singapore (UTC+8) | London (UTC) | Paris (UTC+1) | SF (PST, UTC−8) |
| :-: | :-: | :-: | :-: | :-: |
| 00 |  |  |  | 16 |
| 01 | 09 |  |  |  |
| 02 | 10 |  |  |  |
| 03 | 11 |  |  |  |
| 04 | 12 |  |  |  |
| 05 | 13 |  |  |  |
| 06 | 14 |  |  |  |
| 07 | 15 |  |  |  |
| 08 | 16 |  | 09 |  |
| 09 |  | 09 | 10 |  |
| 10 |  | 10 | 11 |  |
| 11 |  | 11 | 12 |  |
| 12 |  | 12 | 13 |  |
| 13 |  | 13 | 14 |  |
| 14 |  | 14 | 15 |  |
| 15 |  | 15 | 16 |  |
| 16 |  | 16 |  |  |
| 17 |  |  |  | 09 |
| 18 |  |  |  | 10 |
| 19 |  |  |  | 11 |
| 20 |  |  |  | 12 |
| 21 |  |  |  | 13 |
| 22 |  |  |  | 14 |
| 23 |  |  |  | 15 |

Singapore, London, and San Francisco cover all 24 hours with these winter office hours. Replacing London with Paris leaves 16:00–17:00 UTC uncovered and duplicates 08:00–09:00 UTC. Move the shift boundaries or arrange extra coverage; adding a third office alone does not guarantee 24/7 coverage. Recheck the arrangement during daylight saving time, including the weeks when Europe and the US change clocks on different dates.

Two-site twelve-hour shifts, mapped against UTC: London covers 05:00–17:00 UTC and San Francisco covers 17:00–05:00 UTC. In winter those are 05:00–17:00 London time and 09:00–21:00 San Francisco time. Each window includes the full local workday plus four hours outside it.

| UTC | London (UTC) | SF (PST, UTC−8) |
| :-: | :-: | :-: |
| 00 |  | 16 |
| 01 |  | 17 |
| 02 |  | 18 |
| 03 |  | 19 |
| 04 |  | 20 |
| 05 | 05 |  |
| 06 | 06 |  |
| 07 | 07 |  |
| 08 | 08 |  |
| 09 | 09 |  |
| 10 | 10 |  |
| 11 | 11 |  |
| 12 | 12 |  |
| 13 | 13 |  |
| 14 | 14 |  |
| 15 | 15 |  |
| 16 | 16 |  |
| 17 |  | 09 |
| 18 |  | 10 |
| 19 |  | 11 |
| 20 |  | 12 |
| 21 |  | 13 |
| 22 |  | 14 |
| 23 |  | 15 |

[^3]: T. A. Limoncelli, S. R. Chalup, and C. J. Hogan, The Practice of Cloud System Administration: Designing and Operating Large Distributed Systems, Volume 2: Addison-Wesley, 2014. - https://learning.oreilly.com/library/view/practice-of-cloud/9780133478549/title.html
