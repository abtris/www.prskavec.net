---
title: Summary
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 14

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 17
---

Designing on-call is a tough process with constantly changing conditions. Team size shifts frequently — you add people during hiring and lose them when they leave — and planning around that is never easy. We don't cover handover times for sites and what is recommended in detail here.

The SRE book recommends Wednesday for weekly shift changes, but I suggest Sunday or Monday instead. We use Sunday for reporting purposes and hold an incident review on Monday, which works well for us. Some teams prefer Wednesday to avoid overlap with development planning or other recurring company meetings.

Time zones also affect your handover timing decisions. We ran two sites — California (9 am PST) and Central Europe (6 pm UTC+1) — and that worked well for us. But some combinations don't work as cleanly. Europe and India, for example, have too small a time difference to be useful for on-call coverage, even though it's great for collaboration. Sometimes it's worth decoupling development teams from on-call teams.

Good luck with designing your first on-call!
