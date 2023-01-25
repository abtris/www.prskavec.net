---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Watch out for basic HTTP client settings in Go"
subtitle: ""
summary: "Most programming languages don't have basic settings for HTTP made to run in production."
authors: ["abtris"]
tags: ["go"]
categories: []
date: 2023-01-25T13:55:01+01:00
lastmod: 2023-01-25T13:55:01+01:00
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

Many articles have been written about this problem, but I keep seeing this problem coming back over and over again. Most programming languages don't have basic settings for HTTP made to run in production. We'll demonstrate this with the example of Go, but other languages are often similar, sometimes better, sometimes worse.

If you take a standard library, and you want to make a request, it will come out something like this.

```go
func main() {
 url := "http://localhost:3000"
 var httpClient = &http.Client{}
 response, _ := httpClient.Get(url)
 fmt.Println(response)
}
```

All the HTTP client settings are given by [default transport](https://go.dev/src/net/http/transport.go).

```go
var DefaultTransport RoundTripper = &Transport{
 Proxy: ProxyFromEnvironment,
 DialContext: defaultTransportDialContext(&net.Dialer{
  Timeout:   30 * time.Second,
  KeepAlive: 30 * time.Second,
 }),
 ForceAttemptHTTP2:     true,
 MaxIdleConns:          100,
 IdleConnTimeout:       90 * time.Second,
 TLSHandshakeTimeout:   10 * time.Second,
 ExpectContinueTimeout: 1 * time.Second,
}
```

Your HTTP client will behave according to that basic setup. All the timeouts are defined, and you can't simply hit that client later.

If you want to tweak it, if you need to touch the base timeout, you can set it like this:

```go
func main() {
 url := "http://localhost:3000"
 var httpClient = &http.Client{
  Timeout: time.Second * 10,
 }
 response, _ := httpClient.Get(url)
 fmt.Println(response)
}
```

This will override the 30s timeout to 10s which is about the maximum value I would accept for a synchronous POST request, although it's well beyond what I'm willing to expect as a user.

The way to keep things under control is to have a custom client where we overload the transport and use custom settings.

```go
type HTTPClientSettings struct {
 Connect          time.Duration
 ConnKeepAlive    time.Duration
 ExpectContinue   time.Duration
 IdleConn         time.Duration
 MaxAllIdleConns  int
 MaxHostIdleConns int
 ResponseHeader   time.Duration
 TLSHandshake     time.Duration
}

func NewHTTPClientWithSettings(httpSettings HTTPClientSettings) (*http.Client, error) {
 var client http.Client
 tr := &http.Transport{
  ResponseHeaderTimeout: httpSettings.ResponseHeader,
  Proxy:                 http.ProxyFromEnvironment,
  DialContext: (&net.Dialer{
   KeepAlive: httpSettings.ConnKeepAlive,
   DualStack: true,
   Timeout:   httpSettings.Connect,
  }).DialContext,
  MaxIdleConns:          httpSettings.MaxAllIdleConns,
  IdleConnTimeout:       httpSettings.IdleConn,
  TLSHandshakeTimeout:   httpSettings.TLSHandshake,
  MaxIdleConnsPerHost:   httpSettings.MaxHostIdleConns,
  ExpectContinueTimeout: httpSettings.ExpectContinue,
 }

 // So client makes HTTP/2 requests
 err := http2.ConfigureTransport(tr)
 if err != nil {
  return &client, err
 }
```

If we have custom settings, then the usage is similar, just directly specifying the individual parameters.

```go
func main() {
 url := "http://localhost:3000"

 httpClient, err := NewHTTPClientWithSettings(HTTPClientSettings{
  Connect:          5 * time.Second,
  ExpectContinue:   1 * time.Second,
  IdleConn:         90 * time.Second,
  ConnKeepAlive:    30 * time.Second,
  MaxAllIdleConns:  100,
  MaxHostIdleConns: 10,
  ResponseHeader:   5 * time.Second,
  TLSHandshake:     5 * time.Second,
 })
 if err != nil {
  fmt.Println("Got an error creating custom HTTP client:")
  fmt.Println(err)
  return
 }

 response, _ := httpClient.Get(url)
 fmt.Println(response)
}
```

This is a good solution, but it still needs to solve everything. Sometimes we would like a different timeout or deadline for a specific case (PUT, POST), and we want to keep the HTTP client the same. This can be achieved with `context.WithTimeout` or `context.WithCancel` context. The usage is then seen in the following example.

```go
func main() {
 url := "http://localhost:3000"

 req, err := http.NewRequest(http.MethodGet, url, nil)
 if err != nil {
  log.Fatal(err)
 }

 ctx, cancel := context.WithCancel(context.Background())
 _ = time.AfterFunc(1*time.Second, func() { cancel() })

 httpClient, err := NewHTTPClientWithSettings(HTTPClientSettings{
  Connect:          5 * time.Second,
  ExpectContinue:   1 * time.Second,
  IdleConn:         90 * time.Second,
  ConnKeepAlive:    30 * time.Second,
  MaxAllIdleConns:  100,
  MaxHostIdleConns: 10,
  ResponseHeader:   5 * time.Second,
  TLSHandshake:     5 * time.Second,
 })
 if err != nil {
  fmt.Println("Got an error creating custom HTTP client:")
  fmt.Println(err)
  log.Fatal(err)
 }

 response, _ := httpClient.Do(req.WithContext(ctx))
 fmt.Println(response)
}
```

Still, it can happen that you are not on the client but on the server side, and you can't solve it entirely well. That's why in Go 1.20, they added [`ResponseController`](https://pkg.go.dev/net/http@go1.20rc2#ResponseController) where you get access to these methods:

```go
Flush()
FlushError() error // alternative Flush returning an error
Hijack() (net.Conn, *bufio.ReadWriter, error)
SetReadDeadline(deadline time.Time) error
SetWriteDeadline(deadline time.Time) error
```

Here you can, for example, extend the request deadline if you need it. Find the complete [discussion of timeout handling in Handler on GitHub](https://github.com/golang/go/issues/16100).

So remember to set up HTTP clients for production, test performance, measure latency and adjust your settings accordingly. It's good to know your limits and adjust accordingly. Please keep it to the basic settings in production. It can cause annoying errors that are hard to detect because they often look like random errors.

If you're interested in this, come and talk about Go and release 1.20 at [the next Prague Go Meetup on February 21](https://www.meetup.com/prague-golang-meetup/events/291042846/).
