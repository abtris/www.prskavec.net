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

For support daily oncall, I recommend a few things. Make visible all that your On Call in one place. I will recommend a dedicated Slack channel for oncall. If you collect all notifications and alerts into the channel is very easy to see that something is happening. It would be best to have a dedicated channel for a major incident for communication and not be overwhelmed with automatic messages. Some tools support this out of the box.

The good thing from my experience is the Slack bot that helps with these things:

- you can ask who has oncall now
- you can ask who had oncall
- you can ask who will have oncall
- you can update the topic of the oncall channel, who have the current oncall shift
- the bot can make specific mentions to people 5 minutes before the shift starts for handover, which is very useful, and you can see people using that.
- the bot can check if overlaps primary and secondary and report to the oncall market channel. An example of a tool doing that for PagerDuty - <https://github.com/apiaryio/pagerduty-overlap-checker>
- don’t forget to make the channel for the oncall market
- don’t forget to make the channel for specific roasters as customer support, don’t mix everything into one channel
- search for slack ops, ops bot, or chat ops on the internet and find many inspirations
