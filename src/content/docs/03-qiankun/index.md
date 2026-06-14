---
title: 卷三 · 乾坤（系统与网络）
tags: [os, kernel, networking, concurrency]
---

# 卷三 · 乾坤（系统与网络）

> 定乾坤，理乱象，调度万物。

乾坤者，天地之序。此卷聚焦操作系统内核与网络协议栈——前者管理硬件资源、调度万千进程；后者连接孤岛、编织通信之网。理解内核，方能理解一切上层软件的边界与可能。

## 章节导览

- [**进程与线程**](./01-process-and-thread/)：创建、调度、上下文切换、进程间通信
- [**内存管理**](./02-memory-management/)：虚拟内存、分页、缺页中断、内存映射
- [**文件系统**](./03-filesystem/)：VFS、ext4、FUSE、日志与一致性
- [**同步原语**](./04-synchronization/)：互斥锁、读写锁、RCU、futex
- [**网络协议栈 I · TCP/IP**](./05-network-protocol-stack/)：分层模型、IP 路由、转发
- [**网络协议栈 II · 传输层**](./06-transport-tcp-udp-quic/)：TCP 拥塞控制、UDP、QUIC
- [**网络协议栈 III · 应用层**](./07-application-protocols/)：DNS、HTTP/1/2/3、TLS
- [**网络编程**](./08-network-programming/)：Socket、epoll、io_uring、DPDK

:::tip[跨卷链接]
虚拟地址翻译 → [卷一 · 微尘](/01-weichen/) 中的 MMU 与 TLB
分布式一致性 → [卷四 · 渊海](/04-yuanhai/) 中的共识算法
容器与隔离 → [卷八 · 千里](/08-qianli/) 中的 DevOps 实践
:::
