---
layout: post
title:  "Day Seventeen - Docker and Sphinx documentation"
date:   2015-12-17 11:00:00 +0100
---

Hi everyone,<br>
if you write the docs, you can use [Sphinx](http://sphinx-doc.org/). You can share your documentation using [Read the Docs](https://readthedocs.org/) portal.

If you look at [quickstart](https://docs.readthedocs.org/en/latest/getting_started.html#write-your-docs) how write the docs, you can install python and some tools. This can be complicated if you can use latex for creating PDF version and do you need another version python for your development and some another for write the docs. Some members of your team can't install anything for update just a few lines.

## Docker solution for Sphinx

You can use [docker image](https://hub.docker.com/r/apiaryio/base-sphinx-doc-dev/). There is `requirements.txt` for all python packages:

```
Sphinx>=1.3.1
awscli==1.5.2
sphinx_rtd_theme
recommonmark
```

and Dockerfile based on debian.

```dockerfile
FROM        debian:jessie
MAINTAINER  Apiary <sre@apiary.io>

ENV REFRESHED_AT 2015-11-03

COPY requirements.txt /tmp/

RUN apt-get clean && \
    apt-get update && \
    apt-get install -y --no-install-recommends python-sphinx \
    graphviz \
    make \
    python-pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /usr/share/doc/* && \
    rm -rf /usr/share/locale/* && \
    rm -rf /var/cache/debconf/*-old && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get autoclean -y && \
    apt-get autoremove -y

RUN mkdir /mnt/docs

WORKDIR /mnt/docs
VOLUME ['/mnt/docs']

CMD make clean html
```

for running in repository with documentation you can use simple shell script, with support html and latex version. [Latex image size](https://github.com/apiaryio/docker-base-images/blob/master/sphinx-latex-doc-dev/Dockerfile) is more than 1GB. Html version have only 100MB.

```
#!/bin/bash
if [[ "$@" =~ latex.* ]]; then
    echo "Building with LaTex image"
    docker run -ti --rm -v $(pwd):/mnt/docs:rw -w /mnt/docs apiaryio/base-sphinx-latex-doc-dev $@
else
    echo "Building with html-only image"
    docker run -ti --rm -v $(pwd):/mnt/docs:rw -w /mnt/docs apiaryio/base-sphinx-doc-dev $@
fi
```

Using is very simple just run `./build.sh` and `open build/html/index.html`. You can use your favorite editor to edit sources and after that just run build again and check in browser. This version supports [reStructuredText](http://sphinx-doc.org/rest.html) and [markdown](https://help.github.com/articles/markdown-basics/). You can combine both formats into your documentation. I prefer using markdown for simple text as this blog, but for complex documentation with references is better use reStructuredText (rst) format.

If you like write the docs, please check [Write the Docs](http://www.writethedocs.org/) conferences and meetups.

See you tomorrow,<br>
Ladislav
