---
title: Tools (Pagers, Incident Response, Postmortem, Utility)
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

We can split tools into multiple categories as pagers, incident response, incident workflows, utility and postmortems. More and more tools are trying to be more universal and cover more of it. Here is always what suits you best and how you can combine it.

There are many tools on the market, to pagers you can assign ([PagerDuty](https://www.pagerduty.com/), [OpsGenie](https://www.atlassian.com/software/opsgenie), [Splunk On Call - former VictorOps](https://www.splunk.com/en_us/software/splunk-on-call.html) and [Grafana OnCall](https://grafana.com/products/oncall/).

For incident response you can use [Rootly](https://rootly.com/), [incident.io](https://incident.io/), [FireHydrant](https://firehydrant.com/) and others for example [Jeli Slack bot](https://www.jeli.io/slack-app). As utility I see [Backstage](https://backstage.io/), [Statuspage](https://www.atlassian.com/software/statuspage), [Status.io](https://status.io/).

For postmortem is [Jeli](https://www.jeli.io/) but many others tools have some functions that can help with postmortem too.

There plenty others that I don't know. Just during getting links for article I find [zenduty](https://www.zenduty.com/), [pagertree](https://pagertree.com/), many observability tools adding oncall functions as Grafana and [Datadog](https://www.datadoghq.com/blog/incident-response-with-datadog/).

I have many years experience with PagerDuty and I can recommend using that. I’m sure that differences are very small, and you can use what fits your ecosystem.

There are links to documentation how scheduling can look like in OpsGenie and PagerDuty:

- <https://docs.opsgenie.com/docs/on-call-schedules-and-rotations>
- <https://support.pagerduty.com/docs/schedules>

If you have choice look for these things into pagers:

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

For incident response and workflows:

- look on integration, covers your tooling (ticketing system, communication tools, status pages, etc)
- security (at least SOC2, ISO 270001 if you need it)
- try have your process before and test it if you model it in tooling, this is very hard to upfront and you will be iterate over process during time and you want have flexibility and support from tooling to do it.
- way how to test it changes properly without breaking current workflows!
- costs (you will pay for all extra tools and their pricing model can't work for everyone)
- help with postmortem to collect all evidence from Slack (or similar tool) to later documentation

For postmortems:

- there is important what you want from postmortems
- many of tooling are good to have written recoding what happened and how we improve things in the future
- less tools really help with RCA and find important things about your incidents
- you can look on postmortems as materials for learning new people and that is hardest to do it
