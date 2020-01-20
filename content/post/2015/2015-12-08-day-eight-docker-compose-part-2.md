---
layout: post
title:  "Day Eight - Docker Compose Part 2"
date:   2015-12-08 11:00:00 +0100
---

Hello everyone,<br>
I'm back with Docker Compose. In [previous post](http://www.dockeradvent.com/2015/12/05/day-five-docker-compose-part-1/) we have some basics. Today, I can show how you can combine `Dockerfile` and `docker-compose.yml` file. This is useful for development. Can't be used in production.

My example is simple Ruby application. I can use Redis for caching and queues.
I can use image with Redis from Docker Hub. I use hosted Redis in production and this is only for development. But app is specific. I can use Sinatra framework and use last Ruby.
 We can look at Docker Hub if exists [official image for Ruby](https://hub.docker.com/_/ruby/). Yes, here is. I choose using them and create `Dockerfile` to extend this image for my application. This is my `Dockerfile`:

Ruby dockerfile is:

```dockerfile
FROM ruby:2.2

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ONBUILD COPY Gemfile /usr/src/app/
ONBUILD COPY Gemfile.lock /usr/src/app/
ONBUILD RUN bundle install

ONBUILD COPY . /usr/src/app
````

my `Dockerfile` is easy:

```
FROM ruby:2.2-onbuild

EXPOSE 4567

WORKDIR /usr/src/app


ENTRYPOINT ["/usr/local/bin/ruby"]
CMD ["server.rb"]
```

I have to test if build works:

```
docker built -t abtris/sinatra .
```

and integrate with `docker-compose.yml`

```yaml
cache:
  image: redis
web:
  build: .
  links:
    - cache
  expose:
    - 4567
```

and you run this with `docker-compose up`:

```
$ docker-compose up
Creating sinatra_cache_1
Creating sinatra_web_1
Attaching to sinatra_cache_1, sinatra_web_1
cache_1 | 1:C 08 Dec 13:22:32.153 # Warning: no config file specified, using the default config. In order to specify a config file use redis-server /path/to/redis.conf
cache_1 |                 _._
cache_1 |            _.-``__ ''-._
cache_1 |       _.-``    `.  `_.  ''-._           Redis 3.0.5 (00000000/0) 64 bit
cache_1 |   .-`` .-```.  ```\/    _.,_ ''-._
cache_1 |  (    '      ,       .-`  | `,    )     Running in standalone mode
cache_1 |  |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
cache_1 |  |    `-._   `._    /     _.-'    |     PID: 1
cache_1 |   `-._    `-._  `-./  _.-'    _.-'
cache_1 |  |`-._`-._    `-.__.-'    _.-'_.-'|
cache_1 |  |    `-._`-._        _.-'_.-'    |           http://redis.io
cache_1 |   `-._    `-._`-.__.-'_.-'    _.-'
cache_1 |  |`-._`-._    `-.__.-'    _.-'_.-'|
cache_1 |  |    `-._`-._        _.-'_.-'    |
cache_1 |   `-._    `-._`-.__.-'_.-'    _.-'
cache_1 |       `-._    `-.__.-'    _.-'
cache_1 |           `-._        _.-'
cache_1 |               `-.__.-'
cache_1 |
cache_1 | 1:M 08 Dec 13:22:32.154 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
cache_1 | 1:M 08 Dec 13:22:32.154 # Server started, Redis version 3.0.5
cache_1 | 1:M 08 Dec 13:22:32.154 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
cache_1 | 1:M 08 Dec 13:22:32.154 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
cache_1 | 1:M 08 Dec 13:22:32.154 * The server is now ready to accept connections on port 6379
web_1   | [2015-12-08 13:22:32] INFO  WEBrick 1.3.1
web_1   | [2015-12-08 13:22:32] INFO  ruby 2.2.3 (2015-08-18) [x86_64-linux]
web_1   | == Sinatra (v1.4.6) has taken the stage on 4567 for development with backup from WEBrick
web_1   | [2015-12-08 13:22:32] INFO  WEBrick::HTTPServer#start: pid=1 port=4567
```

Application works `open http://$(docker-machine ip dev)` launch browser and you can see your application.


See you tomorrow,<br>
Ladislav
