---
layout: post
title:  "Day Twelve - CircleCI and Docker"
date:   2015-12-12 11:00:00 +0100
---

Hi everyone,<br>
Docker is great for testing. I make a few posts about support in Continues Integration Engines.

- [CircleCI](https://circleci.com/docs/docker)
- [TravisCI](https://docs.travis-ci.com/user/docker/)
- [Jenkins](https://github.com/jenkinsci/docker)
- [Drone](http://drone.io/)
- [BuildKite](https://buildkite.com/docs/guides/docker-containerized-builds)

## Circle CI

To use Docker add required service into `circle.yml` file:

```yaml
machine:
  services:
    - docker
```

you can use this for install different version docker than default (1.8.3):

```
machine:
  pre:
    - echo 'DOCKER_OPTS="-s btrfs -e lxc -D --userland-proxy=false"' | sudo tee -a /etc/default/docker
    - sudo curl -L -o /usr/bin/docker 'https://s3-external-1.amazonaws.com/circle-downloads/docker-1.9.0-circleci'
    - sudo chmod 0755 /usr/bin/docker
  services:
    - docker
```

if you need use own `docker-compose` version use this in dependencies:

```
dependencies:
  cache_directories:
    - "~/bin/docker-compose/"
  override:
    - if [[ ! -e ~/bin/docker-compose ]]; then mkdir ~/bin/docker-compose/; fi
    - if [[ `~/bin/docker-compose/docker-compose -v | cut -d " " -f3` < "1.5.1" ]]; then curl -L https://github.com/docker/compose/releases/download/1.5.1/docker-compose-`uname -s`-`uname -m` > ~/bin/docker-compose/docker-compose && chmod +x ~/bin/docker-compose/docker-compose; fi
    - ~/bin/docker-compose/docker-compose --version
```

you can use caching docker layers:

```
dependencies:
  cache_directories:
    - "~/docker"

  override:
    - if [[ -e ~/docker/image.tar ]]; then docker load -i ~/docker/image.tar; fi
    - docker build -t circleci/elasticsearch .
    - mkdir -p ~/docker; docker save circleci/elasticsearch > ~/docker/image.tar
```

you have to test if helps performance. For every hosted CI will helps caching docker hub, but I think this isn't good solution. Look carefully at [caching issues](https://circleci.com/docs/docker#some-known-caching-issues).

See you tomorrow,<br>
Ladislav
