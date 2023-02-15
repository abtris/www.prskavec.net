---
title: Daily Oncall Routine
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 11

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 16
---

For support daily oncall I recommend a few things. Make clear visible all what your On Call in one place. I will recommend a dedicated Slack channel for oncall. If you collect all notifications, alerts into the channel are very easy to see that something is happening. You have to have a dedicated extra channel after the trigger major incident for communication and not be overwhelmed with automatic messages. Some tools support this out of the box.

Good thing from my experience is Slack bot that helps with these things:

- you can ask who have oncall now
- you can ask who had oncall
- you can ask who will have oncall
- you can update topic of oncall channel who have current oncall
- bot can make specific mention to people 5 min before shift start for handover, that is very useful, and you can see people using that.
- bot can check if overlaps primary and secondary and report to oncall market channel, example of tool doing that for PagerDuty - <https://github.com/apiaryio/pagerduty-overlap-checker>
- don’t forget make channel for oncall market
- don’t forget make channel for specific roasters as customer support, don’t mix everything into one channel
- search for slack ops, ops bot or chat ops on internet and find many inspirations
