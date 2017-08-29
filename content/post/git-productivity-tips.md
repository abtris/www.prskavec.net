+++
author = "Ladislav Prskavec"
date = 2014-12-11T18:52:13Z
description = ""
draft = false
slug = "git-productivity-tips"
title = "Git productivity tips"

+++

I’m using git for 5 years. I have many aliases and commands for better work with git. I used git command still quite often. 

<!--more-->

	$ history | awk '{CMD[$2]++;count++;}END { for (a in CMD)print CMD[a] " " CMD[a]/count*100 "% " a;}' | grep -v "./" | column -c3 -s " " -t | sort -nr | nl |  head -n20
    
     1	2521  25.2125%   git
     2	776   7.76078%   gco
     3	582   5.82058%   ack
     4	482   4.82048%   heroku
     5	465   4.65047%   cd
     6	326   3.26033%   npm
     7	265   2.65027%   curl
     8	237   2.37024%   brew
     9	218   2.18022%   cat
    10	187   1.87019%   less
    11	175   1.75018%   grunt
    12	159   1.59016%   rm
    13	156   1.56016%   g
    14	125   1.25013%   gem
    15	113   1.13011%   mate
    16	84    0.840084%  e
    17	83    0.830083%  hk
    18	82    0.820082%  vim
    19	77    0.770077%  mkdir
    20	76    0.760076%  mv
    
But some good tips is make which git commands are used most.

	$ history | awk '{ print $2, $3 }' | grep -E '^git' | sort | uniq -c | sort -nr | head
    
    1250 git commit
     369 git push
     129 git add
     106 git clone
      72 git rebase
      60 git branch
      46 git diff
      46 git cherry-pick
      43 git remote
      37 git reset
      
I use [ZSH](http://ohmyz.sh/) and [git plugin](https://github.com/robbyrussell/oh-my-zsh/blob/master/plugins/git/git.plugin.zsh). But some good aliases missing. I use my function for `git checkout` and for example my command `last` show last used branches for easy switch between many branches in big projects.

	# List git aliases and functions
    function gco() {
        git checkout $1
    }

    function gc() {
        git commit -v
    }

    alias ga='git add'
    alias g='git status -sb'
    alias m='git checkout master'
    alias gl='git pull --ff'
    alias glup='git pull upstream master'
    alias gp='git push'
    alias b='git branch -avv'
    alias bl='git branch -v'
    alias last="git for-each-ref --sort=-committerdate refs/heads/ | head | cut -d ' ' -f 2 | cut -c 19-"

This was part of my aliases. Some good tips you can find in [GitHub Cheat Sheet](https://github.com/tiimgreen/github-cheat-sheet).