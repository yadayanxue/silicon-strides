---
title: 系统安全
tags: [sandbox, capabilities, secure-boot, vulnerability, exploit]
description: "从密码学理论到系统攻防——沙箱、安全启动与漏洞分类的防御体系"
draft: false
---

> 从密码学理论到系统攻防。

密码学提供了理论上不可破解的算法，但**系统安全**关注的是攻防实战——当 AES 和 RSA 在数学上完美无缺时，攻击者转而攻击密钥存储方式、攻击侧信道泄露、攻击缓冲区溢出的控制流。本章从攻击面的最小权限原则出发，走过 Linux 的沙箱技术谱系，剖析安全启动的信任链，最后以经典漏洞分类收尾。

---

## 攻击面与最小权限

**攻击面**是系统可被攻击者接触的所有入口——网络端口、系统调用接口、文件系统的 setuid 二进制、USB 驱动。**最小权限原则**要求每个组件仅拥有完成其功能所需的最小权限集——一个处理 HTTP 请求的进程不需要访问 `/etc/shadow`。

---

## Linux 沙箱技术谱系

| 机制 | 粒度 | 典型应用 |
|------|------|---------|
| **seccomp-bpf** | 系统调用级别——允许/拒绝特定 syscall | Docker 默认安全配置、Chrome 渲染进程 |
| **Landlock** | 文件系统级别——限制特定目录的访问 | 用户态无特权沙箱 |
| **Namespaces** | 资源隔离——PID/Network/Mount/User | 容器（Docker/LXC）的基础 |
| **Capabilities** | 权限细分——将 root 的权力拆分为 40+ 种能力 | `CAP_NET_BIND_SERVICE` 允许绑定 80 端口而不需要完整 root |

这些技术的组合使用——如 Docker 容器默认启用 seccomp + namespaces + capabilities 降权——构成了现代云原生安全的隔离基础。

---

## 安全启动与 TEE

**安全启动**（Secure Boot）从硬件 ROM 开始逐级验证固件签名——ROM → UEFI → Bootloader → OS Kernel。每一级在将控制权交给下一级前验证其签名，建立链式信任。如果任何一级验证失败，启动中止。

**可信执行环境**（TEE，如 ARM TrustZone 和 Intel SGX）在 CPU 硬件层面创建一个"安全世界"——即使操作系统内核被完全攻破，TEE 内部的代码和数据仍受到硬件保护。

---

## 经典漏洞分类

| 类型 | 原理 | 防御 |
|------|------|------|
| **缓冲区溢出** | 写超过 buffer 边界的数据覆盖返回地址 | Stack Canary、ASLR、NX bit |
| **竞态条件** | TOCTOU——检查和使用之间的时间窗口 | 原子操作、[文件锁与 RCU](../../03-qiankun/04-synchronization/) |
| **侧信道攻击** | 从执行时间/功耗/电磁辐射推断秘密 | 恒定时间算法（[EdDSA](../03-hash-and-signature/)）、缓存分区 |

:::tip[跨卷链接]
缓冲区溢出利用的是 [C 语言的栈帧布局与 RISC-V/ARM 调用约定](../../01-weichen/05-instruction-set-architecture/)——栈上局部变量与返回地址紧邻，越界写入直接覆盖控制流。NX bit 的硬件支持依赖于 [MMU 的 PTE 权限位](../../01-weichen/04-memory-hierarchy/#cache-组织形式) 和 [页表的 NX 位设置](../../03-qiankun/02-memory-management/#页表条目的结构)。
:::

---

## 跨卷连接

| 概念 | 关联 |
|---------|---------|
| seccomp-bpf | [eBPF 在内核中的安全执行引擎](../../03-qiankun/08-network-programming/) |
| ARM TrustZone | [Cortex-M TrustZone for ARMv8-M 的安全启动](../../02-jiezi/01-bare-metal/) |
| Stack Canary | [函数调用栈帧的返回地址布局](../../01-weichen/05-instruction-set-architecture/) |
| 侧信道防御 | [AES-NI 恒定时间指令——硬件级防御](../01-symmetric-cryptography/) |

:::tip[卷七内部路径]
- [**对称加密**](../01-symmetric-cryptography/)：侧信道攻击 AES 的缓存时序泄露
- [**非对称加密**](../02-asymmetric-cryptography/)：TEE 中的密钥存储
- [**哈希与签名**](../03-hash-and-signature/)：安全启动的签名验证链
:::
