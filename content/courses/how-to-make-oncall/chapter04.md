---
title: Daily vs Weekly
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 4

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 5
---

My example is about weekly shifts, which isn't why I prefer weekly shifts. Weekly shifts are not better or worse. I think that if you are one site team, daily shifts are better. You can work weekends extra and make six people deal with the whole week. For 2-3 sites, weekly shifts are more common. A strategy named "follow the sun" (FTS [^1]) is usually defined by omitting the night shift from oncall that can be done in 2 or 3 sites. You have many handovers, and this is something that you have to prepare carefully.

I think from my experience, daily on-call is better for work time life balance. You don't have a whole week with a computer, and you can quickly move your program to the evening movie or theater if it is just one day. You switch shifts with a colleague more easily.

You can make some custom scheme that fits you, but simplicity is key here too. For more complex tiers, you need tooling that checks if the same person doesn't have primary and secondary at the same time. That looks obvious, but I have seen it many times people that happen, and it's not suitable for that person. My friend mentioned that this happened to a first shift new on-call team member on his first shift, and It was over the weekend, and others found it on Monday.

[^1]: <https://en.wikipedia.org/wiki/Follow-the-sun>
