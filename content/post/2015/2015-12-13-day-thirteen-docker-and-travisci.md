---
layout: post
title:  "Day Thirteen - Docker and TravisCI"
date:   2015-12-13 11:00:00 +0100
---

Hi everyone,<br>
Docker is great for testing. In last post I write about [CircleCI](http://www.dockeradvent.com/2015/12/12/day-twelve-docker-and-circleci/).

## Travis CI

TravisCI is most used in Open Source projects at GitHub.

To use Docker add the following settings to your `.travis.yml`:

```
sudo: required

services:
  - docker
```

You can use `docker-compose` in similar way as in CircleCI.

```
env:
  DOCKER_COMPOSE_VERSION: 1.4.2

before_install:
  - sudo rm /usr/local/bin/docker-compose
  - curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
  - chmod +x docker-compose
  - sudo mv docker-compose /usr/local/bin
```

I'm not sure about TravisCI and [caching](https://docs.travis-ci.com/user/caching) used for docker. TravisCI using docker for normal build too, if you use `sudo: false` your build using docker at backend.

## Continues Engines

Many CI systems exists for example [drone.io](https://drone.io/) is build at top of docker. It's have only simple documentation with basics commands showing UI.

We have new generation CI as [Wercker](http://devcenter.wercker.com/docs/pipelines/per-pipeline-containers.html) or [BuildKite](https://buildkite.com/docs/guides/docker-containerized-builds) with pipelines and better support using docker.

Only future show us who win this battle for best continuous delivery tool.

See you tomorrow,<br>
Ladislav
