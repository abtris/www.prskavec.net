---
layout: post
title:  "Day Three - Docker install and upgrade"
date:   2015-12-03 11:00:00 +0100
---

Hi everyone,<br>
 you need use stable docker version. Be careful about upgrade. For example from 1.8 to 1.9 was big problem with performance and network bridge had change default IP address from `172.17.42.1/24` to `172.17.0.1/24`.

## Install Docker

I don't like [Docker Kitematic](https://kitematic.com/). This isn't tool for developers. But you can try if you helps. It's available as part Docker Toolbox.

### Mac

Use homebrew, you can [install Docker Toolbox](https://www.docker.com/docker-toolbox), but I recommend install tools separately.

```bash
brew install docker
brew install docker-machine
brew install docker-compose
```

### Windows

Download [Docker Toolbox](https://www.docker.com/docker-toolbox).

### Linux

Install Docker by [your distribution](https://docs.docker.com/engine/installation/).


## Test it

For test we run docker hello-world image.

Run this command from terminal:

```
$docker run hello-world
```

and you can see this output:

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world

b901d36b6f2f: Pull complete
0a6ba66e537a: Pull complete
Digest: sha256:8be990ef2aeb16dbcb9271ddfe2610fa6658d13f6dfb8bc72074cc1ca36966a7
Status: Downloaded newer image for hello-world:latest

Hello from Docker.
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker Hub account:
 https://hub.docker.com

For more examples and ideas, visit:
 https://docs.docker.com/userguide/
```

Again, be careful about upgrade. Test, test, test every major docker version before you upgrade.

This is all folks. See you tomorrow.

Regards,<br>
Ladislav
