---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Grafana dashboards and Jsonnet"
subtitle: "Simple way how make your dashboard easy to maintain"
summary: "I'm using grafana for more than year and Jsonnet help me make dashboards easy to maintain and there my experience with it."
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

I know [Grafana](https://grafana.com/) for a long time, but in my previous career, we used different tools as [Datadog](https://www.datadoghq.com/) or other older tools. We switch from Datadog to Grafana last year to unite with other teams in one central place.

I was looking at how others maintain their dashboard and some teams just editing and storing JSON outputs from Dashboards. I heard on [Monitorama](https://monitorama.com/) conference about [Jsonnet](https://jsonnet.org/) a few years ago. I think this will be a better approach than editing JSON files directly.

Grafana has a library called [grafonnet-lib](https://github.com/grafana/grafonnet-lib) that helps you with creating widgets in grafana via jsonnet. You find prepared components for a dashboard, annotation, graph, singlestat, template, and more. What you find later that many options or parts missing. You need to edit directly or send PR's into the library. I send a few PR's to fix it. We found more and more missing parameters and I gave up after seeing that many PR are not merged. Today I found that the Grafana team working on a better solution. Grafana 7.0 they are generating [jsonnet](https://github.com/grafana/grafonnet-lib/tree/master/grafonnet-7.0) from [spec](https://github.com/grafana/dashboard-spec). I hope this will be a good solution to have all parameters available and you don't fix by ourselves.

## How we structure our dashboards

This is list of files in our repository:

```
├── Makefile
├── README.md
├── build
│   ├── dev
│   ├── prod
│   └── staging
├── dashboards
│   ├── actions.jsonnet
│   ├── backend.jsonnet
│   ├── mongo.jsonnet
│   ├── oncall.jsonnet
│   ├── redis.jsonnet
│   └── traffic.jsonnet
├── environments
│   ├── dev.libsonnet
│   ├── prod.libsonnet
│   └── staging.libsonnet
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

We use the same dashboards for every environment there are configuration changes that are stored in folder `environments`. We using one grafana instance for all environments but all settings related include` name` and `title` of dashboards are specific for the environment. Dashboards have similar names as `Team - Environment - Service`.

I `template` folder we have `config.libsonnet` that is main config file reused in all dashboards. In folder we have common parts that are header with message: `# Don\'t edit here. Edit in repository, and make PR there!`. We extend code as [tutorial](https://jsonnet.org/learning/tutorial.html) with `libsonnet` files.

The command for compile jsonnet into `build/*.json` looks like:

```
jsonnet --ext-code-file "env=environments/$(patsubst %/,%, $(dir $(patsubst build/%, %, $@))).libsonnet" dashboards/$(basename $(notdir $@)).jsonnet > $@
```

We create from files in folder `dashboards` json output that are in folders by environments. We are following guidance from [Grafana Labs at KubeCon: Foolproof Kubernetes Dashboards for Sleep-Deprived On Calls](https://grafana.com/blog/2019/05/29/grafana-labs-at-kubecon-foolproof-kubernetes-dashboards-for-sleep-deprived-on-calls/) that recommend Hierarchical Dashboards.

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

Make these changes manually in many places will be exhausting.

## Summary

The advantage of using jsonnet is more organized code for dashboards. We try to make it dry and if we have some graph type in the dashboard more times, we created a function to generate it with parameters that are different as for example application name. All code is directly in the dashboard jsonnet file. You can move that to separate files if you need it in more places.

The disadvantage of this solution is the learning curve, people don't know jsonnet, and aren't so many materials on how to learn it. But from the year of experience, I see more benefits.
