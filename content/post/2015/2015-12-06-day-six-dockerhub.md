---
layout: post
title:  "Day Six - Docker Hub"
date:   2015-12-06 11:00:00 +0100
---

Hi everyone,<br>
[Docker Hub](https://hub.docker.com/) is place to store container images. If you create new image, you need push them into registry. Registry can be public (default is Docker Hub) or private.

Registry you can have as service:

- [Docker Hub](https://hub.docker.com/)
- [Docker Trusted Registry](https://www.docker.com/docker-trusted-registry)
- [Quay](https://quay.io/)
- [Tutum](http://tutum.co/)

or you can run them alone:

- [Docker Registry 2.0](https://github.com/docker/distribution)

It's easy to run registry myself using docker too. I used docker registry with S3 and Nginx for authentication.

See you tomorrow,<br>
Ladislav
