---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Pipelines as Code"
subtitle: ""
summary: "Using Dagger.io Go SDK for Pipelines implementation."
authors: ["abtris"]
tags: ["docker","oci"]
categories: []
date: 2022-11-28T14:08:54+01:00
lastmod: 2022-11-28T14:08:54+01:00
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

"Pipelines as code" is not exactly a new concept, I heard about it a few years ago with the launch of [Tecton](https://tekton.dev/). I wrote a design document at that time to create a new CI that would accept various rules (Jenkins, CircleCI, TravisCI and Github Actions) and you wouldn't have to learn new syntax. Unfortunately, the project never materialized, so I didn't pursue this much longer.

Solomon Hykes left Docker a few years ago and started [Dagger.io](https://dagger.io/), where they started adopting [Cue lang](https://cuelang.org/) and working on an interesting new project. When I got access to early access I wasn't too excited about it, because writing pipelines in Cue is not something I would recommend to developers. After experiencing how hard it was to push Grafana dashboards in [Jsonnet](https://jsonnet.org/), I'm cautious.

A few weeks ago, they launched a technical preview of [Dagger Go SDK](https://docs.dagger.io/sdk/go/) and when I tried out the [basic demo](https://youtu.be/GgMskf-znh4) based on the video, I thought it was great. I decided to test on my project `ga-badge` that generates badge for Github Actions. Here's the relevant [PR](https://github.com/abtris/ga-badge/pull/49/files) with the changes, showing how simple the change is. Then here's a log of when it's dropped. I use [Mage](https://magefile.org/) for dropping as recommended by the Dagger folks for the multi repository. I'm sure there are other ways to do it, but it seemed fine to me at first.

[![asciicast](https://asciinema.org/a/4DwhBANFV53kW7QgsJRMsUZ5E.svg)](https://asciinema.org/a/4DwhBANFV53kW7QgsJRMsUZ5E)

I'll be talking about the Dagger Go SDK at [Go Meetup \#9](https://www.meetup.com/prague-golang-meetup/events/289247920/) on November 30, 2022, and if you're interested, stop by the discussion.

