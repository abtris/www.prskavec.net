---
# Page metadata.
title: How to design OnCall
date: "2021-05-19T00:00:00Z"
lastmod: "2021-05-19T00:00:00Z"

# Add menu entry to sidebar.
# - name: Declare this menu item as a parent with ID `name`.
# - weight: Position of link in menu.
menu:
  how-to-make-oncall:
    name: Intro
    weight: 1
---

## Guide to good On-call that does not kill your team

You can read quotes like this across the cloud industry:

> Some teams have had dramatically different pager volumes for years at my company. There are teams which people like to work on thanks to their great mission, but those same teams have a noisy oncall. There is no way I would move to those teams, where moving would come with so much unpaid overtime at unsociable hours.” From a publicly traded tech company valued at $13B.

Making good on-call across various teams isn't an easy job. It would be best if you had great support from senior executives. The team manager needs to know where to push for hiring and how to make priorities for the team to avoid toil that is not manageable.

We don't cover details about incident response for engineers being on-call. Please read the excellent documentation from PagerDuty to familiarize yourself with the more detailed guide on working during an incident[^response].

## How to Introduce On-Call into Your Company?

Introducing on-call is a major culture change. If you have never done it before, it significantly impacts your personal life and brings a level of stress you didn't have before. The company should discuss it with people upfront and include it in contracts where required. It isn't ideal if on-call comes as a surprise or is sprung on someone after their probation period.

If you are a small startup, it's good to start during working hours only. Focus on good observability and alerting with a proper paging workflow, and give ownership to the developers working on the service. This approach is called "You build it, you run it." [^ybyr]

I recommend taking your time with changes. You need to ensure that everyone who joins on-call fully understands what that extra work entails. Give them proper training using gamedays [^gm]. I recommend having a training environment where everyone goes through a few simulated incidents before going live. A well-mastered process is more important than having the right solution — for solutions, you can always summon engineers from across the company. Communicating with all stakeholders and controlling what happens is critical to good incident management.

### How Many People Do You Need For On-call?

> "Using the 25% on-call rule, we can derive the minimum number of SREs required to sustain a 24/7 on-call rotation. Assuming that there are always two people on-call (primary and secondary, with different duties), the minimum number of engineers needed for on-call duty from a single-site team is eight: assuming week-long shifts, each engineer is on-call (primary or secondary) for one week every month. For dual-site teams, a reasonable minimum size of each team is six, both to honor the 25% rule and to ensure a substantial and critical mass of engineers for the team." - SRE book [^srebook]

As explained in the quote above, Google recommends a minimum of 8 engineers for one site and six engineers per site in the case of two sites. My calculations show that you could have fewer engineers on-call if they are divided between two or three locations,  but you have to always keep in mind vacations, sick days, business travels, etc.

I remember making a full on-call rotation with six people working 24/7/365 — it was exhausting and significantly impacted people's personal lives. As an SRE manager, I always try to focus on achieving good work & time off balance for people being a part of an on-call rotation. The burden of providing non-stop support can be a significant reason why people leave engineering teams.

[^srebook]: Betsy Beyer, Chris Jones, Jennifer Petoff, and Niall Richard Murphy. 2016. Site Reliability Engineering: How Google Runs Production Systems (1st. ed.). O'Reilly Media, Inc. - https://landing.google.com/sre/sre-book/chapters/being-on-call/

[^ybyr]: “You build it, you run it” is a software development principle that emphasizes the responsibility of the development team in designing, building, and maintaining the systems they create.

[^gm]: Gamedays - So, what exactly is a GameDay? A GameDay is a period of time (usually 1—4 hours) set aside for a team to run one or more experiments on a system, process or service, observe the impact, then discuss the outcomes.

[^response]: PagerDuty Incident Response process. It is a cut-down version of our internal documentation used at PagerDuty for any major incidents and to prepare new employees for on-call responsibilities - https://response.pagerduty.com/
