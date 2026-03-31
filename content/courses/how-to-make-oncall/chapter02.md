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

One of the most challenging problems of on-call design is controlling the number of times engineers are paged during the night. This is especially critical for single-site teams. A high number of pages can cause alarm fatigue. Having people answer pages at 2 AM only to realize they are responding to something that isn't urgent or actionable can quickly damage team morale.

You need to fine-tune alerting to ensure that anything that isn’t urgent or critical waits until the on-call engineer wakes up. Sometimes this may require increasing alarm thresholds. In other cases, it may require code changes to improve error handling. While this may seem like additional work, it helps ensure that on-call work is sustainable and protects your team from burnout.
