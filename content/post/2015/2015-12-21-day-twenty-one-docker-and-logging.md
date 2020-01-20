---
layout: post
title:  "Day Twenty One - Docker and logging"
date:   2015-12-21 11:00:00 +0100
---

Hi everyone,<br>
every container can have different [logging driver](https://docs.docker.com/engine/reference/logging/overview/).

In version 1.9 is supported this drivers:

- json-file (Default logging driver for Docker. Writes JSON messages to file.)
- syslog (Syslog logging driver for Docker. Writes log messages to syslog.)
- journald (Journald logging driver for Docker. Writes log messages to journald.)
- gelf (Graylog Extended Log Format (GELF) logging driver for Docker. Writes log  messages to a GELF endpoint likeGraylog or Logstash.)
- fluentd (Fluentd logging driver for Docker. Writes log messages to fluentd (forward input).)
- awslogs (Amazon CloudWatch Logs logging driver for Docker. Writes log messages to Amazon CloudWatch Logs.
)

All options you can find in [documentation](https://docs.docker.com/engine/reference/logging/overview/).

If you can use some hosted services as [Papertrail](http://help.papertrailapp.com/kb/configuration/configuring-centralized-logging-from-docker/), [Loggly](https://www.loggly.com/docs/docker-syslog/) or [Sumologic](https://www.sumologic.com/application/docker/).

Setup logging for all docker container is necessary for debugging. If you can use ELK ([Elastic search, Logstash, Kibana](http://nathanleclaire.com/blog/2015/04/27/automating-docker-logging-elasticsearch-logstash-kibana-and-logspout/)). You can use [logspout](https://github.com/gliderlabs/logspout) to [send logs to logstash](https://github.com/looplab/logspout-logstash).

See you tomorrow,<br>
Ladislav
