---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Build nice terminal UI with Bubble Tea"
subtitle: ""
summary: "Using Go for make nice terminal UI with Bubble Tea"
authors: []
tags: []
categories: []
date: 2024-07-04T12:54:08+02:00
lastmod: 2024-07-04T12:54:08+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

If you are looking for a way to create rich and interactive text-based user interfaces in Go, look no further than the [Bubble Tea library](https://github.com/charmbracelet/bubbletea). This powerful and flexible library simplifies the process of building TUI (Text User Interface) applications, enabling you to create applications that are both visually appealing and highly functional.

## What is Bubble Tea?

Bubble Tea is a Go library developed by [Charm_](https://charm.sh/). It is inspired by The Elm Architecture, making it easy to manage state and update your UI in a predictable manner. The library is ideal for creating a variety of applications, including dashboards, command-line tools, and games.



## Key Features

- Elm-Inspired Architecture: Manage your application's state in a structured and predictable way.
- Flexible Rendering: Use the Bubble Tea rendering engine to create dynamic and interactive interfaces.
- Concurrent Programming: Take advantage of Go's concurrency model to build responsive applications.
- Cross-Platform: Works seamlessly across different operating systems.


## Getting Started

I will use [simple application that I created for demo purpose](https://github.com/abtris/rss-bubletea-demo).

It is a simple RSS reader that fetches the latest news from a feed and displays it in the terminal. The application uses Bubble Tea to create an interactive TUI that allows the user to navigate through the news items and read the full content of each article.

Main app run model and give TUI data. Project have all components related to TUI in `tui` package.

```go
package main

import (
	"fmt"
	"log"
	"os"

	"github.com/abtris/rss-bubbletea/tui"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/mmcdole/gofeed"
)

func main() {
	file, _ := os.Open("data/podcast.xml")
	defer file.Close()
	fp := gofeed.NewParser()
	feed, err := fp.Parse(file)
	if err != nil {
		log.Fatal("parse feed failed", err)
	}

	model, err := tui.NewModel(feed)
	if err != nil {
		log.Fatal("create model failed", err)
	}

	if len(os.Getenv("DEBUG")) > 0 {
		f, err := tea.LogToFile("debug.log", "debug")
		if err != nil {
			fmt.Println("fatal:", err)
			os.Exit(1)
		}
		defer f.Close()
	}

	p := tea.NewProgram(model, tea.WithAltScreen(), tea.WithMouseCellMotion())
	if err := p.Start(); err != nil {
		log.Fatal("start failed: ", err)
	}
}
```

model `tui/model.go` using [list component](https://github.com/charmbracelet/bubbles/tree/master/list) from Bubbles component library.

```go
package tui

import (
	"log"

	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/charmbracelet/bubbles/list"
	"github.com/mmcdole/gofeed"
)

type model struct {
	list     list.Model
	choice   string
	content  string
	detail   bool
	quitting bool
}

const width = 80
const height = 40
const title = "RSS Reader"

func NewModel(data *gofeed.Feed) (*model, error) {
	var items []list.Item
	converter := md.NewConverter("", true, nil)
	for _, rssItem := range data.Items {
		markdown, err := converter.ConvertString(rssItem.Description)
		if err != nil {
			log.Println("Convert to markdown", err)
		}
		i := item{
			title: rssItem.Title,
			desc:  "Published at " + rssItem.Published + "\n\n" + markdown,
		}
		items = append(items, i)
	}
	l := list.New(items, list.NewDefaultDelegate(), width, height)
	l.Title = title

	return &model{
		list:    l,
		choice:  "",
		content: "",
		detail:  false,
	}, nil
}
```

interaction with interface is covered by `tui/update.go` 

```go
package tui

import (
	tea "github.com/charmbracelet/bubbletea"
)

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.list.SetWidth(msg.Width)
		return m, nil

	case tea.KeyMsg:
		switch keypress := msg.String(); keypress {
		case "q", "ctrl+c":
			m.quitting = true
			return m, tea.Quit

		case "enter":
			i, ok := m.list.SelectedItem().(item)
			if ok {
				m.detail = true
				m.choice = string(i.title)
				m.content = string(i.desc)
			}
			return m, nil
		case "b":
			if m.detail {
				m.choice = ""
				m.content = ""
			}
		case "p":
			if m.detail {
				changeIndex := m.list.Index() + 1
				if changeIndex <= 0 {
					changeIndex = 0
				}
				m.list.Select(changeIndex)
				i, ok := m.list.SelectedItem().(item)
				if ok {
					m.choice = string(i.title)
					m.content = string(i.desc)
				}
			}
		case "n":
			if m.detail {
				changeIndex := m.list.Index() - 1
				maxLength := len(m.list.Items())
				if changeIndex > (maxLength - 1) {
					changeIndex = maxLength - 1
				}
				m.list.Select(changeIndex)
				i, ok := m.list.SelectedItem().(item)
				if ok {
					m.choice = string(i.title)
					m.content = string(i.desc)
				}
			}
		}
	}

	var cmd tea.Cmd
	m.list, cmd = m.list.Update(msg)
	return m, cmd
}
```

and view `tui/view.go` take care about rendering. I'm using [glamour](https://github.com/charmbracelet/glamour) for rendering markdown content.

```go
package tui

import (
	"log"

	"github.com/charmbracelet/glamour"
)

func (m model) View() string {
	var s string
	if len(m.choice) > 0 {
		s += "# " + title
		s += "\n## " + m.choice
		s += "\n\n"
		s += m.content
		renderer, err := glamour.NewTermRenderer(
			glamour.WithAutoStyle(),
			glamour.WithWordWrap(width),
		)
		if err != nil {
			return ""
		}
		out, err := renderer.Render(s)
		if err != nil {
			log.Println(err)
		}
		return out
	}
	return m.list.View()
}
```

Whole demo is recorded using [VHS](https://github.com/charmbracelet/vhs).

![](/post/demo.gif)

## Conclusion

Bubble Tea is a powerful and elegant library for building text-based user interfaces in Go. Whether you are creating a simple command-line tool or a complex interactive application, Bubble Tea provides the tools you need to build high-quality TUIs with ease.

I had talk about Bubble Tea on [Go meetup #15](https://www.youtube.com/watch?v=nuLZPGTvs0Y).

Give Bubble Tea a try, and you might find it to be the perfect ingredient for your next Go project!
