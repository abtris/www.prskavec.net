---
layout: post
title:  "Day Fifteen - Container Lifecycle"
date:   2015-12-15 11:00:00 +0100
---

Hi everyone,<br>
 I can write some details about docker containers lifecycle.

## Container statuses

- running
- stopped
- paused
- killed
- removed

## How change status

- image -> `docker run` -> running
- running -> `docker pause` -> paused -> `docker unpause` -> running
- running -> `docker stop` -> stopped -> `docker start` -> running
- stopped -> `docker rm` -> removed
- running -> `docker kill` -> killed -> `docker rm` -> removed
- running -> `docker rm --force` -> removed
- running -> `docker restart` -> stopped -> running

## Docker container lifecycle schema

![Docker Container Lifecycle](/assets/docker-lifecycle-3.png)

You can see you have many containers, sometimes problems with space in VM. Docker consumes big amount of disk space. I use this script `docker-cleanup` for cleanup my VM. First command remove containers and second remove images.

```
#!/bin/bash
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)
```

See you tomorrow,<br>
Ladislav
