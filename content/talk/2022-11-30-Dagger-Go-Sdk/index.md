---
title: CI pipelines should be code! Dagger Go SDK
event:  Go Meetup 9 in Prague
event_url: https://www.meetup.com/prague-golang-meetup/events/289247920/
location: Prague, Czech Republic
summary: Talk is about new Dagger Go SDK
abstract: "Dagger is a programmable CI/CD engine that runs your pipelines in containers. Develop your CI/CD pipelines as code, in the same programming language as your application. Dagger executes your pipelines entirely as standard OCI containers."

# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: "2022-11-30T18:00:00Z"
date_end: "2022-11-30T20:00:00Z"
all_day: false

# Schedule page publish date (NOT talk date).
publishDate: "2022-11-30T20:00:00Z"

authors: []
tags: []

# Is this a featured talk? (true/false)
featured: false

image:
  caption: ''
  focal_point: Right

links:
#- icon: twitter
#  icon_pack: fab
#  name: Follow
#  url: https://twitter.com/georgecushen
url_code: ""
url_pdf: ""
url_slides: "https://speakerdeck.com/abtris/ci-pipelines-should-be-code-dagger-go-sdk"
url_video: "https://www.youtube.com/watch?v=QsIjuA3UBg4"

# Markdown Slides (optional).
#   Associate this talk with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides:

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects:
# - internal-project

# Enable math on this page?
math: false
---

Dagger is a programmable CI/CD engine that runs your pipelines in containers. Develop your CI/CD pipelines as code, in the same programming language as your application. Dagger executes your pipelines entirely as standard OCI containers. This has several benefits:

- Instant local testing
- Portability: the same pipeline can run on your local machine, a CI runner, a dedicated server, or any container hosting service.
- Superior caching: every operation is cached by default, and caching works the same everywhere
- Compatibility with the Docker ecosystem: if it runs in a container, you can add it to your pipeline
- Cross-language instrumentation: teams can use each other’s tools without learning each other’s language
