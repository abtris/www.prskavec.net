---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Grafana dashboards and Jsonnet"
subtitle: "Simple way how to make your dashboard easy to maintain"
summary: "I'm using grafana for more than year and Jsonnet helps me make dashboards easy to maintain and this is my experience with it."
authors: ['abtris']
tags: ['grafana', 'jsonnet']
categories: []
date: 2020-10-17T19:57:41+02:00
lastmod: 2020-10-17T19:57:41+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

I know [Grafana](https://grafana.com/) for a long time, but in my previous career, we used different tools as [Datadog](https://www.datadoghq.com/) or other older tools. We switched from Datadog to Grafana last year to unite with other teams in one central place.

I was looking at how others maintain their dashboards and some teams just edit and store JSON outputs from Dashboards. I heard on [Monitorama](https://monitorama.com/) conference about [Jsonnet](https://jsonnet.org/) a few years ago. I thought this would be a better approach than editing JSON files directly.

Grafana has a library called [grafonnet-lib](https://github.com/grafana/grafonnet-lib) that helps you with creating widgets in grafana via jsonnet. You can find prepared components for a dashboard, annotation, graph, singlestat, template, and more. What I find out later was that many options and parts were missing. You need to edit directly or send PRs into the library. I sent a few PRs to fix it. We found more and more missing parameters and I gave up after seeing that many PR were not merged. Today I found that the Grafana team is working on a better solution. In Grafana 7.0 they are generating [jsonnet](https://github.com/grafana/grafonnet-lib/tree/master/grafonnet-7.0) from [spec](https://github.com/grafana/dashboard-spec). I hope this will be a good solution to have all parameters available and without the need to fix it by ourselves.

## How we structure our dashboards

This is list of files in our repository:

```
├── Makefile
├── README.md
├── build
│   ├── dev
│   ├── prod
│   └── staging
├── dashboards
│   ├── actions.jsonnet
│   ├── backend.jsonnet
│   ├── mongo.jsonnet
│   ├── oncall.jsonnet
│   ├── redis.jsonnet
│   └── traffic.jsonnet
├── environments
│   ├── dev.libsonnet
│   ├── prod.libsonnet
│   └── staging.libsonnet
├── grafonnet (copy of library)
└── templates
    ├── config.libsonnet
    ├── header.libsonnet
    ├── mql.libsonnet
```

The makefile has these commands to prepare dashboards and command for deploy.

```
$ make
Usage:
  make <target>

Targets:
  help        Display this help
  clean       Clean built dashboards
  build       Build dashboards
  deploy      Deploy dashboards
  auth        Get fresh token from grafana
```

We use the same dashboards for every environment and there are configuration changes that are stored in folder `environments`. We use one grafana instance for all environments but all settings related include` name` and `title` of dashboards are specific for the environment. Dashboards have similar names as `Team - Environment - Service`.

In `template` folder we have `config.libsonnet` that is the main config file reused in all dashboards. In the folder we have common parts, such as a header with the message: `# Don\'t edit here. Edit in repository, and make PR there!`. We extend code as [tutorial](https://jsonnet.org/learning/tutorial.html) with `libsonnet` files.

The command to compile jsonnet into `build/*.json` looks like:

```
jsonnet --ext-code-file "env=environments/$(patsubst %/,%, $(dir $(patsubst build/%, %, $@))).libsonnet" dashboards/$(basename $(notdir $@)).jsonnet > $@
```

From the files in the `dashboards` folder, we create json output that is split to folders by environments. We are following guidance from [Grafana Labs at KubeCon: Foolproof Kubernetes Dashboards for Sleep-Deprived On Calls](https://grafana.com/blog/2019/05/29/grafana-labs-at-kubecon-foolproof-kubernetes-dashboards-for-sleep-deprived-on-calls/) that recommends Hierarchical Dashboards.

Our dashboards are organized in this order just on two levels. We have the main one called `oncall` for overview with summary for traffic, databases, etc. and if you click on that in the main dashboard that opens for you a more detailed dashboard with specific information and you can select region, availability zone/domain or application in a template.

We are using a jsonnet standard library to generate the list for templates that are big and easy to maintain.

```
.addTemplate(
  template.new(
    'id',
    '$datasource',
    'map($app;' + std.manifestJsonEx(dataMap, '') + ')',
    hide = 2,
    refresh = 1,
  )
)
```

and if we get issues with newlines in a map we can easily fix using standard library too and remove newlines:

```
.addTemplate(
  template.new(
    'id',
    '$datasource',
    'map($app;' + std.strReplace(std.manifestJsonEx(dataMap, ''),'\n','') + ')',
    hide = 2,
    refresh = 1,
  )
)
```

Making these changes manually in many places would be exhausting.

## Summary

The advantage of using jsonnet is more organized code for dashboards. We try to make it dry and if we have some graph type in the dashboard more times, we create a function to generate it with parameters that are different, such as application name. All code is directly in the dashboard jsonnet file. You can move that to separate files if you need it in more places.

The disadvantage of this solution is the learning curve, people don't know jsonnet, and there isn't much documentation on how to learn it. But from the year of experience, I see more benefits.
