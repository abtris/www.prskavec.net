[![Netlify Status](https://api.netlify.com/api/v1/badges/2eab6ac9-90ed-4aa9-9e25-7b2674743f43/deploy-status)](https://app.netlify.com/sites/house-keeper-proficiencies-68654/deploys)

# Blog - www.prskavec.net

- using [Hugo](https://gohugo.io/)
- using [Academia](https://gethugothemes.com/products/academia/) theme


# Add new blog post

- `make post name=TITLE`

# Testing

The site has end-to-end tests written with [Playwright](https://playwright.dev/) that run against the live production site (`https://www.prskavec.net`).

## Prerequisites

```bash
npm install
npx playwright install --with-deps chromium firefox
```

## Run tests locally

| Command | Description |
|---|---|
| `make test` | Run all tests headlessly (same as CI) |
| `make test-headed` | Run with a visible browser window |
| `make test-report` | Open the HTML report from the last run |

## What is tested

**Smoke tests** (`tests/smoke.spec.ts`) — run on Chromium, Firefox, and mobile Chrome:
- Homepage: title, navbar links, about / posts / talks / contact sections
- No leftover placeholder copy (e.g. "MY FANS…")
- Posts archive: list renders, links navigate
- Talks archive: list renders, heading does not say "Upcoming"
- OnCall Guide: index loads, chapter pages have content, tools page has the "Last updated" note and comparison table

**Algolia search tests** (`tests/search.spec.ts`):
- Search icon visible in navbar
- Clicking the icon opens the search overlay
- `instantsearch.js` injects an input into `#search-box`
- Typing a query fetches real results from Algolia and hit cards appear
- Hit cards contain clickable links
- Clearing the query hides the results container
- A no-match query shows the "no results" message
- The `×` button closes the overlay

## CI

The workflow in `.github/workflows/playwright.yml` triggers automatically:

1. **After** the `Build index` workflow completes on `master` — so tests run on freshly deployed production
2. **Daily at 06:00 UTC** — catches regressions between deploys
3. **Manually** via `workflow_dispatch` in the GitHub Actions UI

A full HTML report is uploaded as a workflow artifact and kept for 14 days.

# FAQ

Q - Getting error on Netlify: `Transformation failed: TOCSS: failed to transform "main_parsed.scss"`
A  - Workaround https://github.com/netlify/build-image/issues/183#issuecomment-554689821
