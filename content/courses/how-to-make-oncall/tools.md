---
title: Tools table overview
toc: false
type: docs
date: "2025-01-01T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 20

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 17
---

> **Last updated: March 2026** — Pricing and status verified against vendor websites. Prices are approximate and may change; always check the vendor's current pricing page before making decisions.

| Category          | Other Functions    | Name           | URL                                                            | Notes                                                                                           | Company Info                         | Base Price (annual)                       |
| ----------------- | ------------------ | -------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------- |
| Pagers            | Incident Workflows | PagerDuty      | https://www.pagerduty.com/                                     | Long on market, strong reliability; now includes AIOps and AI agents.                           | PagerDuty Inc, NYSE: PD              | ~$21/user/month (On-Call plan)            |
| Pagers            |                    | OpsGenie       | https://www.atlassian.com/software/opsgenie                    | ⚠️ EOL — Atlassian announced shutdown April 2027; migrate to Jira Service Management.           | Atlassian Corporation, NASDAQ: TEAM  | ~$23/user/month (was); do not start new   |
| Pagers            |                    | Splunk On-Call | https://www.splunk.com/en_us/products/on-call.html             | Former VictorOps; Splunk acquired by Cisco in 2024. Pricing via sales only.                    | Cisco (acquired Splunk 2024)         | N/A — contact sales                       |
| Pagers            |                    | Grafana OnCall | https://grafana.com/products/oncall/                           | Open-source self-hosted option available; bundled with Grafana Cloud Pro/Enterprise.            | Grafana Labs                         | Free (OSS) / bundled with Grafana Cloud   |
| Pagers            |                    | PagerTree      | https://pagertree.com/                                         |                                                                                                 |                                      | ~$10/user/month                           |
| Pagers            |                    | Iris           | https://github.com/linkedin/iris                               | LinkedIn open-source on-call and escalation tool; self-hosted only.                             | OSS (LinkedIn)                       | Free (self-hosted)                        |
| Pagers            | Incident Workflows | Rootly         | https://rootly.com                                             | Slack-native incident response; expanded into on-call management (2023). Raised $24M.          | ~$32M raised total (2023)            | Per-active-user; contact sales            |
| Pagers            | Incident Workflows | incident.io    | https://incident.io/                                           | Slack-native incident management; added on-call scheduling (2023).                              | ~$34M raised (2022)                  | ~$16/user/month (Team plan)               |
| Pagers            | Incident Workflows | Squadcast      | https://www.squadcast.com/                                     | On-call + incident response platform; strong SRE workflow focus.                                |                                      | Free tier; ~$9/user/month (Pro)           |
| Pagers            |                    | Zenduty        | https://www.zenduty.com/                                       | On-call with incident workflows; generous free tier.                                            |                                      | Free tier; ~$10/user/month (Pro)          |
| Pagers            |                    | Datadog        | https://www.datadoghq.com/blog/incident-response-with-datadog/ | Incident management bundled with Datadog observability platform.                               | Datadog Inc, NASDAQ: DDOG            | Bundled with Datadog platform             |
| Pagers            | Utility            | Better Stack   | https://betterstack.com/                                       | All-in-one: on-call, uptime monitoring, status pages, and log management.                      | ~$28.6M raised (2024)                | ~$29/user/month (Responder license)       |
| Incident Response | Incident Workflows | FireHydrant    | https://firehydrant.com/                                       | Incident orchestration and retrospectives; flat annual pricing.                                 |                                      | ~$9,600/year (flat)                       |
| Incident Response | Postmortems        | Jeli           | https://www.pagerduty.com/                                     | Acquired by PagerDuty (2023); now integrated into PagerDuty platform.                          | Part of PagerDuty                    | Included in PagerDuty plans               |
| Pagers            | Incident Workflows | Jira Service Management | https://www.atlassian.com/software/jira/service-management | Official Atlassian replacement for OpsGenie; includes alerting and on-call in Premium tier.    | Atlassian Corporation, NASDAQ: TEAM  | Free; Premium ~$44/user/month             |
| Pagers            |                    | ilert          | https://www.ilert.com/                                         | AI-first on-call and alerting platform; popular OpsGenie alternative; hosted in Germany (GDPR). | ilert GmbH                           | Free (≤5 users); Pro from ~$9/user/month  |
| Pagers            |                    | xMatters       | https://www.xmatters.com/                                      | Enterprise-grade IT alerting; acquired by Everbridge (2021). #1 on G2 IT Alerting list.        | Everbridge (acquired xMatters 2021)  | Contact sales                             |
| Pagers            |                    | Datadog On-Call | https://www.datadoghq.com/product/on-call/                    | Dedicated on-call product launched by Datadog (2024); integrates with Datadog observability.   | Datadog Inc, NASDAQ: DDOG            | Bundled with Datadog platform             |
| Pagers            |                    | AlertOps       | https://alertops.com/                                          | PagerDuty alternative with generous free tier; strong escalation and routing features.          |                                      | Free (≤5 users); Pro ~$15/user/month      |
| Utility           |                    | Prometheus AlertManager | https://prometheus.io/docs/alerting/latest/alertmanager/ | OSS alerting component for Prometheus; widely used in Kubernetes/cloud-native stacks.          | OSS (CNCF)                           | Free (self-hosted)                        |
| Utility           |                    | Backstage      | https://backstage.io/                                          | Open-source developer portal; integrates on-call and incident tools into unified views.         | OSS (Spotify)                        | Free (self-hosted)                        |
| Utility           |                    | Statuspage     | https://www.atlassian.com/software/statuspage                  | Status page tool; separate from OpsGenie (not affected by OpsGenie EOL).                       | Atlassian Corporation, NASDAQ: TEAM  | From ~$79/month                           |
| Utility           |                    | Status.io      | https://status.io/                                             | Hosted status page service.                                                                     |                                      | From ~$79/month                           |
