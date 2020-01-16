---
layout: post
title:  "Day Nineteen - Docker and AWS ECS"
date:   2015-12-19 11:00:00 +0100
---

Hi everyone,<br>
Amazon Web Services (AWS) is biggest cloud provider and you can use docker with Elastic Compute Cloud (EC2), use Amazon EC2 Container Service (ECS) or AWS Elastic Beanstalk. [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) is very similar to Heroku. It's Platform as a Service (PaaS).

I write post about ECS. ECS is new service exists two years. You have to use your EC2 instances to provide cluster. No price for service itself only for resources (EC2, ELB, EBS).

This year [Amazon ECS CLI](https://github.com/aws/amazon-ecs-cli) introduce support for `docker-compose.yml`.

I use this command to create task definition for ECS using this command:

```
AWS_REGION=us-east-1 ecs-cli compose create
```

this is example `docker-compose.yml` for docker registry:

```
backend:
  image: registry
  cpu_shares: 400
  mem_limit: 314572800
  ports:
    - 5000:5000
  environment:
    AWS_BUCKET: <DOCKER-REGISTRY-BUCKET>
    AWS_ENCRYPT: 'False'
    AWS_KEY: <AWS-KEY>
    AWS_REGION: us-east-1
    AWS_SECRET: <AWS-SECRET>
    AWS_SECURE: 'False'
    AWS_USE_SIGV4: 'False'
    SETTINGS_FLAVOR: prod
    SEARCH_BACKEND: sqlalchemy
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: 'Auth Internal Registry'
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
```

For running cluster you need [setup instances](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_container_instance.html) and register these instances into cluster. You can use [ecs.config](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html#ecs-config-s3) in user data to setup instance.

```
#!/bin/bash
yum install -y aws-cli
aws s3 cp s3://<BUCKET-NAME>/ecs.config /etc/ecs/ecs.config
echo ECS_CLUSTER=<CLUSTER-NAME> >> /etc/ecs/ecs.config
```

You can run task or service in ECS. If you need task as cron you can use lambda for setup [scheduling task](http://stackoverflow.com/questions/27382009/aws-lambda-scheduled-tasks).

```js
var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var ecs = new AWS.ECS();

const MAX_RESULTS = 100;

function runTask(taskDefinitionArn, clusterName, numberOfTasks) {
  var params = {
    taskDefinition: taskDefinitionArn, /* required */
    cluster: clusterName,
    count: numberOfTasks,
    overrides: null,
    startedBy: 'nodejs-script'
  };
  ecs.runTask(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.handler = function(event, context) {
  context.succeed(runTask('<TASK-NAME>', '<CLUSTER-NAME>', 1));
};
```

If you can run service it's similar but service is still alive. You can combine ECS with [Marathon](https://mesosphere.github.io/marathon/) or [Chronos](http://mesos.github.io/chronos/).

See you tomorrow,<br>
Ladislav
