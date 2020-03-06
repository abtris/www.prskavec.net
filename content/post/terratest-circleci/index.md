---

title: "Running Terratest in CircleCI"
subtitle: "How run Terratest in CircleCI"
summary: How using Terratest in CircleCI with docker in docker.
authors:
  - abtris
tags:
- circleci
categories: []
date: "2019-03-06T00:00:00Z"
lastmod: "2019-03-06T00:00:00Z"
featured: false
draft: false

image:
caption: ""
focal_point: ""
preview_only: false

projects: []

---

Running golang test on CircleCI is easy but if you need DIND (docker in docker) that is made by `setup_remote_docker` is all easy and you have something like this:

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/golang:1.13
    environment:
      TEST_RESULTS: /tmp/test-results
    steps:
      - checkout
      - setup_remote_docker
      - run: mkdir -p $TEST_RESULTS
      - restore_cache:
          keys:
            - v1-pkg-cache
      - run: go get gotest.tools/gotestsum
      - run: docker pull appropriate/curl
      - run: cd test && go mod download
      - run:
          name: Run unit tests
          command: |
            make test-unit
      - run: cp tmp/unit-report.xml /tmp/test-results/unit-report.xml
      - save_cache:
          key: v1-pkg-cache
          paths:
            - "/go/pkg"
      - store_artifacts:
          path: /tmp/test-results
          destination: raw-test-output
      - store_test_results:
          path: /tmp/test-results
```

But the issue is the network that is limit for security reasons and this helper will not work in DIND mode.

```go
// It can take a few seconds for the Docker container boot up, so retry a few times
maxRetries := 5
timeBetweenRetries := 2 * time.Second
url := fmt.Sprintf("http://localhost:%d", serverPort)

// Setup a TLS configuration to submit with the helper, a blank struct is acceptable
tlsConfig := tls.Config{}

// website::tag::5::Verify that we get back a 200 OK with the expected text
http_helper.HttpGetWithRetry(t, url, &tlsConfig, 200, expectedServerText, maxRetries, timeBetweenRetries)
```

you need to replace `http_helper` with docker container with curl:

```go
opts := &docker.RunOptions{
		Command:      []string{"--retry", "5", "--retry-connrefused", "-s", "http://production_nginx:80/hello"},
		OtherOptions: []string{"--network", "testdockercomposelocal_teststack-network"},
	}
tag = "appropriate/curl"
output := docker.Run(t, tag, opts)
assert.Equal(t, expectedServerText, output)
```

The main thing is to have the same network with docker-compose that I'm using in the application and this container with curl with correct network parameter.
