---
title: Posts

# View.
#   1 = List
#   2 = Compact
#   3 = Card
view: 2

# Optional header image (relative to `static/img/` folder).
header:
  caption: ""
  image: ""

# Cascade also applies to this section page itself — pin its outputs so the
# posts RSS feed (/post/index.xml) survives the cascade below.
outputs:
  - HTML
  - RSS

# Every post also renders a Substack-ready export at <post-url>/substack.html
# (layouts/post/single.substack.html) for copy-pasting into the Substack editor.
cascade:
  outputs:
    - HTML
    - SUBSTACK
---
