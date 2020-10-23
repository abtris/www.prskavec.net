---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "The Future of Continuous Integration Engines"
subtitle: "What you need from your next CI?"
summary: "Continuous Integration Engines (CIEs) have a long history. The term Continuous Integration (CI) has been used for the first time by Grady Booch in 1991."
authors: ['abtris']
tags: ['cie']
categories: []
date: 2020-10-23T20:02:34+02:00
lastmod: 2020-10-23T20:02:34+02:00
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

> Thanks to Daria Grudzien for correction and comments.

Continuous Integration Engines (CIEs) have a long history. The term Continuous Integration (CI) has been used for the first time by Grady Booch in 1991. Personally I started using CruiseControl (launched in 2001) around 2003. After 2005 Java programmers switched from CruseControl to Hudson. Few years later phpUnderControl (2007) became  a popular tool, and later on Hudson gave way to Jenkins (released in 2011). These days Jenkins is being  replaced by JenkinsX (2017). Many other CIEs have been developed in the  meantime:  Teamcity (2006), Bamboo (2008), as well as other commercial versions and cloud first CIEs like Travis (2011) , CircleCI (2016) and Github Actions (2018).

Nowadays we have a wide range of CIEs  available on every platform, which solve a variety of problems. To help select the best one for the job, in 2019 I wrote a post ["What you need from your CI"](https://blog.apiary.io/What-you-need-from-your-CI) which is still valid.

Today I’d like to introduce a new question— what is the future of CIE and what we can expect as developers and customers of CIE software.

## Modularity

These days modularity is key. Architectural changes introduced by tools like JenkinsX (2017) and [Tekton pipelines (2018)](https://tekton.dev/) help in designing new CIEs with that feature in mind. Such an approach allows developers to easily change the language describing workflows by replacing modules which translate workflow description to [Tekton CRDs](https://tekton.dev/docs/pipelines/) (Custom Resource Definition). I like that approach and believe that the teams behind Tekton and JenkinsX are doing great work on increasing flexibility of workflow development.

## Flexibility

Flexibility is the second consideration. I don’t think that all CIEs have to be running on Kubernetes. Good alternatives are [HashiCorp Nomad](https://www.nomadproject.io/),the simplest platform like AWS Lambda and [LambdaCI](https://github.com/lambci/lambci) or simply  a local computer. Portable software which can be easily run anywhere can be very useful. This still gives space to different CIEs and can be  a major differentiator among them.

## Language

This approach isn’t available among the existing tooling,  but it would be nice to have a de facto standard for describing workflows for CIE. Thanks to the  modular every CI can support such a standard workflow description,  making switching CIEs for projects would become  easy. Currently Yaml format is the king - it’s used by Travis, CircleCI, Github Actions among others. But I hope that we will find a better approach like HCL (HashiCorp Configuration Language) which is more of a language than a serialization format ([noyaml.com](https://noyaml.com)).

## Observability

It’s very hard to make any good decisions without sufficient data. Something I see quite often is a lack of good solutions for handling  builds, failing tests, flaky tests etc. For applications we have [open metrics](https://openmetrics.io), Prometheus is commonly supported by many libraries and applications. An open format like this is missing in CIEs and  it would be great to fill those gaps.

## Scalability

Speed, reliability and cost  are all relevant from the perspective of scalability. In the current price model you often pay for VMs which is cons ineffective for teams collocated in one timezone. If you have a  “follow the sun” model and  similar resource usage across workdays — what about weekends? Many large companies have their own CIE, but often it’s run on dedicated hardware which doesn’t scale up  with the number of developers or tasks in the queue.

It’s possible to keep the same spending level while improving developer experience by scaling the CI up and down depending on current usage. If you discover that your usage pick lasts for 4-5 hours a day—you can scale down the number of instances running CI outside of those hours. But don’t forget that running builds in parallel needs to be fast by default.


## Bringing It All Together

There are multiple CIEs available in the market today addressing some of the considerations I listed above. Do you know of a Continuous Integration Engine which addresses all those, or do still we have gaps in the market? Is there space for someone to make a significant impact on the market?

