---
# Course title, summary, and position.
linktitle: How to design OnCall
summary: Learn how to design OnCall for your team.
weight: 1

# Page metadata.
title: How to design OnCall
date: "2021-05-19T00:00:00Z"
lastmod: "2021-05-19T00:00:00Z"
draft: false  # Is this a draft? true/false
toc: false  # Show table of contents? true/false
type: docs  # Do not modify.

# Add menu entry to sidebar.
# - name: Declare this menu item as a parent with ID `name`.
# - weight: Position of link in menu.
menu:
  how-to-make-oncall:
    name: Intro
    weight: 1
---

## Guide to good On-call that does not kill your team

### How Many People Do You Need For On-call?

> "Using the 25% on-call rule, we can derive the minimum number of SREs required to sustain a 24/7 on-call rotation. Assuming that there are always two people on-call (primary and secondary, with different duties), the minimum number of engineers needed for on-call duty from a single-site team is eight: assuming week-long shifts, each engineer is on-call (primary or secondary) for one week every month. For dual-site teams, a reasonable minimum size of each team is six, both to honor the 25% rule and to ensure a substantial and critical mass of engineers for the team." - SRE book [^srebook]

As explained in the quote above, Google  recommends a minimum of 8 engineers for one site and 6 engineers per site in case of two sites. My own calculations show that you could have fewer engineers on-call if they are divided between two or three locations,  but you have to alway keep in mind vacations, sick days, business travels, etc.

I remember making a full on-call rotation with 6 people working 24/7/365 — it was exhausting with a significant impact on people's personal lives. As an SRE manager I always try to focus on achieving good work & time off balance for people being a part of an on-call rotation. The burden of providing non-stop support can be a major reason why people leave engineering teams.

[^srebook]: Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy. 2016. Site Reliability Engineering: How Google Runs Production Systems (1st. ed.). O'Reilly Media, Inc. - https://landing.google.com/sre/sre-book/chapters/being-on-call/
