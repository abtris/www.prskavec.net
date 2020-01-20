---
layout: post
title:  "Day Four - Docker Machine"
date:   2015-12-04 11:00:00 +0100
---

Hi everyone,<br>
 if you install docker. I recommend install docker-machine. If you are using Mac or Windows you need virtualization for working with docker.
Docker machine (DM) created virtual machine for you and setup docker daemon there. This works for list of cloud services too.

First for local development at Mac, Windows or Linux. In linux you can use this but you don't need it.

```bash
docker-machine create --driver virtualbox <VM-name>
```

I'm using as `VM-name` name `dev`.

For manage more VM you can use `docker-machine ls`, you see all your VMs. For activate VM you have to use `eval "$(docker-machine env dev)"`

We use for active docker-machine these script that check if you have installed docker-machine, if exists and start them do you. You can have alias to script as `dkactivate` or `dsetup`.

```
#!/bin/sh

# Starts docker-machine VM called DEV if down, resets the environment variables

# Run this before using docker

which docker-machine > /dev/null 2>&1
if [ $? -eq 1 ]; then
  echo "docker-machine is not installed. Run docker-install-dockertoolbox first"
  exit 1
fi

NAME=$1

if [ ! $NAME ]; then
  echo "Please supply a VM name"
  exit 1
fi

docker-machine ls | grep $NAME > /dev/null 2>&1
if [ $? -eq 1 ]; then
  echo "$NAME VM not found. Create the VM first (e.g. run docker-machine create --driver virtualbox $NAME)"
  exit 1
fi

if [ `docker-machine status $NAME` != "running" ]; then
    docker-machine start $NAME
fi

echo "Running docker-machine env for the $NAME VM..."
eval "$(docker-machine env $NAME)"
```

This is local development, for example I use AWS for docker too. If you have account at AWS you can create new instances in EC2 for docker by this script. Just add your parameters.

```
#!/bin/sh
AWS_ACCESS_KEY_ID=`cat ~/.aws/credentials | grep aws_access_key_id | cut -d'=' -f2`
AWS_SECRET_ACCESS_KEY=`cat ~/.aws/credentials | grep aws_secret_access_key | cut -d'=' -f2`
INSTANCE_TYPE='m3.xlarge'
REGION='us-east-1'
NAME=$1
AWS_VPC_ID=$2
AWS_SUBNET_ID=$3

if [ ! $NAME == "" ]; then
  docker-machine create \
      -d amazonec2 \
      --amazonec2-access-key $AWS_ACCESS_KEY_ID \
      --amazonec2-secret-key $AWS_SECRET_ACCESS_KEY \
      --amazonec2-vpc-id $AWS_VPC_ID \
      --amazonec2-subnet-id $AWS_SUBNET_ID \
      --amazonec2-region $AWS_REGION \
      --amazonec2-zone c \
      --amazonec2-instance-type $INSTANCE_TYPE \
      $NAME-dev
else
  echo "Missing name"
fi
```

See you tomorrow,<br>
Ladislav
