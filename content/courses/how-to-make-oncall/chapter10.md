---
title: Tools
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 10

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 15
---

There are many tools on the market ([PagerDuty](https://www.pagerduty.com/), [OpsGenie](https://www.atlassian.com/software/opsgenie), [VictorOps (Splunk On Call)](https://www.splunk.com/en_us/software/splunk-on-call.html), [ServiceNow](https://www.servicenow.com/) and more).

I have many years experience with PagerDuty and I can recommend using that. I’m sure that differences are very small, and you can use what fits your ecosystem.

There are links to documentation how scheduling can look like in OpsGenie and PagerDuty:

- https://docs.opsgenie.com/docs/on-call-schedules-and-rotations
- https://support.pagerduty.com/docs/schedules

If you have choice look for these things into tool:

- easy change for people on oncall (oncall market)
- schedule versioning - easy undo changes if make schedule changes
- support for calendar export
- mobile app is useful
- easy way how whitelisting phone numbers for calling to engineers
- support for voice call and sms, not all people using smartphones.
- support for Slack is great, and I will recommend, you can have bot that will answer who have oncall
- good API for your integrations
- the SDK for your favorite language is great!
- reporting is useful as we mention in the previous section.

