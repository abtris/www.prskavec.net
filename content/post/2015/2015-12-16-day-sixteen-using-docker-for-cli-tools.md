---
layout: post
title:  "Day Sixteen - Using docker for CLI Tools"
date:   2015-12-16 11:00:00 +0100
---

Hi everyone,<br>
I like one thing at docker and that is isolation. For example we have [project Polls API](https://github.com/apiaryio/polls-api) written in Python. For testing API we use tool named [Dredd](http://dredd.readthedocs.org/en/latest/) written in NodeJS. I can't install NodeJS to our system. But you can easy use Docker to solve this problem.

Here is `circle.yml` file for project:

```yaml
machine:
  pre:
    - echo 'DOCKER_OPTS="-s btrfs -e lxc -D --userland-proxy=false"' | sudo tee -a /etc/default/docker
    - sudo curl -L -o /usr/bin/docker 'https://s3-external-1.amazonaws.com/circle-downloads/docker-1.8.3-circleci'
    - sudo chmod 0755 /usr/bin/docker
  services:
    - docker
dependencies:
  cache_directories:
    - "~/bin/docker-compose/"
  override:
    - docker info
    - docker version
    - if [[ ! -e ~/bin/docker-compose ]]; then mkdir ~/bin/docker-compose/ && curl -L https://github.com/docker/compose/releases/download/1.4.2/docker-compose-`uname -s`-`uname -m` > ~/bin/docker-compose/docker-compose && chmod +x ~/bin/docker-compose/docker-compose; fi
    - ~/bin/docker-compose/docker-compose --version
    - ~/bin/docker-compose/docker-compose pull
    - docker pull apiaryio/dredd
    - ~/bin/docker-compose/docker-compose build
test:
  pre:
    - ~/bin/docker-compose/docker-compose up -d web
    - ~/bin/docker-compose/docker-compose run shell python manage.py migrate
  override:
    - ~/bin/docker-compose/docker-compose run shell python manage.py test
  post:
    - ./scripts/dredd
```

and bash script for running dredd is:

```
#!/bin/bash
# set -x
which docker-compose > /dev/null 1>&1
if [ $? -eq 0 ]; then
  DOCKER_COMPOSE='docker-compose'
else
  if [ -f ~/bin/docker-compose/docker-compose ]; then
    DOCKER_COMPOSE="$HOME/bin/docker-compose/docker-compose"
  else
    echo "Cannot find docker-compose!"
    exit 1
  fi
fi
# Sync the database
$DOCKER_COMPOSE run -e DATABASE_URL=sqlite:///dredd.sqlite shell "python manage.py migrate"
# Run the dev server
$DOCKER_COMPOSE up -d web
IPWEB=`docker ps  | grep pollsapi_web | cut -d ' ' -f1 | xargs docker inspect  | grep IPAddress\": | cut -d ":" -f2 | tr -d "\"" | tr -d "," | tr -d '[[:space:]]'`
# Run dredd
docker run -v $(pwd):/root -w /root apiaryio/dredd dredd apiary.apib http://$IPWEB:8080
RESULT=$?
exit $RESULT
```

You can see setup database using docker-compose. After running web, I get IP address for python server and using this address as parameter for running dredd command.

If you can create image for some tools you can make it as I did for Dredd.

```dockerfile
from node:0.12

RUN npm install -g dredd

CMD dredd
```

It's easy and depends on your tool. Sometimes is better use `ENTRYPOINT` and `CMD`. Dredd works out of box without parameters using `dredd.yml` config. For example API Blueprint parser [drafter](https://github.com/apiaryio/drafter) waiting for input from stdin. There is better using `ENTRYPOINT` and `CMD` with `-h` as default parameter.

```dockerfile
FROM apiaryio/base-dev-cpp:1.0.0
MAINTAINER Apiary "sre@apiary.io"


RUN locale-gen en_US.UTF-8
RUN echo "LC_ALL=en_US.UTF-8" >> /etc/default/locale
RUN dpkg-reconfigure locales

ADD ./ /drafter

WORKDIR /drafter

# It's tempting to put ./configure into RUN, but then you have timestamp issues

RUN ./configure && make all && make install

ENTRYPOINT /usr/local/bin/drafter
CMD "-h"
```

See you tomorrow,<br>
Ladislav
