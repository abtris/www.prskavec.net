---
layout: post
title:  "Day Twenty Three - Docker tips and tricks"
date:   2015-12-23 11:00:00 +0100
---

Hi everyone,<br>
this is last but one post before Christmas.

### 1. Get IP address of your container

```
docker inspect -f '{{ json .NetworkSettings }}' $ID
```

example:

```
$ docker inspect -f '{{ json .NetworkSettings }}' 9dd74d9998bb

{"Bridge":"","SandboxID":"","HairpinMode":false,"LinkLocalIPv6Address":"","LinkLocalIPv6PrefixLen":0,"Ports":null,"SandboxKey":"","SecondaryIPAddresses":null,"SecondaryIPv6Addresses":null,"EndpointID":"","Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"IPAddress":"","IPPrefixLen":0,"IPv6Gateway":"","MacAddress":"","Networks":{"bridge":{"EndpointID":"","Gateway":"","IPAddress":"","IPPrefixLen":0,"IPv6Gateway":"","GlobalIPv6Address":"","GlobalIPv6PrefixLen":0,"MacAddress":""}}}
```

if you can have nice output you can use python or [jq](https://stedolan.github.io/jq/).

```
$ docker inspect -f '{{ json .NetworkSettings }}' $ID | python -mjson.tool
```

or

```
$ docker inspect -f '{{ json .NetworkSettings }}' $ID | jq
```

jq have nice colored output:

```json
{
  "Bridge": "",
  "SandboxID": "",
  "HairpinMode": false,
  "LinkLocalIPv6Address": "",
  "LinkLocalIPv6PrefixLen": 0,
  "Ports": null,
  "SandboxKey": "",
  "SecondaryIPAddresses": null,
  "SecondaryIPv6Addresses": null,
  "EndpointID": "",
  "Gateway": "",
  "GlobalIPv6Address": "",
  "GlobalIPv6PrefixLen": 0,
  "IPAddress": "",
  "IPPrefixLen": 0,
  "IPv6Gateway": "",
  "MacAddress": "",
  "Networks": {
    "bridge": {
      "EndpointID": "",
      "Gateway": "",
      "IPAddress": "",
      "IPPrefixLen": 0,
      "IPv6Gateway": "",
      "GlobalIPv6Address": "",
      "GlobalIPv6PrefixLen": 0,
      "MacAddress": ""
    }
  }
}
```

I like `jq` it's quite useful for manipulating, selection data from JSON. It's good to know this tool.

If you have one running container you can easy get ID from `docker ps` command.

```
$ docker inspect -f '{{ .NetworkSettings.IPAddress }}' $(docker ps -q)
```

### 2. Cleanup your docker machine

If you see message about running out of space. Cleanup machine.


```
# Delete all containers
docker rm $(docker ps -a -q)
```

```
# Delete all images
docker rmi $(docker images -q)
```

You can remove only containers or both. Depends at your use case.

### 3. Docker cheet sheet

Print this or [bookmark](https://github.com/wsargent/docker-cheat-sheet).

### 4. Environment properties in container

This is useful if you have `--link` parameter. Get `CONTAINER_ID` of running container using `docker ps` and use `docker exec` to show all environment properties.

```
$  docker exec <CONTAINER_ID> env

PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=dda0a7c94a09
TERM=xterm
REDIS_PORT=tcp://172.17.0.2:6379
REDIS_PORT_6379_TCP=tcp://172.17.0.2:6379
REDIS_PORT_6379_TCP_ADDR=172.17.0.2
REDIS_PORT_6379_TCP_PORT=6379
REDIS_PORT_6379_TCP_PROTO=tcp
REDIS_NAME=/jovial_ramanujan/redis
REDIS_ENV_REDIS_VERSION=3.0.5
REDIS_ENV_REDIS_DOWNLOAD_URL=http://download.redis.io/releases/redis-3.0.5.tar.gz
REDIS_ENV_REDIS_DOWNLOAD_SHA1=ad3ee178c42bfcfd310c72bbddffbbe35db9b4a6
HOME=/root
```

If you can show `env` in image just run `docker run <IMAGE_NAME> env`.

### 5. Minimal docker image

You can use empty image called [scratch](https://hub.docker.com/_/scratch/) or small image as [alpine](https://hub.docker.com/_/alpine/). [Alpine Linux](http://alpinelinux.org/) is very small secure linux distribution. Image have 5MB and package repository to possibility install necessary things.

Use like you would any other base image:

```dockerfile
FROM alpine:3.1
RUN apk add --update mysql-client && rm -rf /var/cache/apk/*
ENTRYPOINT ["mysql"]
```

This example has a virtual image size of only 16 MB. Compare that to our good friend Ubuntu:

```dockerfile
FROM ubuntu:14.04
RUN apt-get update \
    && apt-get install -y mysql-client \
    && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["mysql"]
```

This yields us a virtual image size of about 232 MB image.

I think this is very useful.

See you tomorrow,<br>
Ladislav
