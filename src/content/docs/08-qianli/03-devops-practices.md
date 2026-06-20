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

### runc 与 clone 标志位：容器的进程边界

容器的"隔离感"并非魔法——它来自 Linux 内核 `clone()` 系统调用的一组精心组合的标志位。当你执行 `docker run`，Docker 守护进程通过 `containerd` → `containerd-shim` → `runc` 的调用链，最终 `runc` 执行类似以下逻辑：

```c
// runc 创建容器进程的精简逻辑（伪代码）
int container_pid = clone(container_entry, child_stack,
    CLONE_NEWNS   |   // 挂载命名空间：容器有自己的 / 根文件系统
    CLONE_NEWUTS  |   // UTS 命名空间：容器有独立 hostname
    CLONE_NEWIPC  |   // IPC 命名空间：隔离信号量/共享内存/消息队列
    CLONE_NEWPID  |   // PID 命名空间：容器内 PID 从 1 开始
    CLONE_NEWNET  |   // 网络命名空间：容器有独立 veth 网卡
    SIGCHLD);         // 子进程退出时通知父进程
```

各命名空间的隔离效果：

| 标志位 | 命名空间 | 隔离内容 | 缺失时的后果 |
|--------|---------|---------|------------|
| `CLONE_NEWNS` | Mount | 文件系统挂载点 | 容器可看到宿主机所有挂载 |
| `CLONE_NEWUTS` | UTS | hostname / domainname | 容器修改 hostname 影响宿主机 |
| `CLONE_NEWIPC` | IPC | 信号量、消息队列、共享内存 | 容器间 IPC 可互相干扰 |
| `CLONE_NEWPID` | PID | 进程 ID 编号空间 | 容器内可看到宿主机所有进程 |
| `CLONE_NEWNET` | Network | 网络栈（网卡、路由表、iptables） | 容器共享宿主机网络栈 |
| `CLONE_NEWCGROUP` | Cgroup | cgroup 视图 | 容器可看到宿主机 cgroup 层级 |

:::tip[跨卷链接]
`runc` 的标志位组合与 [进程与线程 `fork()`/`clone()` 三路径（fork/exec/clone——进程诞生的三种路径）（fork/exec/clone——进程诞生的三种路径）](../../03-qiankun/01-process-and-thread/#forkexecclone进程诞生的三种路径) 是同一个系统调用的不同用法——`pthread_create()` 用 `CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND` 创建共享地址空间的线程，而 `runc` 用 `CLONE_NEW*` 创建**隔离地址空间和一切资源的容器进程**。两者共享同一个 `clone()` 接口，但标志位的哲学方向完全相反——一个追求**共享的最小集**（线程），一个追求**隔离的最大集**（容器）。
:::

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
| runc clone 标志位 | [进程与线程 `clone()` 的系统调用语义（fork/exec/clone——进程诞生的三种路径）（fork/exec/clone——进程诞生的三种路径）](../../03-qiankun/01-process-and-thread/#forkexecclone进程诞生的三种路径) |

:::tip[卷八内部路径]
- [**系统设计**](../02-system-design/)：熔断器——K8s Readiness Probe
- [**可观测性**](../04-observability/)：Prometheus——K8s 原生指标
:::
