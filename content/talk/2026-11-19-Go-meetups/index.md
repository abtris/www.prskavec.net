---
title: "Migrations that never roll back"
event: Go Meetup 26 in Prague
event_url: https://www.meetup.com/prague-golang-meetup/events/317158041/
venue: Everpure
location: Prague, Czech Republic
summary: "Why we left golang-migrate and built a small migration service on jackc/tern: migrations ship ahead of the code, forward only, so the service can always be rolled back."
abstract: "Why build your own database migration tool when so many exist? Our Go services ran golang-migrate at start-up, which tied the schema to the binary and made rollbacks unsafe. This talk covers the rule we adopted instead (migrations ship first and never roll back), the service we built on jackc/tern to enforce it, and the trade-offs of building against adopting."

# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: "2026-11-19T18:00:00+01:00"
date_end: "2026-11-19T21:00:00+01:00"
all_day: false

# Schedule page publish date (NOT talk date).
publishDate: "2026-11-19T21:00:00+01:00"

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
url_slides: "https://speakerdeck.com/abtris/migrations-that-never-roll-back"
url_video: "https://www.youtube.com/watch?v=rcx25t-Rqnc"

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

Why build your own database migration tool when so many exist? Our Go services ran golang-migrate at start-up, which tied the schema to the binary and made rollbacks unsafe. This talk covers the rule we adopted instead (migrations ship first and never roll back), the service we built on jackc/tern to enforce it, and the trade-offs of building against adopting.

- [Written version: Migrations that never roll back]({{< relref "/post/migrations-that-never-roll-back" >}})
- [golang-migrate](https://github.com/golang-migrate/migrate)
- [jackc/tern](https://github.com/jackc/tern)
