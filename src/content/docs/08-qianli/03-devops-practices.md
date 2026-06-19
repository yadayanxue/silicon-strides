---
title: DevOps 实践
tags: [devops, ci-cd, containerization, iac, docker, kubernetes]
description: "Build, Test, Ship, Run——CI/CD、容器化与 K8s 编排的 DevOps 工具链"
draft: false
---

> Build, Test, Ship, Run.

DevOps 打破开发与运维壁垒——构建、测试、部署和监控成为统一流水线。

---

## CI/CD 与 Docker

CI 每次提交触发自动构建和测试。CD 通过自动化测试的代码自动部署。

Docker 核心创新是**镜像分层**——每个 `RUN` 创建只读层，层缓存使重复构建极快。OCI 标准化了容器镜像格式和运行时。

---

## Kubernetes 编排

```mermaid
---
title: K8s 核心对象关系
---
graph LR
    DEPLOY["Deployment<br/>声明式副本管理"] --> RS["ReplicaSet<br/>维护副本数"]
    RS --> POD1["Pod<br/>最小调度单元"]
    RS --> POD2["Pod"]
    SVC["Service<br/>稳定网络入口"] --> POD1
    SVC --> POD2

    style DEPLOY fill:#e3f2fd
    style SVC fill:#c8e6c9
```

## GitOps

Git 作为单一事实来源——ArgoCD/Flux 持续同步 Git → K8s。任何人直接修改集群会被自动回滚。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Docker 镜像分层 | [OverlayFS——写时复制层叠加](../../03-qiankun/03-filesystem/) |
| K8s Service 负载均衡 | [IPVS——内核四层负载均衡](../../03-qiankun/05-network-protocol-stack/) |
| GitOps | [SQL 声明式——说"要什么"而非"怎么做"](../../04-yuanhai/01-relational-database/) |

:::tip[卷八内部路径]
- [**系统设计**](../02-system-design/)：熔断器——K8s Readiness Probe
- [**可观测性**](../04-observability/)：Prometheus——K8s 原生指标
:::
