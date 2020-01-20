---
layout: post
title:  "Day Eleven - Docker Version Manager"
date:   2015-12-11 11:00:00 +0100
---

Hi everyone,<br>
Rackspace created [docker version manager](https://getcarina.com/blog/docker-version-manager/), this helps you use more version docker.

I tested on mac and works good. My college try it at linux and have problems combine with package version. But at linux is easy use normal package system to switch native version.

## Install on Mac or Linux

```
curl -sL https://download.getcarina.com/dvm/latest/install.sh | sh
```

## Usage

After dvm is installed, list all installed versions of the Docker client:

```
$ dvm ls
  1.8.3
->  system (1.9.1)
```

You can install all this versions:

```
$ dvm ls-remote
1.6.0
1.6.1
1.6.2
1.7.0
1.7.1
1.8.0
1.8.1
1.8.2
1.8.3
1.9.0
1.9.1
```

using `dvm install <VERSION>`. Switch between version you can use `dvm use` command. Project you can see at [github](https://github.com/getcarina/dvm).

I love this project. It's very useful to test new version some as I'm using similar projects for NodeJS (`nvm`), Ruby (`rbenv`) or Go (`gobrew`).

See you tomorrow,<br>
Ladislav
