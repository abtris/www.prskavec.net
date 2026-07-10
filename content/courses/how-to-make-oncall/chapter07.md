---
title: Weekly oncall
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 7

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 8
---

For an overview of on-call, I recommend reading Chapter 14 on On-call [^3].

But now to my example:

- We have team with primary and secondary roster
- We can find what is best for us using 1 - 3 sites
- We are looking how many people we need and how we calculate costs
- We don’t try to focus on daily shifts that will make example more complicated
- We don’t use combinations as primary in daily and secondary weekly that make example more complicated too
- We're skipping many possible combinations, don’t think that is only good way how to do it, this is more about how you think for your use case

Some numbers first — calculate and consider what matters most to you, and whether you have enough people to reach at least this minimum with your conditions. My example uses two rosters, and we can choose between 1-3 sites.

| Weekly on-call shifts | 1 site | 2 sites | 3 sites |
| --- | ---: | ---: | ---: |
| Monthly hours | 720 | 720 | 720 |
| Number of handovers | 1 | 2 | 3 |
| Number of rosters (primary, secondary, ..) | 2 | 2 | 2 |
| Daily shift (hours) | 24 | 12 | 8 |
| Weekly shift (hours) | 168 | 84 | 56 |
| Recommended min. hours per month (10%) | 72 | 72 | 72 |
| Recommended max. hours per month (25%) | 180 | 180 | 180 |
| Weekly shift is this amount of percent per recommend value (%) | 93% | 47% | 31% |
| Daily ratio percent per recommend value (%) | 13% | 7% | 4% |
| How many weekly shifts in persons need for month | 4 | 8 | 12 |
| Number of people that you need (weekly shifts) | 8 | 8 | 9 |
| Number of weeks for rotation (to get 25% occupancy) | 8 | 4 | 3 |
| Number hours per person and month | 90 | 90 | 80 |
| Number hours out of work time per daily shift (workday) | 15 | 4 | 0 |
| Number hours out of work time per daily shift (weekend) | 48 | 24 | 16 |
| Number hours out of work time per week shift | 123 | 44 | 16 |

## One site

| Month | 1w | 2w | 3w | 4w |
| --- | :-: | :-: | :-: | :-: |
| Primary | A | B | C | D |
| Secondary | E | F | G | H |

We have 8 people rotating every 4 weeks. If you share primary and secondary across the same people, you need to extend this to 2 months and swap the roles each month. I don't recommend back-to-back shifts, as many teams do — it's not healthy. All these tables represent a minimum and are not optimal. You need extra capacity for vacations, sick days, and to stay safely below that 25% on-call threshold.

## Two sites

| Month | 1w | 2w | 3w | 4w |
| --- | :-: | :-: | :-: | :-: |
| Site 1 – Primary | A | E | G | C |
| Site 1 – Secondary | C | A | E | G |
| Site 2 – Primary | B | F | H | D |
| Site 2 – Secondary | D | B | F | H |

We have 8 people rotating every 4 weeks. The SRE book recommends 6 people per site, and I agree. This calculation is a bare minimum — I recommend at least 6 people per site.

## Three sites

| Month | 1w | 2w | 3w | 1=4w |
| --- | :-: | :-: | :-: | :-: |
| Site 1 – Primary | A | D | G | A |
| Site 1 – Secondary | G | A | D | G |
| Site 2 – Primary | B | E | H | B |
| Site 2 – Secondary | H | B | E | H |
| Site 3 – Primary | C | F | I | C |
| Site 3 – Secondary | I | C | F | I |

We have 9 people rotating every 3 weeks. Still, I would go with 6 people per site.

Many other scenarios you can find here in [PagerDuty documentation](https://support.pagerduty.com/docs/schedule-examples). I recommend looking into it for inspiration.

## Time Zones

The last important consideration for multi-site teams is time zones. You often can't choose where your teams are located. If you can, try to make it work for on-call, which needs enough time zone distance for shift coverage, but not so much that it creates communication gaps. Finding the optimal balance is hard.

An 8-hour time zone difference works well from my perspective. I show an example with a few time zones and what three-site and two-site coverage looks like.

I worked with US (PST) and EU teams — the common overlap is very limited at 2-3 hours, but for two-site shifts it works well. If you need a third location, looking east to Singapore or Thailand is a good option.

Many US teams use India, but that doesn't work well with Europe for on-call. The time difference between Paris and Mumbai is only 3.5 hours, which is too small to meaningfully cover night shifts.

> **Note:** the offsets below are for winter (standard time). During summer daylight saving time (DST) most of these shift by an hour, so the overlap windows move accordingly.

Working hours 9–17, mapped against UTC (local hour shown when a site is on shift):

| UTC | Singapur (UTC+7) | London (UTC) | Paris (UTC+1) | SF (PST, UTC-9) |
| :-: | :-: | :-: | :-: | :-: |
| 0 |  |  |  | 15 |
| 1 |  |  |  | 16 |
| 2 | 9 |  |  | 17 |
| 3 | 10 |  |  |  |
| 4 | 11 |  |  |  |
| 5 | 12 |  |  |  |
| 6 | 13 |  |  |  |
| 7 | 14 |  |  |  |
| 8 | 15 |  |  |  |
| 9 | 16 | 9 |  |  |
| 10 | 17 | 10 | 9 |  |
| 11 |  | 11 | 10 |  |
| 12 |  | 12 | 11 |  |
| 13 |  | 13 | 12 |  |
| 14 |  | 14 | 13 |  |
| 15 |  | 15 | 14 |  |
| 16 |  | 16 | 15 |  |
| 17 |  | 17 | 16 |  |
| 18 |  |  | 17 | 9 |
| 19 |  |  |  | 10 |
| 20 |  |  |  | 11 |
| 21 |  |  |  | 12 |
| 22 |  |  |  | 13 |
| 23 |  |  |  | 14 |

Two-site 12h shifts, mapped against UTC:

| UTC | London (UTC) | SF (PST, UTC-9) |
| :-: | :-: | :-: |
| 0 |  | 15 |
| 1 |  | 16 |
| 2 |  | 17 |
| 3 |  | 18 |
| 4 |  | 19 |
| 5 |  | 20 |
| 6 | 6 | 21 |
| 7 | 7 |  |
| 8 | 8 |  |
| 9 | 9 |  |
| 10 | 10 |  |
| 11 | 11 |  |
| 12 | 12 |  |
| 13 | 13 |  |
| 14 | 14 |  |
| 15 | 15 |  |
| 16 | 16 |  |
| 17 | 17 |  |
| 18 | 18 | 9 |
| 19 |  | 10 |
| 20 |  | 11 |
| 21 |  | 12 |
| 22 |  | 13 |
| 23 |  | 14 |

[^3]: T. A. Limoncelli, S. R. Chalup, and C. J. Hogan, The Practice of Cloud System Administration: Designing and Operating Large Distributed Systems, Volume 2: Addison-Wesley, 2014. - https://learning.oreilly.com/library/view/practice-of-cloud/9780133478549/title.html
