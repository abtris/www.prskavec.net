---
title: High Alert ratio
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 2

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 3
---

One of the hard problems of on-call design is controlling the amount of times engineers are paged during the night. This is especially important for single site teams.  Having a high number of pages can easily cause alarm fatigue and having people answer pages at 2AM only to realize they are responding to something that isn’t urgent or actionable can damage the team’s morale very fast.

You have to work on fine tuning the alerting, to make sure that anything that isn’t urgent or critical will wait until the on-call engineer wakes up. Sometimes this may require increasing alarm thresholds, in other cases it may require code changes to improve error handling. While this may look like additional work, it can help you ensure that on-call work is sustainable and protect your team from burnout.
