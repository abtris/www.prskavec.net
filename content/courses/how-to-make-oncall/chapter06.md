---
title: Escalations
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 6

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 7
---

Primary and secondary layer are for resolve and manage incidents.

You need escalation process for a few reasons

- interchangeability for any reasons (primary have problem access internet, traveling, oversleep etc.)
- nobody responses on primary/secondary and you need address this (manager on-call)
- problems that can't be resolved by primary/secondary (security, legal, executive decision need it)

It's always good test it all escalations, specially with executives who aren't really paged often. Is always good if all stakeholders have enough information about current incidents and don't step in process and ask Incident commander for information.

Always is good have reasonable times for escalations. You should calculate times from your SLAs and be sure if someone break it you are still good with include time to escalate. You can always calculate worst time and common time for acknowledge incident (MTTA - Mean Time to Ack) and it's good metrics how healthy are your paging and if works.

There are important metrics about incidents and that are MTTD (Mean Time to Detect), MTTR (Mean Time to Resolve), MTBF (Mean Time to Between Failures). Resolve and Detect are the most important metrics. First I will focus on detection than resolution. From my experience resolution for experience developers aren't issue but have good observability and looking for right signals are hard.
