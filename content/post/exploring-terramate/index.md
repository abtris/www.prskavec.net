---
# Documentation: https://sourcethemes.com/academic/docs/managing-content/

title: "Exploring Terramate - A Solution to Terraform Orchestration Challenges"
subtitle: ""
summary: "Terramate complements Terraform with structure and tooling for managing multiple Terraform stacks, environments, and configurations. It targets the pain points of large-scale Terraform: dependency management, stack management, and environment differentiation."
authors: ["abtris"]
tags: ["terraform"]
categories: []
date: 2024-03-10T12:22:10+01:00
lastmod: 2024-03-10T12:22:10+01:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: "smart"
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Terraform by HashiCorp has become a leading tool for defining and provisioning infrastructure as code. Its declarative configuration language lets developers and operations teams manage infrastructure precisely. But as projects grow in size and complexity, you run into orchestration, state management, and configuration spread across many environments. Terramate is built to help with exactly those problems.

![](./featured.jpeg)

## What Terramate does

[Terramate](https://terramate.io/docs/cli/introduction#what-is-terramate-cli) complements Terraform with extra structure and tooling for managing multiple stacks, environments, and configurations. It targets the pain points of large-scale Terraform deployments: dependency management, stack management, and environment differentiation.

## Key features

1. **Stack management:** Terramate organizes Terraform configurations into stacks, which makes complex infrastructure easier to manage. The hierarchy lets teams handle parts of their infrastructure in a more modular way. 

2. **Orchestration:** Terramate can define and manage dependencies between stacks, so components deploy in the right order, a common problem in multi-stack projects. You can define and reuse data across stacks with variables and metadata, and integrate Terramate into CI/CD pipelines to automate testing and deployment. It supports Terraform, OpenTofu, Terragrunt, Kubernetes, Pulumi, AWS CloudFormation, AWS Cloud Development Kit (CDK), Azure Resource Manager (ARM), Bicep, and others.

3. **Code generation:** Generate code from templates and modules to cut duplication and keep configuration consistent across your infrastructure.

4. **Git integration:** Detects and manages stacks with changes in a branch, commit, or pull request.

## Is it the right tool for you?

Whether Terramate fits depends on your situation: how complex your infrastructure is, the specific problems you have, and how your team likes to work. It's worth weighing it against other tools in the Terraform space, like Terragrunt, before deciding.

My use case is focus make our infrastructure in Azure Cloud automated. Our infrastructure team give us recommendation to make modules smallest as possible to work with their pipelines. It's nice idea but it's very hard to do it with complex infrastructure that have tens of modules. So I decided to use Terramate for my project. Split modules into stacks and use features for ordering to make graph how I want run them to be sure that order is right. 

I really like generating code. I make templates for backend and providers, that can works for everyone. But I can setup templates specific for project. We generate common variables, injected data from others team etc. That simplify many parts that was duplicated on many places.

## Conclusion

Terramate helps if you're orchestrating and managing large Terraform projects. Stack management, environment handling, and dependency management take some of the pain out of infrastructure as code. If you're running into these problems, it's worth a look.

I will about more details how we using Terramate after our project will be released to public.
