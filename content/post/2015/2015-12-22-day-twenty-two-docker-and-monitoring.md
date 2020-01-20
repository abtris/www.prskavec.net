---
layout: post
title:  "Day Twenty Two - Docker and monitoring"
date:   2015-12-22 11:00:00 +0100
---

Hi everyone,<br>
Docker have [runtime metrics](https://docs.docker.com/engine/articles/runmetrics/), you can see CPU, MEM, IO and network for every container.

```
$ docker stats determined_shockley determined_wozniak prickly_hypatia
CONTAINER             CPU %               MEM USAGE/LIMIT       MEM %               NET I/O
determined_shockley   0.00%               884 KiB/1.961 GiB     0.04%               648 B/648 B
determined_wozniak    0.00%               1.723 MiB/1.961 GiB   0.09%               1.266 KiB/648 B
prickly_hypatia       0.00%               740 KiB/1.961 GiB     0.04%               1.898 KiB/648 B
```

It's many tools for monitoring:

- [cAdvisor](https://github.com/google/cadvisor) from google have web UI.
- I'm using [Datadog](https://www.datadoghq.com/blog/monitor-docker-datadog/).
- [Sensu Monitoring Framework](http://sensuapp.org/) you can use with [container](https://registry.hub.docker.com/u/hiroakis/docker-sensu-server/).
- [Prometheus](http://prometheus.io/) is an open-source service monitoring system and time series database.
- [Scout](https://scoutapp.com/plugin_urls/19761-docker-monitor)

All monitoring works at some principles. Install agent on host and using docker stats and StatsD for sending data into some collection system.

See you tomorrow,<br>
Ladislav
