---
title: "Under the Hood of AI: Building Your Own MCP Server in Go"
event: WebExpo Prague 2026
event_url: https://webexpo.net/prague2026/sessions/under-the-hood-of-ai-building-your-own-mcp-server-in-go/
location: Prague, Czech Republic
summary: "Everyone talks about using AI models, but few developers know how to extend them. In this talk, we go one level deeper and build our own Model Context Protocol (MCP) server in Go. MCP is an emerging standard that lets AI systems securely access tools, APIs, and real-world data. You'll see how to design a minimal, production-ready MCP service, connect it to an AI client, and expose your own capabilities - from querying observability data to automating workflows. We will extend the capabilities of our coding agent with an MCP server to help us in the future."

# Talk start and end times.
#   End time can optionally be hidden by prefixing the line with `#`.
date: "2026-05-27T11:00:00Z"
date_end: "2026-05-27T12:00:00Z"
all_day: false

# Schedule page publish date (NOT talk date).
publishDate: "2026-05-27T12:00:00Z"

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
url_slides: "https://speakerdeck.com/abtris/under-the-hood-of-ai-building-your-own-mcp-server-in-go"
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

Everyone talks about using AI models, but few developers know how to extend them. In this talk, we go one level deeper and build our own Model Context Protocol (MCP) server in Go. We use one of the AI assistants (Claude, Augment, Gemini) to code it. You can use any language, but I think AI using Go is super good and I explain why.

MCP is an emerging standard that lets AI systems securely access tools, APIs, and real-world data. You'll see how to design a minimal, production-ready MCP service, connect it to an AI client, and expose your own capabilities - from querying observability data to automating workflows. We extend the capabilities of our coding agent with an MCP server to help us in the future.

- Go
- MCP
- AI
