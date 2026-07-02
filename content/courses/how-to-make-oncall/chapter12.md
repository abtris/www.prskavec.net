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

Postmortems are how you make sure the same incident does not happen again. The meeting is not the goal. The document is not the goal. The goal is prevention: clear action items, owners, due dates, and a process that checks whether the work actually happened.

I recommend a full postmortem for every customer-impacting incident. Cross-team problems are also good candidates, even when the customer impact was small, because they expose ownership gaps. A useful rule is that anyone who was impacted by the incident can ask for a postmortem.

For low-severity alerts and P3/P4 tickets, a short write-up is often enough. Capture what happened, what was done, and whether any follow-up ticket is needed. Keep full postmortems for incidents where the extra discussion will change how the system or process works.

> Best Practice: Avoid Blame and Keep It Constructive [^Boy13]
> Blameless postmortems can be challenging to write, because the postmortem format clearly identifies the actions that led to the incident. Removing blame from a postmortem gives people the confidence to escalate issues without fear. It is also important not to stigmatize frequent production of postmortems by a person or team. An atmosphere of blame risks creating a culture in which incidents and issues are swept under the rug, leading to greater risk for the organization

Blameless does not mean vague. You still need to say what happened, which decisions mattered, which signals were missed, and which safeguards failed. The point is to analyze the system around the people, not to make the engineer who touched the keyboard look guilty.

Write the timeline using roles, not personal names. "The on-call engineer rolled back the deployment" or "the SME joined the incident channel" is better than "John rolled back the deployment." Names pull the document toward blame and make it harder to reuse as training material. Roles show whether the response model worked.

## What a Postmortem Must Produce

A good postmortem produces these things:

- an incident summary that a new engineer can understand later
- a timeline based on data, not memory alone
- customer impact and duration
- root cause analysis, including contributing factors
- action items with owners and due dates
- tickets for every action item
- a review date or recurring review process until the action items are closed

The last point is where many teams fail. Writing action items is easy. Checking them two weeks later is the real process. Review postmortem action items in your regular incident review until they are closed or explicitly rejected.

## Root Cause Analysis

I prefer the term root cause analysis (RCA), but RCA should not mean pretending there was only one cause. Good RCA can include contributing factors: missing alerts, unclear ownership, weak runbooks, risky deployment practices, capacity limits, bad defaults, or decisions that made sense with incomplete information.

Use data wherever you can [^2]. Reconstruct the timeline from alerts, logs, metrics, deploy events, chat messages, tickets, and customer reports. Treat explanations as hypotheses until the data supports them.

## A Simple Postmortem Template

Start with a template small enough that people will actually use it:

- Impact: who was affected, for how long, and how badly?
- Detection: how did we find out?
- Timeline: what happened, in order?
- Response: what did the on-call team do first, and what changed the customer impact?
- RCA: what caused the incident, and what contributed to it?
- What went well: which safeguards, people, or processes reduced impact?
- What went poorly: what slowed detection, mitigation, escalation, or communication?
- Action items: owner, due date, ticket link, and expected prevention value.

The action item should explain what future incident it prevents. "Improve monitoring" is not an action item. "Page the payments roster when checkout success rate drops below SLO for 10 minutes" is closer to something you can review.

## Learning Material

Great postmortems become training material for new engineers. That is hard to do well because the document needs more than a conclusion. It needs the context of the incident: what people saw, what they believed at the time, which dashboards mattered, which Slack messages changed the response, and which assumptions turned out to be wrong.

Public incident reports are useful learning material too. The [Open Incident Database](https://www.thevoid.community/database) collects incidents from other organizations, which can help teams compare their own postmortems against real examples and practice RCA on systems they do not operate.

Tools can help here. Jeli, now part of PagerDuty, focused on incident analysis and preserving this kind of context [^3]. But tooling does not replace the discipline of writing down decisions, linking evidence, and checking action items after the meeting.

## RCA Methods

### Five Ps

- <https://cloudpundit.com/2021/10/28/five-p-factors-for-root-cause-analysis/>

The Five Ps model is useful because it prevents the team from stopping at the first technical trigger:

- **Presenting problem**: the visible impact and its consequences.
- **Precipitating factors**: the trigger or triggers that started the incident.
- **Perpetuating factors**: the conditions that kept the incident going or made it worse.
- **Predisposing factors**: long-standing conditions that made the incident more likely.
- **Protective factors**: safeguards that reduced the impact.
- **Present factors**: relevant context, including where the team got lucky.

### 5 why’s

- [Five why’s - Wikipedia](https://en.wikipedia.org/wiki/Five_whys)
- [Ishikawa diagram - Wikipedia](https://en.wikipedia.org/wiki/Ishikawa_diagram)
- [Using a Fishbone (or Ishikawa) Diagram to Perform 5-why Analysis | K Bulsuk: Full Speed Ahead](https://www.bulsuk.com/2009/08/using-fishbone-diagram-to-perform-5-why.html)

5 Whys is still used by many teams. The idea is to ask "why" in succession, going deeper each time. It can be useful, but only if the group stays broad enough to find multiple contributing factors.


> *The danger of the Five Whys is how, by following it, we might miss out on other root causes of the incident. (...) ***We’re not broadening our understanding.*** We’re just trying to narrow down on one thing, fix it, and hope that this will make the incident not happen again.*

- <http://www.kitchensoap.com/wp-content/uploads/2014/09/Velocity2014-PM-Fac-Handout-Debrief.pdf>


### PDCA

- [Root Cause Analysis, Ishikawa Diagrams and the 5 Why’s](https://www.isixsigma.com/tools-templates/cause-effect/root-cause-analysis-ishikawa-diagrams-and-the-5-whys/)

The scientific method can be integrated into RCA by using cycles of [PDCA](https://www.isixsigma.com/methodology/plan-do-check-act/six-sigma-pdca-steroids/):

- **Plan**: describe the problem, collect data, and form a hypothesis.
- **Do**: test the hypothesis against the evidence.
- **Check**: evaluate the result and decide whether the hypothesis still holds.
- **Act**: create follow-up work, reject the hypothesis, or refine it with new evidence.


### 6 Sigma

- [Six Sigma: PDCA on Steroids?](https://www.isixsigma.com/methodology/plan-do-check-act/six-sigma-pdca-steroids/)

### Untools

- [Ishikawa Diagram | Untools](https://untools.co/ishikawa-diagram)


[^1]: <https://sre.google/sre-book/postmortem-culture/>
[^2]: https://web.archive.org/web/20240305152802/https://www.jeli.io/blog/what-kind-of-data-can-you-use-and-should-you-use-for-an-investigation
[^3]: https://www.pagerduty.com/platform/jeli/incident-analysis/
[^Boy13]: P. G. Boysen, ["Just Culture: A Foundation for Balanced Accountability and Patient Safety"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3776518/), in The Ochsner Journal, Fall 2013.
