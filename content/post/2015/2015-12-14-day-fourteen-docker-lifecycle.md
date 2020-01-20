---
layout: post
title:  "Day Fourteen - Docker Lifecycle"
date:   2015-12-14 11:00:00 +0100
---

Hi everyone,<br>
 I can write some details about docker containers. How images and containers born and die.

## Steps in lifecycle

1. You have to `build` **image**. Make [`Dockerfile`](http://localhost:4000/2015/12/07/day-seven-dockerfile/) and run `docker build`.

  - you can run `docker build .`
  - or you add tag name `docker build -t username/my-imagename .`
  - or you can have `Dockerfile` somewhere at path `docker build -t username/my-imagename -f /path/Dockerfile`

2. If you run image by `docker run` you create **container**. You can check them by `docker ps`.

3. Container can be in different status, you can stop them by `docker stop`.

4. If you make some changes by using terminal `docker run -it <image-name> /bin/bash` or `docker exec -it <container-id> /bin/bash`. You can change this **container** into **image**. You have to use `docker commit` [command](https://docs.docker.com/engine/reference/commandline/commit/).

## Docker lifecycle schema

![Docker Container Lifecycle](/assets/docker-lifecycle-2.png)

Next, I write post about details and all commands and statuses docker container.

See you tomorrow,<br>
Ladislav
