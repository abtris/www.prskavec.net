---
title: Daily vs Weekly
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 40

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 5
---

My example uses weekly shifts, though that doesn't mean I prefer them over daily shifts. Weekly shifts are not inherently better or worse. I think that if you are a single-site team, daily shifts are better. You can spread weekend coverage across six people and handle the whole week that way. For 2-3 sites, weekly shifts are more common. A strategy named "follow the sun" (FTS [^1]) moves responsibility between regions to reduce local night duty. Two eight-hour workdays leave an eight-hour coverage gap; even three sites need their actual shift windows checked. You will have many handovers, and this is something you need to prepare carefully. [Chapter 7](../chapter07/) compares the options, and [Chapter 7.1](../chapter07-1/) works through weekly rotations in detail.

From my experience, daily on-call is better for work-life balance. You're not tied to a computer for a whole week, and it's easier to reschedule an evening out if you only have one day of coverage. You can also swap shifts with a colleague more easily.

You can design a custom scheme that fits your team, but simplicity is key. For more complex tier arrangements, you need tooling that checks whether the same person is scheduled as both primary and secondary at the same time. That may seem obvious, but I have seen it happen many times — and it is not fair to that person. A colleague mentioned it happened to a new on-call team member on their very first shift, over a weekend, and no one noticed until Monday.

[^1]: <https://en.wikipedia.org/wiki/Follow-the-sun>
