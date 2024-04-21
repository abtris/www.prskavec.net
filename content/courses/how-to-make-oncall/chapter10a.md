---
title: On-Call Documentation
toc: false
type: docs
date: "2024-04-18T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 10

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 15
---

For writing documentation is good follow framework as [Diátaxis](https://diataxis.fr/). Diátaxis is a way of thinking about and doing documentation. We will apply similar approach and split documentation into four parts.

- [Tutorials](#tutorials)
- [How-to Guides](#how-to-guides)
  - [Runbooks / Playbooks (Google SRE naming)](#runbooks--playbooks-google-sre-naming)
  - [How to create an effective runbook](#how-to-create-an-effective-runbook)
- [Glossaries](#glossaries)
- [Explanation](#explanation)

## Tutorials

What you need for On-Call - tutorial that help new on-call member onboard into process, tools and get all access need it for on-call shift.

- [PagerDuty Incident Response](https://response.pagerduty.com/)

## How-to Guides

Standard Operation Procedures (SOP) for deploying, rotating secrets, adding new regions, scale down and up, adding capacity etc. Runbooks for Incident - every actionable alert need runbook and we should write it and test it on regular basic that works and is easy to understand.

You can start with checklist as mention in SRE Workbook[^1]

- Administering production jobs
- Understanding debugging info
- "Draining" traffic away from a cluster
- Rolling back a bad software push
- Blocking or rate-limiting unwanted traffic
- Bringing up additional serving capacity
- Using the monitoring systems (for alerting and dashboards)
- Describing the architecture, various components, and dependencies of the services

Before going on-call, the team reviewed precise guidelines about the responsibilities of on-call engineers. 

For example:
- At the start of each shift, the on-call engineer reads the handoff from the previous shift.
- The on-call engineer minimizes user impact first, then makes sure the issues are fully addressed.
- At the end of the shift, the on-call engineer sends a handoff email to the next engineer on-call.

### Runbooks / Playbooks (Google SRE naming)

As The Site Reliability Workbook[^1] says, playbooks "reduce stress, the mean time to repair (MTTR), and the risk of human error."

All alerts should be immediately actionable. There should be an action we expect a human to take immediately after they receive the page that the system is unable to take itself. The signal-to-noise ratio should be high to ensure few false positives; a low signal-to-noise ratio raises the risk for on-call engineers to develop alert fatigue.

Just like new code, new alerts should be thoroughly and thoughtfully reviewed. Each alert should have a corresponding playbook (runbook) entry.

- [Example of runbook template](https://github.com/SkeltonThatcher/run-book-template/blob/master/run-book-template.md)

### How to create an effective runbook

There are five attributes of any good runbook; the five As.[^3] It must be:

- **Actionable**. It’s nice to know the big picture and architecture of a system, but when you are looking for a runbook, you’re looking to take action based on a particular situation.
- **Accessible**. If you can’t find the runbook, it doesn’t matter how well it is written.
- **Accurate**. If it doesn’t contain truthful information, it’s worse than nothing at all.
- **Authoritative**. It is confusing to have more than one runbook for any given process.
- **Adaptable**. Systems evolve, and if you can’t change your runbook, the drift will make it unusable.

## Glossaries

Glossaries[^2] can be helpful for a few reasons:

- Glossaries help you avoid repetition. When you can refer to a definition with a linked explanation, you save time and words.
- Glossaries ensure consistency in descriptions. If something is explained in multiple ways, it can become confusing.
- Glossaries enhance the usability of a runbook for engineers at all experience levels. By including a glossary in your runbook, you provide essential explanations for newer engineers and streamline information for more experienced ones.

## Explanation

- [RFC](https://en.wikipedia.org/wiki/Request_for_Comments)
- [RFD](https://rfd.shared.oxide.computer/rfd/0001)
- [ADR](https://adr.github.io/)
- paper, wiki, anything that helps why things are how they and how works in detail.


[^1]: https://sre.google/workbook/on-call/
[^2]: https://www.transposit.com/devops-blog/sre/2020.01.30-writing-runbook-documentation-when-youre-an-sre/
[^3]: https://www.transposit.com/devops-blog/itsm/what-makes-a-good-runbook/
