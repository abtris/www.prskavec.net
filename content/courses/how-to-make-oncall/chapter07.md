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

For overview about oncalls I recommend read chapter 14 Oncall [^3].

But now to my example:

- We have team with primary and secondary roster
- We can find what is best for us using 1 - 3 sites
- We are looking how many people we need and how we calculate costs
- We don’t try to focus on daily shifts that will make example more complicated
- We don’t use combinations as primary in daily and secondary weekly that make example more complicated too
- We're skipping many possible combinations, don’t think that is only good way how to do it, this is more about how you think for your use case

Some numbers first, calculate and think what is important to you and if you have enough people to achieve at least this minimum number of people with your conditions. My example calculates with two roasters, and we can choose between 1-3 sites.

![](/courses/chapter-7.png)

## One site

![](/courses/chapter-7-1.png)

We have 8 people that rotate every 4 weeks. If you can share primary and secondary you have to change this into 2 months and next month just change primary and secondary. I don’t recommend making 2 shifts in rows as many teams do. It’s not healthy. Still all these tables are a minimum number of people that isn’t optimal. You need extra capacity for vacations, sick people and not very near that 25%.

## Two sites

![](/courses/chapter-7-2.png)

We have 8 people rotated every 4 weeks. Recommendation from SRE book is 6 people per site and I agree.  This calculation is bare minimum and I will recommend at least 6 people.

## Three sites

![](/courses/chapter-7-3.png)

We have 9 people rotate every 3 weeks. Still I will go with 6 people per site.

Many other scenarios you can find here in [PagerDuty documentation](https://support.pagerduty.com/docs/schedule-examples). I recommend looking into it for inspiration.

## Time Zones

Last important thing to multi sites are time zones. You can’t often choose where your teams are located. If you can try to make it work for oncall and that needs enough distance for shifts, but fewer gaps for communication. It’s hard to find an optimal way.

I think the 8 hours time zone difference works well from my perspective. I make an example with a few time zones and how 3 sites and 2 sites look like.

I worked with US (PST) and EU teams and common time is very limited 2-3 hours for communication but for 2 site shifts I think works well. If you need some 3rd place it is good to look east as Singapore or Thailand.

Many US teams use India but that doesn’t work with Europe for oncalls. Time difference between Paris and Mumbai is 3.5h and this is too small to help with night shifts.

![](/courses/chapter-7-4.png)

[^3]: T. A. Limoncelli, S. R. Chalup, and C. J. Hogan, The Practice of Cloud System Administration: Designing and Operating Large Distributed Systems, Volume 2: Addison-Wesley, 2014. - https://learning.oreilly.com/library/view/practice-of-cloud/9780133478549/title.html
