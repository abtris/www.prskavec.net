---
title: How we run stateful services for customers in Kubernetes
event:  Cloud Native Prague 2
event_url: https://community.cncf.io/events/details/cncf-cloud-native-prague-presents-cloud-native-prague-2/
location: Prague, Czech Republic
summary: "Disclaimer: I work for Pure Storage, which provides and sells flash storage for enterprise customers. We have a PDS (Portworx Data Services) service that offers stateful services (PostgreSQL, Kafka, Cassandra, MongoDB, Consul, Mysql, Redis, Elasticsearch, Couchbase, RabbitMQ, ZooKeeper) with a single operator for the deployment of all these services. We have a few other operators for backup and operations. All are based on the Portworx Kubernetes storage solution, and PDS will work in a cloud or on-premise Kubernetes cluster."

# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: "2023-05-11T18:00:00Z"
date_end: "2023-05-11T20:00:00Z"
all_day: false

# Schedule page publish date (NOT talk date).
publishDate: "2023-05-11T20:00:00Z"

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
url_slides: "https://speakerdeck.com/abtris/how-we-run-stateful-services-for-customers-in-kubernetes"
url_video: ""

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

Disclaimer: I work for Pure Storage, which provides and sells flash storage for enterprise customers. We have a PDS (Portworx Data Services) service that offers stateful services (PostgreSQL, Kafka, Cassandra, MongoDB, Consul, Mysql, Redis, Elasticsearch, Couchbase, RabbitMQ, ZooKeeper) with a single operator for the deployment of all these services. We have a few other operators for backup and operations. All are based on the Portworx Kubernetes storage solution, and PDS will work in a cloud or on-premise Kubernetes cluster.
