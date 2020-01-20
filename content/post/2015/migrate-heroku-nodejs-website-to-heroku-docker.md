+++
author = "Ladislav Prskavec"
date = 2015-05-12T18:41:28Z
description = ""
draft = false
slug = "migrate-heroku-nodejs-website-to-heroku-docker"
title = "Migrate Heroku NodeJS website to Heroku Docker"

+++

I'm using [docker](http://docker.io) for some time. I like Heroku. Heroku [introduction docker support](https://blog.heroku.com/archives/2015/5/5/introducing_heroku_docker_release_build_deploy_heroku_apps_with_docker) and I try at [PragueJS](http://www.praguejs.cz) website.

<!--more-->

### Prerequisites

1. You need [heroku toolbelt](https://toolbelt.heroku.com/) and install plugin for docker

  `heroku plugins:install heroku-docker`

2. Install [boot2docker](http://boot2docker.io/) and run it

   `boot2docker up`

### Development

3. Create Dockerfile for your nodejs app

   `heroku docker:init`

4. Start development server
 
  `heroku docker:start`

  First run and these errors:

```
  Step 0 : RUN npm install
   ---> Running in 102e9de70ce6
  npm WARN package.json vows@0.7.0 No repository field.
  npm ERR! Error: EACCES, unlink '/app/src/node_modules/.bin/marked'
  npm ERR!  { [Error: EACCES, unlink '/app/src/node_modules/.bin/marked']
  npm ERR!   errno: 3,
  npm ERR!   code: 'EACCES',
  npm ERR!   path: '/app/src/node_modules/.bin/marked' }
  npm ERR!
  npm ERR! Please try running this command again as root/Administrator.

  npm ERR! System Linux 3.18.11-tinycore64
  npm ERR! command "/app/heroku/node/bin/node" "/app/heroku/node/bin/npm" "install"
  npm ERR! cwd /app/src
  npm ERR! node -v v0.10.35
  npm ERR! npm -v 1.4.28
  npm ERR! path /app/src/node_modules/.bin/marked
  npm ERR! code EACCES
  npm ERR! errno 3
  npm ERR! stack Error: EACCES, unlink '/app/src/node_modules/.bin/marked'
  npm ERR! error rolling back Error: EACCES, unlink '/app/src/node_modules/.bin/marked'
  npm ERR! error rolling back  { [Error: EACCES, unlink '/app/src/node_modules/.bin/marked']
  npm ERR! error rolling back   errno: 3,
  npm ERR! error rolling back   code: 'EACCES',
  npm ERR! error rolling back   path: '/app/src/node_modules/.bin/marked' }
  npm ERR! not ok code 0
  Removing intermediate container 4b1054b25771
  Removing intermediate container 102e9de70ce6
```

  You need remove old `npm_modules` folder from your filesystem.

  `$ rm -rf node_modules`

  Start again

  `$ heroku docker:start`

  `sh: 1: coffee: not found`

  I have modify `Procfile` to full path:

  `- web: ./node_modules/.bin/coffee app.coffee`

  And start again:

  `$ heroku docker:start`

  I see this output, all looks good but ...

```
  starting container...
  web process will be available at http://192.168.59.103:3000/
  Express server listening in development mode at http://localhost:3333/
```

  still not work some port mishmash

  I modify my code. Change default development port from `3333` to `3000`.

  And start again:

  `$ heroku docker:start`


  **All works!**

### Deployment

  `$ heroku docker:release`

```
  creating local slug...
  building image...
  Sending build context to Docker daemon 3.975 MB
  Sending build context to Docker daemon
  Step 0 : FROM heroku-docker-039820faa4ede89c941afc2bec573ea4
  # Executing 2 build triggers
  Trigger 0, COPY . /app/src
  Step 0 : COPY . /app/src
  Trigger 1, RUN npm install
  Step 0 : RUN npm install
   ---> Running in 9e45348e8817
  strftime@0.9.0 node_modules/strftime

  string@3.1.1 node_modules/string

  marked@0.3.3 node_modules/marked

  xregexp@2.0.0 node_modules/xregexp

  sitemap@0.8.1 node_modules/sitemap
  └── underscore@1.7.0

  coffee-script@1.8.0 node_modules/coffee-script
  └── mkdirp@0.3.5

  express@3.3.8 node_modules/express
  ├── methods@0.0.1
  ├── range-parser@0.0.4
  ├── cookie-signature@1.0.1
  ├── fresh@0.2.0
  ├── buffer-crc32@0.2.1
  ├── cookie@0.1.0
  ├── mkdirp@0.3.5
  ├── debug@2.2.0 (ms@0.7.1)
  ├── commander@1.2.0 (keypress@0.1.0)
  └── send@0.1.4 (mime@1.2.11)

  connect@2.8.8 node_modules/connect
  ├── methods@0.0.1
  ├── uid2@0.0.2
  ├── cookie-signature@1.0.1
  ├── fresh@0.2.0
  ├── pause@0.0.1
  ├── bytes@0.2.0
  ├── buffer-crc32@0.2.1
  ├── qs@0.6.5
  ├── cookie@0.1.0
  ├── debug@2.2.0 (ms@0.7.1)
  ├── formidable@1.0.14
  └── send@0.1.4 (range-parser@0.0.4, mime@1.2.11)

  js-yaml@2.0.5 node_modules/js-yaml
  ├── argparse@0.1.16 (underscore@1.7.0, underscore.string@2.4.0)
  └── esprima@1.0.4

  express-debug@1.0.3 node_modules/express-debug
  ├── xtend@2.0.3
  ├── connectr@0.0.1 (debug@0.7.4, connect@2.7.11)
  └── jade@0.29.0 (character-parser@1.0.2, commander@0.6.1, mkdirp@0.3.5, transformers@1.8.3, monocle@0.1.50)

  jade@0.32.0 node_modules/jade
  ├── character-parser@1.0.2
  ├── mkdirp@0.3.5
  ├── commander@1.2.0 (keypress@0.1.0)
  ├── with@1.1.1 (uglify-js@2.4.0)
  ├── transformers@2.0.1 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)
  ├── monocle@0.1.48 (readdirp@0.2.5)
  └── constantinople@1.0.2 (uglify-js@2.4.21)

  vows@0.8.1 node_modules/vows
  ├── diff@1.0.8
  ├── eyes@0.1.8
  └── glob@4.0.6 (inherits@2.0.1, graceful-fs@3.0.6, once@1.3.2, minimatch@1.0.0)

  request@2.55.0 node_modules/request
  ├── caseless@0.9.0
  ├── json-stringify-safe@5.0.0
  ├── aws-sign2@0.5.0
  ├── forever-agent@0.6.1
  ├── stringstream@0.0.4
  ├── oauth-sign@0.6.0
  ├── tunnel-agent@0.4.0
  ├── isstream@0.1.2
  ├── node-uuid@1.4.3
  ├── qs@2.4.2
  ├── combined-stream@0.0.7 (delayed-stream@0.0.5)
  ├── tough-cookie@1.1.0
  ├── mime-types@2.0.11 (mime-db@1.9.1)
  ├── form-data@0.2.0 (async@0.9.0)
  ├── http-signature@0.10.1 (assert-plus@0.1.5, asn1@0.1.11, ctype@0.5.3)
  ├── bl@0.9.4 (readable-stream@1.0.33)
  ├── hawk@2.3.1 (cryptiles@2.0.4, sntp@1.0.9, boom@2.7.1, hoek@2.13.0)
  └── har-validator@1.7.0 (commander@2.8.1, bluebird@2.9.25, chalk@1.0.0, is-my-json-valid@2.11.0)
   ---> c416b7cb1ff0
  Removing intermediate container 01422951df67
  Removing intermediate container 9e45348e8817
  Successfully built c416b7cb1ff0
  creating remote slug...
  uploading slug...
  releasing slug...
```
### Done

Go to [website](http://www.praguejs.cz/)

  `heroku open`

All code is [public repository](https://github.com/abtris/cologne-js/)

### Summary

Running app in docker at heroku is very easy and usefule. More information you can find in this [heroku post](https://blog.heroku.com/archives/2015/5/5/introducing_heroku_docker_release_build_deploy_heroku_apps_with_docker).
