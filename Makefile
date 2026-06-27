# https://suva.sh/posts/well-documented-makefiles/#simple-makefile
.DEFAULT_GOAL:=help
SHELL:=/bin/bash

TITLE := $(shell echo $(name) | tr [:upper:] [:lower:] | sed -e 's/ /_/g')

.PHONY: help deps clean build watch css css-watch test test-headed test-ci test-report

help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

deps: ## Install JS dependencies (Tailwind, Playwright)
	npm install

css: deps ## Compile Tailwind CSS (one-shot, minified)
	npm run css

css-watch: ## Compile Tailwind CSS in watch mode
	npm run css:watch

build: css ## Build the project (compiles CSS, then Hugo)
	hugo

watch: ## Watch file changes and build (run `make css-watch` in another tab)
	hugo server -w

post: ## Make new post: make post name="Title"
	hugo new  --kind post post/$(TITLE)

test: ## Run Playwright e2e tests locally (starts Hugo automatically)
	npx playwright test

test-headed: ## Run Playwright tests locally in headed mode (visible browser)
	npx playwright test --headed

test-ci: ## Run Playwright e2e tests against production
	BASE_URL=https://www.prskavec.net npx playwright test

test-report: ## Open the last Playwright HTML report
	npx playwright show-report
