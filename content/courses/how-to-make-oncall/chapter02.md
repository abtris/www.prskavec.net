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

One of the challenging problems of on-call design is controlling the number of times engineers are paged during the night. It is essential for single-site teams. Having a high number of pages can cause alarm fatigue. Having people answer pages at 2 AM only to realize they are responding to something that isn’t urgent or actionable can quickly damage the team’s morale.

You have to work on fine-tuning the alerting to ensure that anything that isn’t urgent or critical will wait until the on-call engineer wakes up. Sometimes this may require increasing alarm thresholds. In other cases, it may require code changes to improve error handling. While this may look like additional work, it can help ensure that on-call work is sustainable and protect your team from burnout.
