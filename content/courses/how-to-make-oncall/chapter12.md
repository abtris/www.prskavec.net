---
title: Postmortems
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 13

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 17
---

Postmortems are necessary for learning and should be hold every time than incident occur [^1]. You can determine if you need for every incident in some short form or skip it for low severity ones. Always you need be sure that nobody pointing fingers and whole process is blameless.

> Best Practice: Avoid Blame and Keep It Constructive [^Boy13]
> Blameless postmortems can be challenging to write, because the postmortem format clearly identifies the actions that led to the incident. Removing blame from a postmortem gives people the confidence to escalate issues without fear. It is also important not to stigmatize frequent production of postmortems by a person or team. An atmosphere of blame risks creating a culture in which incidents and issues are swept under the rug, leading to greater risk for the organization

Another important thing are data [^2]. Your investigation have to be focus on hypothesis and analyze data, using [scientific method](https://en.wikipedia.org/wiki/Scientific_method). Finding Root Cause is always challenging.

We can continue how setup postmortem process [^3], inspire there from best.

[^1]: <https://sre.google/sre-book/postmortem-culture/>
[^2]: https://www.jeli.io/blog/what-kind-of-data-can-you-use-and-should-you-use-for-an-investigation
[^3]: https://www.jeli.io/howie/welcome
[^Boy13]: P. G. Boysen, ["Just Culture: A Foundation for Balanced Accountability and Patient Safety"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3776518/), in The Ochsner Journal, Fall 2013.
