---
layout: post
title:  "Day Seven - Dockerfile"
date:   2015-12-07 11:00:00 +0100
---

Hi everyone,<br>
if you can start making own images you need `Dockerfile`. This file describe how is image created. Every command is cachable in separate layer and this is helpful if adding new commands, rebuild is more faster than you use tools as Puppet, Chef or Ansible.

[Dockerfile](http://docs.docker.com/engine/reference/builder/) can contains many commands.

## Structure

Minimum file is for example used in Heroku:

```dockerfile
from heroku/nodejs
```

and this is only one line! This image has parent image with `Dockerfile` contains:

```dockerfile
# Inherit from Heroku's stack
FROM heroku/cedar:14

# Internally, we arbitrarily use port 3000
ENV PORT 3000
# Which version of node?
ENV NODE_ENGINE 0.12.2
# Locate our binaries
ENV PATH /app/heroku/node/bin/:/app/user/node_modules/.bin:$PATH

# Create some needed directories
RUN mkdir -p /app/heroku/node /app/.profile.d
WORKDIR /app/user

# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node

# Export the node path in .profile.d
RUN echo "export PATH=\"/app/heroku/node/bin:/app/user/node_modules/.bin:\$PATH\"" > /app/.profile.d/nodejs.sh

ONBUILD ADD package.json /app/user/
ONBUILD RUN /app/heroku/node/bin/npm install
ONBUILD ADD . /app/user/
```

This parent is `heroku/cedar:14` and his `Dockerfile`:

```dockerfile
FROM ubuntu-debootstrap:14.04
COPY ./cedar-14.sh /tmp/build.sh
RUN LC_ALL=C DEBIAN_FRONTEND=noninteractive /tmp/build.sh
```

and this parent `ubuntu-debootstrap:14.04` is:

```dockerfile
FROM scratch
ADD rootfs.tar.xz /
CMD ["/bin/bash"]
```

and `scratch` is [empty image](https://hub.docker.com/r/library/scratch/) that is used explicitly to build new images.

## Commands

You start with `FROM`. Usually use smallest possible image or image used in your servers.

For adding files into image use `ADD` or `COPY`.

```
If you're not interested in the nuances of ADD and COPY and just want an answer to "which one should I use?", all you need to know is: use COPY. - [Brian DeHamer](https://labs.ctl.io/dockerfile-add-vs-copy/)
```

In simple way `ADD` use only for URL address or archives.

Next is `RUN` command, you can run any OS command. Every `RUN` is in separate layer and it's useful if you group commands.

Instead using:

```dockerfile
RUN apt-get update
RUN apt-get install -y package-bar
RUN apt-get install -y package-baz
RUN apt-get install -y package-foo
```

use this:

```dockerfile
RUN apt-get update && apt-get install -y \
        package-bar \
        package-baz \
        package-foo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

First example create 4 images for every layer. Second create only one and clean after install. This helps with image size.

If you need ports use `EXPOSE`, for environment properties `ENV`

`ENTRYPOINT` is main image command and `CMD` is for default flags.

```dockerfile
ENTRYPOINT ["node"]
CMD ["--version"]
```

Now the image can be run like this to show the command’s help:

```
$ docker run node
```

Or using the right parameters to execute a command:

```
$ docker run node install aws-sdk
```

You can define `VOLUME`, `USER`, `WORKDIR` if you need it.

Last interesting command is `ONBUILD`. I like this, you can defined some parts in parent image. This commands will be executed in building only for child image. Example we have in our image where is `FROM heroku/nodejs` image. This image in build execute sequence defined in `heroku\nodejs` image.

```
ONBUILD ADD package.json /app/user/
ONBUILD RUN /app/heroku/node/bin/npm install
ONBUILD ADD . /app/user/
```

in our image is added `package.json` and install all dependencies. After that add your source code.

This is very good example how use `ONBUILD` as template for your apps. Another examples are many images for [golang](https://hub.docker.com/_/golang/), [perl](https://hub.docker.com/_/perl/), [rails](https://hub.docker.com/_/rails/), [nodejs](https://hub.docker.com/_/node/), [php](https://hub.docker.com/_/php/), [wordpress](https://hub.docker.com/_/wordpress/), [java](https://hub.docker.com/_/java/) as based images.

See you tomorrow,<br>
Ladislav
