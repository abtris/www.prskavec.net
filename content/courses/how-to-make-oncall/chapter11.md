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

For daily on-call support, I recommend a few things. Make everything related to your on-call visible in one place. I recommend a dedicated Slack channel for on-call. If you funnel all notifications and alerts into that channel, it becomes easy to see when something is happening. It's best to also have a dedicated channel for major incidents so that communication isn't overwhelmed by automated messages. Some tools support this out of the box.

The good thing from my experience is the Slack bot that helps with these things:

- you can ask who has oncall now
- you can ask who had oncall
- you can ask who will have oncall
- you can update the topic of the oncall channel, who have the current oncall shift
- the bot can make specific mentions to people 5 minutes before the shift starts for handover, which is very useful, and you can see people using that.
- the bot can check if overlaps primary and secondary and report to the oncall market channel. An example of a tool doing that for PagerDuty - <https://github.com/apiaryio/pagerduty-overlap-checker>
- don’t forget to make the channel for the oncall market
- don't forget to create dedicated channels for specific rosters such as customer support — don't mix everything into one channel

