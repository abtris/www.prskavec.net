---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Updating README in Github personal repository"
subtitle: "How to automate update README.md in Github"
summary: "How to automate changes in README.md in personal repository in Github."
authors: ["abtris"]
tags: ["github"]
categories: []
date: 2020-07-11T08:45:17+02:00
lastmod: 2020-07-11T08:45:17+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Github introduce new feature for repository that have special name as your nickname on Github. If you add `README.md` there they display content in profile header.

![](/post/github-personal-repo.jpg)

I see first on [twitter](https://twitter.com/robinpokorny/status/1281202047086444545) where my friend mention this. I like it and make similar version. Later I see this [tweet](https://twitter.com/simonw/status/1281435464474324993) about automate content of readme.

I'm not big friend with python and I need something else there that I make my own version in Golang using Github Actions.

First I created [template for readme](https://github.com/abtris/abtris/blob/master/README.md.template) and use go to proceed template. I read RSS/Atom from my blog to update readme and I used just Golang standard library. Output is just printed to stdout.

```go
package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"text/template"
)

// Item type for RSS
type Item struct {
	Title   string `xml:"title"`
	Link    string `xml:"link"`
	Desc    string `xml:"description"`
	GUID    string `xml:"guid"`
	PubDate string `xml:"pubDate"`
}

// Channel type for RSS
type Channel struct {
	Title string `xml:"title"`
	Link  string `xml:"link"`
	Desc  string `xml:"description"`
	Items []Item `xml:"item"`
}

// Rss type for RSS as root
type Rss struct {
	Channel Channel `xml:"channel"`
}

func readFeed(url string) []string {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	rss := Rss{}

	decoder := xml.NewDecoder(resp.Body)
	err = decoder.Decode(&rss)
	if err != nil {
		log.Fatal(err)
	}

	output := []string{}
	for _, item := range rss.Channel.Items {
		output = append(output, fmt.Sprintf("[%s](%s)\n", item.Title, item.Link))
	}
	return output
}

func main() {
	content, err := ioutil.ReadFile("README.md.template")
	if err != nil {
		log.Fatal(err)
	}

	text := string(content)
	blogURL := os.Getenv("BLOG_URL")
	rssItems := readFeed(blogURL)
	data := struct {
		Title string
		Items []string
	}{
		Title: "Last blog posts",
		Items: rssItems,
	}

	t, err := template.New("readme").Parse(text)
	if err != nil {
		log.Fatal(err)
	}
	err = t.Execute(os.Stdout, data)
	if err != nil {
		log.Fatal(err)
	}
}
```

For automating this I created [workflow file `.github/workflows/build.yml`](https://github.com/abtris/abtris/blob/master/.github/workflows/build.yml).

```yaml
name: Build README

on:
  push:
  workflow_dispatch:
  schedule:
    - cron: "0 4 * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repo
        uses: actions/checkout@v2
      - name: Set up Go
        uses: actions/setup-go@v2
        with:
          go-version: "^1.14.3"
      - run: go version

      - name: Update README
        env:
          BLOG_URL: ${{ secrets.BLOG_URL }}
        run: |-
          go run main.go > README.md
          cat README.md
      - name: Commit and push if README changed
        run: |-
          git diff
          git config --global user.email "readme-bot@github.com"
          git config --global user.name "README-bot"
          git diff --quiet || (git add README.md && git commit -m "Updated README")
          git push
```

I run cron daily, you can change as you need it. I run my program `go run main.go` and stdout is forward into file and commit into repository if diff exists. Github Actions manage access into repository and you don't need add ssh key or something else. The blog URL is defined in repository `<repo>/settings/secrets` with name `BLOG_URL`, but can be directly set in this yaml file too as normal environment variable.
