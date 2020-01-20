---
layout: post
title:  "Day Ten - Docker Swarm"
date:   2015-12-10 11:00:00 +0100
---

Hi everyone,<br>
next tool from Docker is [Docker Swarm](https://docs.docker.com/swarm/). It's native clustering for Docker. You need [service discovery](https://www.nginx.com/blog/service-discovery-in-a-microservices-architecture/) based on some software as [consul](https://www.consul.io/), [etcd](https://coreos.com/etcd/docs/latest/) or [zookeeper](https://zookeeper.apache.org/).

## Setup swarm

You need docker and first you need generate token.

```
$ docker run swarm create

Unable to find image 'swarm:latest' locally
latest: Pulling from library/swarm

d681c900c6e3: Pull complete
188de6f24f3f: Pull complete
90b2ffb8d338: Pull complete
237af4efea94: Pull complete
3b3fc6f62107: Pull complete
7e6c9135b308: Pull complete
986340ab62f0: Pull complete
a9975e2cc0a3: Pull complete
Digest: sha256:c21fd414b0488637b1f05f13a59b032a3f9da5d818d31da1a4ca98a84c0c781b
Status: Downloaded newer image for swarm:latest
ca5c13a8cb0d2a1da427024b032a138a
```

Next step is launch swarm manager:

```
$ docker-machine create \
>         -d virtualbox \
>         --swarm \
>         --swarm-master \
>         --swarm-discovery token://ca5c13a8cb0d2a1da427024b032a138a \
>         swarm-master

Running pre-create checks...
Creating machine...
(swarm-master) OUT | Creating VirtualBox VM...
(swarm-master) OUT | Creating SSH key...
(swarm-master) OUT | Starting VirtualBox VM...
(swarm-master) OUT | Starting VM...
Waiting for machine to be running, this may take a few minutes...
Machine is running, waiting for SSH to be available...
Detecting operating system of created instance...
Detecting the provisioner...
Provisioning created instance...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Configuring swarm...
To see how to connect Docker to this machine, run: docker-machine env swarm-master
```

Now you can see two machines:

```
$ docker-machine ls

NAME           ACTIVE   DRIVER       STATE     URL                         SWARM
dev            *        virtualbox   Running   tcp://192.168.99.100:2376
swarm-master   -        virtualbox   Running   tcp://192.168.99.101:2376   swarm-master (master)
```

and you need create swarm node:

```
$ docker-machine create \
>   -d virtualbox \
>   --swarm \
>   --swarm-discovery token://ca5c13a8cb0d2a1da427024b032a138a \
>   swarm-agent-00

Running pre-create checks...
Creating machine...
(swarm-agent-00) OUT | Creating VirtualBox VM...
(swarm-agent-00) OUT | Creating SSH key...
(swarm-agent-00) OUT | Starting VirtualBox VM...
(swarm-agent-00) OUT | Starting VM...
Waiting for machine to be running, this may take a few minutes...
Machine is running, waiting for SSH to be available...
Detecting operating system of created instance...
Detecting the provisioner...
Provisioning created instance...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Configuring swarm...
To see how to connect Docker to this machine, run: docker-machine env swarm-agent-00
```

and another one:

```
$ docker-machine create -d virtualbox --swarm --swarm-discovery token://ca5c13a8cb0d2a1da427024b032a138a swarm-agent-01
```

and now you can see all machines:

```
$ docker-machine ls

NAME             ACTIVE   DRIVER       STATE     URL                         SWARM
dev              *        virtualbox   Running   tcp://192.168.99.100:2376
swarm-agent-00   -        virtualbox   Running   tcp://192.168.99.102:2376   swarm-master
swarm-agent-01   -        virtualbox   Running   tcp://192.168.99.103:2376   swarm-master
swarm-master     -        virtualbox   Running   tcp://192.168.99.101:2376   swarm-master (master)
```

## Running swarm

```
eval $(docker-machine env --swarm swarm-master)
```

 and now you can see:

```
$ docker-machine ls

NAME             ACTIVE   DRIVER       STATE     URL                         SWARM
dev              -        virtualbox   Running   tcp://192.168.99.100:2376
swarm-agent-00   -        virtualbox   Running   tcp://192.168.99.102:2376   swarm-master
swarm-agent-01   -        virtualbox   Running   tcp://192.168.99.103:2376   swarm-master
swarm-master     *        virtualbox   Running   tcp://192.168.99.101:2376   swarm-master (master)
```

and you can use docker info about information about your cluster:

```
$ docker info

Containers: 4
Images: 3
Role: primary
Strategy: spread
Filters: health, port, dependency, affinity, constraint
Nodes: 3
 swarm-agent-00: 192.168.99.102:2376
  └ Status: Healthy
  └ Containers: 1
  └ Reserved CPUs: 0 / 1
  └ Reserved Memory: 0 B / 1.021 GiB
  └ Labels: executiondriver=native-0.2, kernelversion=4.1.13-boot2docker, operatingsystem=Boot2Docker 1.9.1 (TCL 6.4.1); master : cef800b - Fri Nov 20 19:33:59 UTC 2015, provider=virtualbox, storagedriver=aufs
 swarm-agent-01: 192.168.99.103:2376
  └ Status: Healthy
  └ Containers: 1
  └ Reserved CPUs: 0 / 1
  └ Reserved Memory: 0 B / 1.021 GiB
  └ Labels: executiondriver=native-0.2, kernelversion=4.1.13-boot2docker, operatingsystem=Boot2Docker 1.9.1 (TCL 6.4.1); master : cef800b - Fri Nov 20 19:33:59 UTC 2015, provider=virtualbox, storagedriver=aufs
 swarm-master: 192.168.99.101:2376
  └ Status: Healthy
  └ Containers: 2
  └ Reserved CPUs: 0 / 1
  └ Reserved Memory: 0 B / 1.021 GiB
  └ Labels: executiondriver=native-0.2, kernelversion=4.1.13-boot2docker, operatingsystem=Boot2Docker 1.9.1 (TCL 6.4.1); master : cef800b - Fri Nov 20 19:33:59 UTC 2015, provider=virtualbox, storagedriver=aufs
CPUs: 3
Total Memory: 3.064 GiB
Name: f5395c4e7e6e
```

you can check `docker ps  -a` to all containers.

Try run: `docker run hello-world` and after that `docker ps -a`:

```
$ docker ps -a

CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS                                     NAMES
35dd40392b49        hello-world         "/hello"                 16 seconds ago      Exited (0) 15 seconds ago                                             swarm-agent-00/sad_hodgkin
0849ac73f36f        swarm:latest        "/swarm join --advert"   3 minutes ago       Up 3 minutes                2375/tcp                                  swarm-agent-01/swarm-agent
008e6e36c7b3        swarm:latest        "/swarm join --advert"   6 minutes ago       Up 6 minutes                2375/tcp                                  swarm-agent-00/swarm-agent
dfef13a18857        swarm:latest        "/swarm join --advert"   9 minutes ago       Up 9 minutes                2375/tcp                                  swarm-master/swarm-agent
f5395c4e7e6e        swarm:latest        "/swarm manage --tlsv"   9 minutes ago       Up 9 minutes                2375/tcp, 192.168.99.101:3376->3376/tcp   swarm-master/swarm-agent-master
```

You see our docker container ran on one of our swarm agent.

Swarm support [multiple discovery backends](https://docs.docker.com/swarm/discovery/). You can experiment with others discovery backends.

See you tomorrow,<br>
Ladislav
