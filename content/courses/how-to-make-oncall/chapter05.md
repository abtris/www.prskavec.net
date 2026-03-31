---
title: Working vs non-working hours
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 5

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 6
---

In my example, I calculate how many non-working hours people spend on-call. At least in the EU, you are required to pay extra for this [^3], and it's the right thing to do. That said, many people value not working on weekends more than the extra pay. Sleep deprivation is a serious problem, and as a manager, you need to think carefully about this. [^2]

I have a colleague whose company gives one day of vacation for each week of on-call instead of monetary compensation — and he prefers it that way.

## Legal Requirements

In the European Union, the Working Time Directive sets limits on working hours and requires rest periods. On-call time that involves actual work typically counts as working time. Many EU member states also require additional pay for night work and weekend work regardless of whether incidents occur.

In the United States there is no federal requirement to compensate salaried exempt employees for on-call time, but many companies do so voluntarily — both for fairness and retention. Check your local labor laws and consult with your legal or HR team before finalizing your compensation model.

## Compensation Models

There are several common approaches to compensating on-call duty:

| Model | How it works | Best for |
|---|---|---|
| **Hourly rate** | Pay a flat hourly rate for each hour on-call (not just when paged) | Teams with high page volume; legally required in some jurisdictions |
| **Per-incident pay** | Pay only when the engineer is actively responding to an incident | Teams with low, unpredictable page volume |
| **Weekly stipend** | A fixed bonus per week of on-call duty, regardless of page volume | Simple to administer; easy to forecast |
| **Time off in lieu** | Give a compensatory day off for each week of on-call | Engineers who value time over money; common in Europe |
| **Rotation bonus** | Annual bonus tied to number of on-call rotations completed | Larger organizations with stable rosters |

Many teams combine models — for example, a weekly stipend plus per-incident pay for pages outside working hours.

## Working Hours vs Non-Working Hours

Distinguish between pages that come in during working hours (which carry no additional burden) and those that come in outside working hours. For the purposes of compensation and health tracking:

- **Working hours**: Pages handled during the normal business day, on a weekday. Minimal extra compensation is expected.
- **Non-working hours**: Evenings, nights, weekends, and public holidays. These carry a higher personal cost — they interrupt rest, social life, and family time.

A common benchmark: if an engineer is being paged more than once per night on average during their on-call week, the alert thresholds and runbook quality need review — not more compensation.

## Sleep Deprivation and Team Health

Sleep deprivation is cumulative and has measurable effects on cognitive performance, decision-making, and error rates [^2]. Engineers who are regularly woken up at night are less effective during the day. This is a safety issue for production systems as much as it is a wellbeing issue for your team.

Practical mitigation steps:

- Track pages by time of day in your on-call reports. Make night pages visible to leadership.
- Set a maximum number of acceptable night pages per shift. Treat exceeding the threshold as a system reliability incident, not a normal operational event.
- Give engineers protected recovery time after particularly bad shifts. A policy of "no meetings the morning after a rough night" costs nothing and makes a real difference.
- Make it easy and stigma-free to request a swap when someone is exhausted.

[^2]: J. Durmer and D. Dinges, ["Neurocognitive Consequences of Sleep Deprivation"](http://www.ncbi.nlm.nih.gov/pubmed/15798944), in Seminars in Neurology, vol. 25, no. 1, 2005.
[^3]: Oncall Compensation for Software Engineers - https://blog.pragmaticengineer.com/oncall-compensation/
