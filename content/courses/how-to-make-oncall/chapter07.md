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

![](/courses/chapter-7.png)

## One site

![](/courses/chapter-7-1.png)

We have 8 people rotating every 4 weeks. If you share primary and secondary across the same people, you need to extend this to 2 months and swap the roles each month. I don't recommend back-to-back shifts, as many teams do — it's not healthy. All these tables represent a minimum and are not optimal. You need extra capacity for vacations, sick days, and to stay safely below that 25% on-call threshold.

## Two sites

![](/courses/chapter-7-2.png)

We have 8 people rotating every 4 weeks. The SRE book recommends 6 people per site, and I agree. This calculation is a bare minimum — I recommend at least 6 people per site.

## Three sites

![](/courses/chapter-7-3.png)

We have 9 people rotating every 3 weeks. Still, I would go with 6 people per site.

Many other scenarios you can find here in [PagerDuty documentation](https://support.pagerduty.com/docs/schedule-examples). I recommend looking into it for inspiration.

## Time Zones

The last important consideration for multi-site teams is time zones. You often can't choose where your teams are located. If you can, try to make it work for on-call, which needs enough time zone distance for shift coverage, but not so much that it creates communication gaps. Finding the optimal balance is hard.

An 8-hour time zone difference works well from my perspective. I show an example with a few time zones and what three-site and two-site coverage looks like.

I worked with US (PST) and EU teams — the common overlap is very limited at 2-3 hours, but for two-site shifts it works well. If you need a third location, looking east to Singapore or Thailand is a good option.

Many US teams use India, but that doesn't work well with Europe for on-call. The time difference between Paris and Mumbai is only 3.5 hours, which is too small to meaningfully cover night shifts.

![](/courses/chapter-7-4.png)

[^3]: T. A. Limoncelli, S. R. Chalup, and C. J. Hogan, The Practice of Cloud System Administration: Designing and Operating Large Distributed Systems, Volume 2: Addison-Wesley, 2014. - https://learning.oreilly.com/library/view/practice-of-cloud/9780133478549/title.html
