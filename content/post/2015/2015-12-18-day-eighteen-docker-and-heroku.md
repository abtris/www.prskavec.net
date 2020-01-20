---
layout: post
title:  "Day Eighteen - Docker and Heroku"
date:   2015-12-18 11:00:00 +0100
---

Hi everyone,<br>
many PaaS (platform as service) support docker for deployment. I can write some posts about this. I start with Heroku.

Heroku introduce have own container solution for many years and [docker solution](https://devcenter.heroku.com/articles/docker) converts docker images into their format. You can combine `git push heroku master` with `heroku docker:release` and both works together.

First, you have to update your heroku client and add docker plugin.

```
heroku plugins:install heroku-docker
```

second, edit or create your `app.json` and add `image`.

Heroku maintains Docker images for most of the languages that we support:

- heroku/nodejs
- heroku/ruby
- heroku/jruby
- heroku/python
- heroku/scala
- heroku/clojure
- heroku/gradle
- heroku/java
- heroku/go
- heroku/go-gb

Third, you need `Procfile` as normal heroku app. And run `heroku docker:init`. Heroku create `Dockerfile` and `docker-compose.yml` file for you.

For local development just run `docker-compose up web` and app can be open at `open "http://$(docker-machine ip default):8080"`

If you need shell (for example for Ruby app), you can run `docker-compose run shell`.

Rebuild container using `docker-compose build`. This you need if you change config or app.

Deploy is easy.

1. Create Heroku app: `heroku create`
2. Push slug into Heroku: `heroku docker:release`
3. Open app in browser: `heroku open`

All docker images from heroku you can find at [dockerhub](https://hub.docker.com/r/heroku/).

If you need some special Dockerfile you can [make own](https://devcenter.heroku.com/articles/docker#modifying-the-dockerfile). This steps have some [limitations](https://devcenter.heroku.com/articles/docker#limitations) if you use own buildpack you have to use standard pipeline.

See you tomorrow,<br>
Ladislav
