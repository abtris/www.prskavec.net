---
layout: post
title:  "Day Nine - Docker Registry"
date:   2015-12-09 11:00:00 +0100
---

Hi everyone,<br>
if you need own docker registry. You can use [official docker registry](https://github.com/docker/distribution) image.

The registry 2.0 implementation provides the following benefits:

- faster push and pull
- new, more efficient implementation
- simplified deployment
- pluggable storage backend
- webhook notifications

I love better security included in direct in Registry 2.0. In old version I have Nginx before registry for basic auth. In new version you can use basic auth or OAuth2.

If you can use basic auth with registry 2.0 create new image with your auth.

Create `auth` file:

```
mkdir auth
docker run --entrypoint htpasswd registry:2 -Bbn testuser testpassword > auth/htpasswd
```

and create image with this:

```dockerfile
FROM registry:latest
RUN mkdir /auth
ADD auth/htpasswd /auth/htpasswd
```

and I have `docker-compose.yml`:

```yaml
backend:
  image: docker.apiary-internal.com/registry
  cpu_shares: 400
  mem_limit: 314572800
  ports:
    - 5000:5000
  environment:
    AWS_BUCKET: docker-registry-bucket
    AWS_ENCRYPT: 'False'
    AWS_KEY: <AWS-KEY>
    AWS_REGION: <AWS-REGION>
    AWS_SECRET: <AWS-SECRET>
    AWS_SECURE: 'False'
    AWS_USE_SIGV4: 'False'
    SETTINGS_FLAVOR: prod
    SEARCH_BACKEND: sqlalchemy
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: 'Docker Internal Registry'
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
```

You can use for example [AWS Elastic Container Service (ECS)](https://aws.amazon.com/ecs/). You can create task definition with [`ecs-cli`](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html):

```sh
AWS_REGION=<AWS-REGION> ecs-cli compose create
```

For login into internal registry you have to use:

```sh
docker login docker-registry.company.com
```

In AWS use [Elastic Load Balancer (ELB)](https://aws.amazon.com/elasticloadbalancing/) to use `https` and forward port `443` into `5000` at ECS.

See you tomorrow,<br>
Ladislav
