---
title: "How to Make an MCP Server in Go"
event: Techspresso 2026
event_url: ""
venue: Everpure
location: Prague, Czech Republic
summary: "Most developers use AI models, but few extend them. In this talk we go a level deeper and build our own Model Context Protocol (MCP) server in Go. MCP is an emerging standard that lets AI systems securely reach tools, APIs, and real-world data. I show how to build a small, working MCP service, connect it to an AI client, and expose your own capabilities, from querying observability data to automating workflows. By the end we extend our own coding agent with an MCP server so it can do more for us."

# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: "2026-06-12T09:00:00Z"
date_end: "2026-06-12T10:00:00Z"
all_day: false

# Schedule page publish date (NOT talk date).
publishDate: "2026-06-12T00:00:00Z"

authors: []
tags: []

# Is this a featured talk? (true/false)
featured: false

image:
  caption: ''
  focal_point: Right

links:
#- icon: twitter
#  icon_pack: fab
#  name: Follow
#  url: https://twitter.com/georgecushen
url_code: ""
url_pdf: ""
url_slides: "https://speakerdeck.com/abtris/techspresso-2026-how-to-make-mcp-server-in-go"
url_video: ""

# Markdown Slides (optional).
#   Associate this talk with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides:

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects:
# - internal-project

# Enable math on this page?
math: false
---

Most developers use AI models, but few extend them. In this talk we go a level deeper and build our own Model Context Protocol (MCP) server in Go, using an AI assistant (Claude, Augment, Gemini) to write the code. You can use any language, but I think AI is especially good at Go, and I explain why.

MCP is an emerging standard that lets AI systems securely reach tools, APIs, and real-world data. I show how to build a small, working MCP service, connect it to an AI client, and expose your own capabilities, from querying observability data to automating workflows. By the end we extend our own coding agent with an MCP server so it can do more for us.

- Go
- MCP
- AI
