---
title: DevOps 实践
tags: [devops, ci-cd, containerization, iac, docker, kubernetes]
description: "Build, Test, Ship, Run——CI/CD、容器化与 Kubernetes 编排的 DevOps 工具链"
draft: false
---

> Build, Test, Ship, Run.

DevOps 不是工具，是一种**文化**——打破开发与运维的壁垒，让构建、测试、部署和监控成为统一的流水线。

---

## CI/CD 流水线

- **CI**（持续集成）：每次提交触发自动构建和单元测试——确保主干始终可发布
- **CD**（持续交付/部署）：通过自动化测试的代码自动部署到生产环境

---

## Docker 与容器化

Docker 的核心创新是**镜像分层**——每个 `RUN` 指令创建一个只读层，最终的容器是"基础镜像 + 所有层"的叠加。层缓存使重复构建极快。

OCI（Open Container Initiative）标准化了容器镜像格式和运行时规范——containerd、CRI-O 都是 OCI 兼容的运行时。

---

## Kubernetes 编排

K8s 的核心抽象：

| 对象 | 职责 |
|------|------|
| **Pod** | 最小调度单元——一个或多个共享网络/存储的容器 |
| **Service** | Pod 的稳定网络入口——自动负载均衡 |
| **Deployment** | 声明式管理 Pod 的副本数和滚动更新策略 |
| **ConfigMap/Secret** | 配置与密钥的管理 |

---

## GitOps

GitOps 将 Git 作为**单一事实来源**（Single Source of Truth）——基础设施和应用的期望状态存储在 Git 仓库中。ArgoCD/Flux 持续将 Git 中的状态同步到 Kubernetes 集群——任何人对集群的直接修改都会被自动回滚。

---

## 跨卷连接

| 概念 | 关联 |
|------|------|
| Docker 镜像分层 | [OverlayFS 联合文件系统——写时复制的层叠加](../../03-qiankun/03-filesystem/) |
| K8s Service 负载均衡 | [IPVS——Linux 内核的四层负载均衡](../../03-qiankun/05-network-protocol-stack/) |
| GitOps 声明式 | [SQL 声明式查询——说"要什么"而非"怎么做"](../../04-yuanhai/01-relational-database/) |

:::tip[卷八内部路径]
- [**系统设计**](../02-system-design/)：熔断器——K8s 的 Readiness Probe
- [**可观测性**](../04-observability/)：Prometheus——K8s 的原生指标系统
:::
