---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "My Dotfiles and the Tools I Use (2026 Edition)"
subtitle: ""
summary: "A tour of my dotfiles: how I bootstrap a new Mac, the terminal and shell setup, the CLI tools I have swapped in, and how AI agents fit into the workflow. A living post I update every year with what changed."
authors: ["abtris"]
tags: ["dotfiles", "tooling", "cli", "macos"]
categories: []
date: 2026-07-20T09:00:00+02:00
lastmod: 2026-07-20T09:00:00+02:00
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
projects: []
---

I have carried the same dotfiles from machine to machine for years. Every so
often it is worth pruning them and writing down what I actually use and why.
The whole thing lives in the open at [abtris/dotfiles](https://github.com/abtris/dotfiles),
so if something here looks useful, take it.

This is the 2026 edition. I plan to keep it as a living post and update it once a
year, so the "What changed this year" section below is really the interesting
part if you have read it before.

## What changed this year

Most of this year's changes were around the terminal and coding agents.

- **New terminal: [Ghostty](https://ghostty.org/).** I moved off my previous
  terminal to Ghostty and cleaned up the config along the way.
- **New multiplexer: [Herdr](https://herdr.dev/), and I dropped cmux.** Herdr is
  built for driving coding agents across panes and workspaces. I added Ghostty
  keybinds for its prefix and `CMD+SHIFT+arrow` workspace navigation, plus an
  `hnew` workspace that opens an agent tab next to a terminal tab.
- **AI agents became a daily driver.** [Claude Code](https://www.anthropic.com/claude-code)
  and [pi](https://pi.dev/) are now part of the loop, with telemetry env and an
  `agents` alias wired in. Along the way I tried and dropped several other
  harnesses (Augment came and went) which is exactly the point of keeping the
  harness swappable.
- **[lsd](https://github.com/lsd-rs/lsd) replaced `ls`** and
  **[jj](https://github.com/jj-vcs/jj) (Jujutsu)** joined the toolbox next to Git
  for experimentation.
- **[mise](https://mise.jdx.dev/)** took over runtime version management, and I
  added Git worktree aliases and reworked my fzf-based `j()` jump command.
- **Installer and Brewfile sync got modernized,** including a fix for a
  [pre-commit hook SIGPIPE bug](https://github.com/abtris/dotfiles/blob/master/git/.gittemplate/hooks/pre-commit)
  on large staged files. The installer now treats a target that already resolves
  to the source as linked instead of flagging a false conflict.

Everything below is the current state after those changes.

## Bootstrapping a new Mac

Setup is deliberately boring. Install [Homebrew](https://brew.sh/) and
[Oh My Zsh](https://ohmyz.sh/), clone the repo, and run the installer:

```sh
mkdir -p ~/bin && cd ~/bin
git clone https://github.com/abtris/dotfiles.git
cd dotfiles
[ "$(id -un)" = abtris ] && brewfile=Brewfile || brewfile=Brewfile.work
brew bundle --file "./$brewfile"
./install
```

Two decisions keep this manageable. First, packages are tracked as full
`Brewfile` snapshots, one for my home Mac and one for work. Each file is a
complete image of the machine, not a curated wishlist, so a fresh install
reproduces exactly what I had. An `update-brewfile` script picks the right file
based on the username and I review the diff before committing.

Second, `./install` only creates missing symlinks. It reports any existing file
as a conflict instead of overwriting it, so it never clobbers something I forgot
about. Safe to rerun any time.

## Terminal and shell

- **Terminal: [Ghostty](https://ghostty.org/).** The new terminal written in
  [Zig](https://ziglang.org/) by [Mitchell Hashimoto](https://mitchellh.com/ghostty).
  Fast, native, sensible defaults.
- **Multiplexer: [Herdr](https://herdr.dev/).** A terminal multiplexer built for
  driving coding agents across panes and workspaces.
- **Shell: still Zsh with [Oh My Zsh](https://ohmyz.sh/).** I keep asking myself
  whether Fish would buy me anything, and honestly [nushell](https://www.nushell.sh/)
  is the more interesting bet if I ever move. For now Zsh stays.
- **Prompt: [Starship](https://starship.rs/).** I switched from a hand-rolled
  `PS1`; the Kubernetes, Azure, and Go segments alone earn their keep. My config
  is [starship.toml](https://github.com/abtris/dotfiles/blob/master/starship.toml).

## The CLI tools I have swapped in

Most of these are drop-in replacements for the standard Unix tools, faster and
with better defaults:

- **[lsd](https://github.com/lsd-rs/lsd)** instead of `ls`.
- **[bat](https://github.com/sharkdp/bat)** instead of `cat`.
- **[ripgrep](https://github.com/BurntSushi/ripgrep)** (`rg`) instead of `grep`
  and `ack`.
- **[fzf](https://github.com/junegunn/fzf)** for fuzzy finding. I wire it into a
  small `j()` function that combines `find` and `fzf` to jump straight into a
  project directory.
- **[zoxide](https://github.com/ajeetdsouza/zoxide)** for a smarter `cd` that
  learns the directories I actually visit.
- **[atuin](https://github.com/atuinsh/atuin)** for shell history that is
  searchable and synced.
- **[dog](https://github.com/ogham/dog)** instead of `dig`.
- **[delta](https://github.com/dandavison/delta)** as the syntax-highlighting
  pager for `git`, `diff`, and `grep`.

For anything with a UI in the terminal:

- **[k9s](https://k9scli.io/)** for Kubernetes.
- **[mc](https://github.com/MidnightCommander/mc)** (Midnight Commander) when I
  want a file manager in the console.

## Dev environment

- **Runtime versions: [mise](https://mise.jdx.dev/)** (formerly rtx). This
  solved my long-standing annoyance of auto-switching the Python venv per
  project, the same thing rbenv and nvm do for their ecosystems, but universal
  across languages.
- **Source control: still plain Git** with a pile of
  [aliases](https://github.com/abtris/dotfiles/blob/master/bash/aliases) and a
  shared [config](https://github.com/abtris/dotfiles/blob/master/git/.gitconfig).
  I keep wanting to try something else, but GitHub keeps removing my reasons to
  switch. This year I did start experimenting with
  [Jujutsu (jj)](https://github.com/jj-vcs/jj) alongside Git; the jury is still
  out.
- **Editor: [VSCode](https://code.visualstudio.com/),** nothing exotic. The Go
  plugin for development, plus
  [FindItFaster](https://marketplace.visualstudio.com/items?itemName=TomRijndorp.find-it-faster)
  to get fzf-style search inside the editor.

## AI agents in the workflow

Coding agents are now part of the daily loop. I run [Claude Code](https://www.anthropic.com/claude-code)
and [pi](https://pi.dev/). I have [written before](/post/agent-harnesses/) about
why I would not bet a whole company on a single closed harness, and my personal
setup reflects that: keep the harness something you control, treat the model as
swappable.

The piece that makes agents reusable is skills, small packaged capabilities I
add to the harness with `npx skills add`. For example, Herdr ships
one:

```sh
npx skills add ogulcancelik/herdr --skill herdr -g
```

## Everything is Catppuccin

One small thing that makes the whole setup feel coherent: I use
[Catppuccin](https://github.com/catppuccin/catppuccin) as the color scheme
everywhere, the terminal, Starship, lsd, k9s, mc, all of it. It is a low-effort
way to make a dozen unrelated tools look like they belong together.

## Beyond the terminal

A few desktop tools round it out:

- **Knowledge base: [Logseq](https://logseq.com/),** synced over a private repo.
  I wrote a whole post on [how I use Logseq as a personal knowledge base](/post/how-i-use-logseq-as-a-personal-knowledge-base/).
- **Research and citations: [Zotero](https://www.zotero.org/).**
- **Passwords: [1Password](https://1password.com/).**
- **Launcher: [LaunchBar](https://www.obdev.at/products/launchbar/index.html).**
  [Raycast](https://www.raycast.com/) is probably the better choice today, but I
  have not felt enough pain to switch.
- **Window management: [Magnet](https://magnet.crowdcafe.com/).** I keep eyeing
  [yabai](https://github.com/koekeishiya/yabai) but have not made time to test it.

## Takeaways

- Track your packages as full machine snapshots, not a hand-curated list, so a
  fresh install actually reproduces your setup.
- Make your installer safe to rerun: create missing links, never overwrite.
- The modern CLI replacements (lsd, bat, ripgrep, fzf, zoxide, atuin, delta) are
  worth the muscle-memory change.
- Keep the AI harness under your control and the model swappable.
- One color scheme everywhere is a cheap way to make an ad-hoc toolkit feel
  designed.

The full configuration is at [abtris/dotfiles](https://github.com/abtris/dotfiles)
if you want to dig into the details.
