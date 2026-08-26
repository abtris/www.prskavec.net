---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Merge queues, and the API GitHub only exposes over GraphQL"
subtitle: ""
summary: "What a merge queue actually does, how GitHub's version is configured, where the richer tools go further, and why writing a terminal dashboard for it meant giving up on REST entirely."
authors: ["abtris"]
tags: ["go", "github", "graphql", "ci"]
categories: []
date: 2026-08-26T09:00:00+02:00
lastmod: 2026-08-26T09:00:00+02:00
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

Every team that merges more than a handful of pull requests a day eventually hits the same failure: two pull requests are both green, both get merged, and the main branch goes red. Neither author did anything wrong. One renamed a function, the other added a caller for it, and nothing ever tested the two changes together.

That is a semantic conflict, and git will not catch it. Git merges text. It has no opinion about whether the result compiles.

## What a merge queue does

A merge queue closes the gap by refusing to trust a check run against a stale base. Instead of merging your branch as it was tested, it builds a *merge group*: your changes on top of the current main branch, plus everything already queued ahead of you. Then it runs CI against that. Only if the group passes does anything land.

The queue is the serialisation point. It means the tested state and the merged state are the same state, which is the whole point. It also means merging stops being instant: you join a line, and how long you wait depends on how many people are ahead of you and how slow CI is.

## How GitHub's version works

GitHub's merge queue went generally available in 2023 and is configured through branch protection rules, or now rulesets, on the target branch. Once it is on, the merge button changes: you no longer merge, you enqueue.

Your CI has to opt in, because merge groups are not pull requests. GitHub dispatches a `merge_group` event, and a workflow that only triggers on `pull_request` will never run against the group at all. The queue then sits there waiting for a check that is never coming, which is the first thing most people get wrong.

The settings worth knowing about, all from the [merge queue docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue):

- **Merge method**: merge, rebase or squash.
- **Minimum and maximum pull requests to merge**, between 1 and 100, plus a timeout for how long to wait for the minimum before giving up and merging a smaller group. This is batching: test five pull requests as one group and you run CI once instead of five times.
- **Build concurrency**: the maximum number of `merge_group` webhooks in flight, between 1 and 100. Turn this down when the queue starts saturating your runners.
- **Status check timeout**: how long to wait for CI before treating silence as failure.
- **Only merge non-failing pull requests**: whether every pull request in the group has to pass on its own, or whether the group can go in if the final one passes.

Entries leave the queue when checks fail, when the timeout expires, when someone removes them by hand, or when a branch protection conflict appears that GitHub cannot resolve.

## Where the other tools go further

GitHub's queue is fine, and it is free and already there. The dedicated tools are mostly better at one thing: what happens when a batch fails.

[Mergify](https://docs.mergify.com/merge-queue/batches/) bisects. A failed batch is split into smaller batches and re-tested until the offending pull request is isolated on its own, and only that one is removed. Everything else stays in line. Batches are also grouped by similarity rather than strict arrival order, first by scope, then by changed directory, then by queue time, with priority overriding all of it and stacked pull requests kept together. There are partitioned queues too, so a docs change is not stuck behind a database migration.

[Graphite](https://graphite.com/guides/merge-queue-tools-options) comes at it from the stacked-diff side: it understands that a stack of dependent pull requests is one unit, runs CI for the whole stack in parallel, and lands it as a single fast-forward.

Both are paid services, and worth pricing out only once you can point at the hours the native queue is costing you. If your batches rarely fail, GitHub's is enough and the rest is a subscription for a problem you do not have.

## The problem I actually had

None of the above is visible from a terminal. The specific thing that kept happening: a pull request goes into the queue, sits there for the better part of an hour, reaches the front, and only then gets thrown out as unmergeable. An hour of waiting to learn something the API knew the whole time.

Worse, the obvious response is frequently the wrong one. "Unmergeable" has two entirely different causes and GitHub renders them identically:

- the branch genuinely conflicts with the base branch, and a rebase fixes it;
- the branch is clean against the base, and the conflict is with something ahead of it *inside the merge group*. Rebasing accomplishes nothing here. The only fix is waiting for the entries in front to land.

So I wrote [mqw](https://github.com/abtris/mqw), a small Go terminal dashboard: the queue for a base branch in one pane, my open pull requests and the reason each can or cannot go in the other, enter to enqueue, `d` to dequeue.

## Why it all goes through GraphQL

Then I went looking for the REST endpoint that lists a merge queue, and there isn't one. REST will happily tell you about pull requests, checks, branches and rulesets. Merge queue entries are not there. The `MergeQueue` and `MergeQueueEntry` types exist only in the GraphQL schema, so every call in mqw goes through `gh api graphql`. That is not a design preference, it is the only door.

The query for the queue itself:

```graphql
query($owner:String!,$name:String!,$branch:String!){
  repository(owner:$owner,name:$name){
    mergeQueue(branch:$branch){
      entries(first:20){
        nodes{
          position
          state
          enqueuedAt
          estimatedTimeToMerge
          enqueuer{ login }
          pullRequest{ ... }
        }
      }
    }
  }
}
```

`position` and `estimatedTimeToMerge` are the two fields that make the tool worth running. They are how you find out you have forty minutes to wait before you go and make coffee. `enqueuer` is separate from the pull request author on purpose: somebody else can put your pull request in the queue.

Having been forced into GraphQL, the thing I did not expect is that it turns out better for this problem than REST would have been. A pull request has to be described identically whether it arrives through the queue or through a search, so the selection set is a Go constant that both queries interpolate:

```go
const prFields = `
  id
  number
  title
  state
  isDraft
  merged
  mergeable
  reviewDecision
  headRefName
  baseRefName
  author{ login __typename }
  mergeQueueEntry{ state position estimatedTimeToMerge }
  files(first:100){ totalCount nodes{ path } }
  labels(first:20){ nodes{ name } }
  commits(last:1){ nodes{ commit{ statusCheckRollup{ state } } } }`
```

Over REST, filling that struct means a request for the pull request, another for its files, another for the check rollup, another for labels, and the merge queue state is unavailable at any price. Here it is one round trip, and I picked the fields.

## The one query that pays for itself

The payoff is the ambiguity from earlier. Telling the two kinds of "unmergeable" apart needs two facts at once: the queue entry's `state`, and the pull request's own `mergeable` against the base branch. Both are in the response above, so the classification is a switch with no extra call behind it:

```go
if e.State == "UNMERGEABLE" {
	switch p.Mergeable {
	case "CONFLICTING":
		// genuinely conflicts with the base
		return status{headline: "unmergeable: conflicts with " + p.BaseRefName,
			detail: "dequeue, rebase " + p.HeadRefName + ", re-queue"}
	case "MERGEABLE":
		// clean against the base: the merge group is the problem
		return status{headline: "unmergeable inside the merge group",
			detail: "clean against " + p.BaseRefName + ", so rebasing will not help"}
	default:
		// UNKNOWN: GitHub has not computed it yet. Guessing here would be worse
		// than admitting it.
		return status{headline: "unmergeable, cause not yet known"}
	}
}
```

That third branch matters more than it looks. `mergeable` is `UNKNOWN` until GitHub finishes computing the merge, which takes a moment after any push. Collapsing `UNKNOWN` into either of the other two produces confident advice that is wrong about half the time, and confident wrong advice is worse than a tool that says it does not know yet.

## Mutations, and one sharp edge

Enqueueing and dequeueing are mutations, and they are not symmetric:

```graphql
mutation($id:ID!){ enqueuePullRequest(input:{pullRequestId:$id}){ mergeQueueEntry{ position state } } }
mutation($id:ID!){ dequeuePullRequest(input:{id:$id}){ mergeQueueEntry{ id } } }
```

`enqueuePullRequest` takes `pullRequestId`. `dequeuePullRequest` takes `id`, and it is still the pull request's ID, not the entry's. Passing the wrong node ID gets you a type error from the API rather than anything explanatory, which cost me a while.

## Delegating auth to gh

Every request shells out to `gh api graphql` rather than opening an HTTP client. No token storage, no refresh, no device flow, no `Authorization` header to get wrong. `gh` is already installed and already authenticated, and the whole transport is thirty lines.

The catch is that `gh` has global mutable state. A `gh auth switch` in another terminal silently reaches into a running dashboard, and the symptom is unhelpful: the pull request pane goes empty, because a repository you cannot see returns an *empty search result* rather than an error, while only the queue query reports `NOT_FOUND`. Half the screen quietly lies to you.

The fix is to resolve one account's token once at startup and pass it to every child process, since `gh` prefers `GH_TOKEN` over whichever account happens to be active:

```go
func ghCommand(args ...string) *exec.Cmd {
	cmd := execCommand("gh", args...)
	if ghToken != "" {
		cmd.Env = append(cmd.Environ(), "GH_TOKEN="+ghToken)
	}
	return cmd
}
```

Pinning the account per checkout via a `.mqw.toml` is what makes a work account and a personal account coexist without either one breaking the other.

## Being honest about the edges

Two limits are worth surfacing rather than hiding, because a dashboard that quietly rounds off is worse than no dashboard.

`files(first:100)` caps the file list. mqw uses it to warn that a candidate pull request shares files with something already queued, which is a *hint* and nothing more: touching the same file is not a conflict, and touching none does not rule one out, because merge groups also fail on checks. So the code tracks `totalCount` against the number of nodes returned and knows when an empty overlap result is untrustworthy.

The pull request search is paginated and capped at four pages. When the cap is hit, the UI says so instead of pretending that is the whole repository.

## Try it

```
brew install abtris/tap/mqw
```

Source and README at [github.com/abtris/mqw](https://github.com/abtris/mqw). It needs `gh` installed and logged in, and a base branch with a merge queue configured.

I went in annoyed that REST was not an option, and came out thinking GitHub put the merge queue in the graph API because that is the shape the thing has. An entry means nothing on its own. It means something next to the pull request it points at, the commit that points at, and the checks hanging off that, and a dashboard needs all four at the same instant or it will tell you to rebase when rebasing cannot help. Fetching that over REST would have been the bulk of the program. The entire query layer, both queries, both mutations and every type they decode into, is 400 lines.
