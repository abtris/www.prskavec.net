---
layout: post
title:  "Day Five - Docker Compose Part 1"
date:   2015-12-05 11:00:00 +0100
---

Hi everyone,<br>
 I start parts about [docker compose](https://docs.docker.com/compose/). This tools is used for creating stacks. Application have more than one container. Best practice is every container has single purpose.

 For example Wordpress in Docker:

- you need MySQL or MariaDb
- you need PHP
- you need web server nginx or apache

How to do it? Docker compose introduce [file](https://docs.docker.com/compose/compose-file/) `docker-compose.yml` where you can describe more than one container. This is [Wordpress](https://hub.docker.com/_/wordpress/) official `docker-compose.yml` from Wordpress repository at [DockerHub](https://hub.docker.com).

```yaml
wordpress:
  image: wordpress
  links:
    - db:mysql
  ports:
    - 8080:80

db:
  image: mariadb
  environment:
    MYSQL_ROOT_PASSWORD: example
```

What you see? Here are defined 2 containers, one for `wordpress` and second for `db`. They are using `image` from Docker Hub. If you start this by `docker-compose up` images will be downloaded before run stack.
You can see directive `links`. Link is way how describe connection between containers. In Wordpress container you have after that special environment properties (for example: `MYSQL_PORT_3306_TCP`) used in [start script](https://github.com/docker-library/wordpress/blob/ef064e49ebedfa12cf27e94c58b6ec103ae9b816/apache/docker-entrypoint.sh).
Next are ports you have to expose ports from container. This depends if you using linux or VM. At linux are exposed to `localhost`. If you have docker-machine VM you exposed to IP address `docker-machine ip <VM-NAME>`.
Last used parameter in this is `environment`. You have to defined own variable as here password to MySQL for start. If you can use own variable in docker-compose from you bash. You have to define without value and run as this example: `MY_VAR=value docker-compose up`. This is useful at CI or using one file for development and test environment.

This is basics about docker-compose.

See you tomorrow,<br>
Ladislav

