+++
author = "Ladislav Prskavec"
categories = ["mac", "howto"]
date = 2014-11-02T13:01:45Z
description = ""
draft = false
slug = "dnsmasq-in-mac-os-x-10-10-yosemite"
tags = ["mac", "howto"]
title = "DNSmasq in Mac OS X 10.10 Yosemite"

+++

I use dnsmasq at mac to setup all development sites using address as `something.dev`

<!--more-->

## Install

If you have new computer, only install dnsmasq.

	brew install dnsmasq
    
If you have older computer and upgrade from maverics. You have installed dnsmasq some time ago. Please, first remove dnsmasq and install them again. In Yosemite are some [changes in plist for running services](https://github.com/Homebrew/homebrew/issues/31357).

	brew uninstall dnsmasq
    brew install dnsmasq
    
For Yosemite is good have latest [LauchRocket](https://github.com/jimbojsb/launchrocket). I'm using [brew cask](https://github.com/caskroom/homebrew-cask) for installing and updating.

	brew cask install launchrocket
   
![](/content/images/2014/Nov/LaunchRocket-System-Preferences--Today-at-14-07-47.png)
   
## Configure 

Now, you have to setup config file `/usr/local/etc/dnsmasq.conf` and write into file these lines:

    server=/dev/127.0.0.1
    address=/.dev/127.0.0.1
    listen-address=127.0.0.1
    
For restart, you can use LaunchRocket. I'm testing dnsmasq via `dig`

	$ dig something.dev @localhost
    
    ; <<>> DiG 9.8.3-P1 <<>> something.dev @localhost
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14018
    ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;something.dev.			IN	A

    ;; ANSWER SECTION:
    something.dev.		0	IN	A	127.0.0.1

    ;; Query time: 0 msec
    ;; SERVER: 127.0.0.1#53(127.0.0.1)
    ;; WHEN: Sun Nov  2 13:59:41 2014
    ;; MSG SIZE  rcvd: 47
    
## Conclusion

I hope, dnsmasq works good as in Maverics, now! 