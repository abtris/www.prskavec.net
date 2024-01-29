---
title: Postmortems
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  how-to-make-oncall:
    parent: Intro
    weight: 13

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 17
---

Postmortems are necessary for learning and should be held whenever an incident occurs [^1]. You can determine if you need every incident in some short description or skip it for low-severity ones. You must always be sure that nobody is pointing fingers and the whole process is blameless.

> Best Practice: Avoid Blame and Keep It Constructive [^Boy13]
> Blameless postmortems can be challenging to write, because the postmortem format clearly identifies the actions that led to the incident. Removing blame from a postmortem gives people the confidence to escalate issues without fear. It is also important not to stigmatize frequent production of postmortems by a person or team. An atmosphere of blame risks creating a culture in which incidents and issues are swept under the rug, leading to greater risk for the organization

Another important thing is data [^2]. Your investigation has to focus on hypotheses and analyze data using [scientific method](https://en.wikipedia.org/wiki/Scientific_method). Finding the Root Cause is always challenging.

We can continue how to set up the postmortem process [^3], and inspire there from the best.


## Root Cause Analysis Methods

* [Open Incident database](https://www.thevoid.community/database)

### Five Ps

* https://cloudpundit.com/2021/10/28/five-p-factors-for-root-cause-analysis/

The Five Ps (described in IT terms) — well, really six Ps, a problem and five P factors — are as follows:
* The **presenting problem**is not only the core impact, but also its broader consequences, which all should be examined and addressed. For instance, “The FizzBots service was down” becomes “Our network was unstable, resulting in  FizzBots service failure. Our call center was overwhelmed, our customers are mad at us, and we need to pay out on our SLAs.”
* The **precipitating factors**are the things that triggered the incident. There might not be a single trigger, and the trigger might not be a one-time event (i.e. it could be a rising issue that eventually crossed a threshold, such as exhaustion of a connection pool or running out of server capacity). For example, “A network engineer made a typo in a router configuration.”
* The **perpetuating factors**are the things that resulted in the incident continuing (or becoming worse), once triggered. For instance, “When the network was down, application components queued requests, ran out of memory, crashed, and had to be manually recovered.”
* The **predisposing factors**are the long-standing things that made it more likely that a bad situation would result. For instance, “We do not have automation that checks for bad configurations and prevents their propagation.” or “We are running outdated software on our load-balancers that contains a known bug that results in sometimes sending requests to unresponsive backends.”
* The **protective factors**are things that helped to limit the impact and scope (essentially, your resilience mechanisms). For instance, “We have automation that detected the problem and reverted the configuration change, so the network outage duration was brief.”
* The **present factors**are other factors that were relevant to the outcome (including “where we got lucky”). For instance, “A new version of an application component had just been pushed shortly before the network outage, complicating problem diagnosis,” or “The incident began at noon, when much of the ops team was out having lunch, delaying response.”

### 5 why’s
* [Five why’s - Wikipedia](https://en.wikipedia.org/wiki/Five_whys)
* [Ishikawa diagram - Wikipedia](https://en.wikipedia.org/wiki/Ishikawa_diagram)
* [Using a Fishbone (or Ishikawa) Diagram to Perform 5-why Analysis | K Bulsuk: Full Speed Ahead](https://www.bulsuk.com/2009/08/using-fishbone-diagram-to-perform-5-why.html) 

* 5 Why - The Five Why’s is still considered as a best practice by many teams and is a common way to run the root-cause analysis process.The idea here is to ask “why” in succession, going deeper and uncovering more information each time. - https://newsletter.pragmaticengineer.com/p/incident-review-best-practices
  * The framework is very easy to get started, when teams don’t do much digging into incidents. However, as Andrew Hatch at LinkedIn shares in the talk  [Learning More from Complex systems](https://www.usenix.org/conference/srecon21/presentation/hatch) , there are risks to relying on the Five Whys:

> *The danger of the Five Whys is how, by following it, we might miss out on other root causes of the incident. (...)***We’re not broadening our understanding.***We’re just trying to narrow down on one thing, fix it, and hope that this will make the incident not happen again.*

* http://www.kitchensoap.com/wp-content/uploads/2014/09/Velocity2014-PM-Fac-Handout-Debrief.pdf


### PDCA
* [Root Cause Analysis, Ishikawa Diagrams and the 5 Why’s](https://www.isixsigma.com/tools-templates/cause-effect/root-cause-analysis-ishikawa-diagrams-and-the-5-whys/)
* 
* The scientific method can be integrated into RCA by using cycles of  [PDCA](https://www.isixsigma.com/methodology/plan-do-check-act/six-sigma-pdca-steroids/) . The planning phases consist of describing the problem, collecting data and forming a hypothesis.
* **P**: Whether freshly formed or taken from an Ishikawa diagram, the hypothesis should make some form of prediction (or *plan*), such as “measurement deviation” predicting “parts will be measured out of specification.”
* **D**: The next step is *do* – where the hypothesis is evaluated. This could be as simple as measuring a part or as elaborate as designing a new type of test method.
* **C**: The *check* phase is where the results are evaluated and conclusions are formed.
* **A**: *Act* is where the conclusions are acted upon. A hypothesis may be rejected or modified based on new evidence or the results of the testing, or a plan may be created to confirm a supported hypothesis.


### 6 Sigma
* [Six Sigma: PDCA on Steroids?](https://www.isixsigma.com/methodology/plan-do-check-act/six-sigma-pdca-steroids/)

### Untools
* [Ishikawa Diagram | Untools](https://untools.co/ishikawa-diagram)


[^1]: <https://sre.google/sre-book/postmortem-culture/>
[^2]: https://www.jeli.io/blog/what-kind-of-data-can-you-use-and-should-you-use-for-an-investigation
[^3]: https://www.jeli.io/howie/welcome
[^Boy13]: P. G. Boysen, ["Just Culture: A Foundation for Balanced Accountability and Patient Safety"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3776518/), in The Ochsner Journal, Fall 2013.
