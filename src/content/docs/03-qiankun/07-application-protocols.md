---
title: 网络协议栈 III — 应用层协议
tags: [dns, http, http2, http3, tls, websocket]
description: "Web 世界的通用语言——从 DNS 递归查询到 HTTP/3 QUIC 多路复用的应用层全景"
draft: false
---

> Web 世界的通用语言。

传输层的 TCP 和 UDP 提供了端到端的可靠（或不可靠）字节流。但应用程序需要的不是字节流——它需要网页、邮件、域名解析、实时消息。**应用层协议**在传输层之上定义了数据的语义：HTTP 的请求/响应模型、DNS 的分层域名系统、TLS 的加密握手、WebSocket 的全双工通道。

本章以 DNS 的递归解析为起点，走过 HTTP/1.1 到 HTTP/3 的三代演进，剖析 TLS 1.3 握手的加密魔术，最后以 WebSocket 的全双工通信收尾。

---

## DNS：互联网的"电话簿"

### 递归解析流程

DNS（Domain Name System）将人类可读的域名（`www.example.com`）翻译为机器可路由的 IP 地址。一个完整的递归解析可能涉及多级服务器的查询：

```
客户端 → 本地 DNS 解析器（缓存）
  → 根域名服务器（.）
    → .com 顶级域名服务器
      → example.com 权威 DNS 服务器
        → www.example.com 的 A 记录
```

每个 DNS 响应都携带一个 TTL（生存时间），中间解析器据此缓存结果——减少根域名服务器和顶级域名服务器的负载。

### DNS 安全与隐私

传统 DNS 查询是**明文 UDP**传输——任何中间节点都可以查看和篡改。DNS over HTTPS（DoH）和 DNS over TLS（DoT）将 DNS 查询加密在 TLS 隧道中，防止窥探和篡改，代价是失去了网络运营商层面的 DNS 缓存优化。

---

## HTTP：从 1.1 到 3.0 的三代进化

### HTTP/1.1：队头阻塞的起源

HTTP/1.1 在一个 TCP 连接上串行处理请求——请求 A 的响应必须完全接收后，请求 B 才能开始。即使打开 6 个并行 TCP 连接（浏览器的典型做法），每个连接内部的队头阻塞依然限制了并发效率。

### HTTP/2：多路复用的突破

HTTP/2 引入了**二进制帧层**（Binary Framing Layer）：多个请求/响应被切分为帧，在单个 TCP 连接上交错传输。`stream_id` 标识每个帧属于哪个请求——实现了真正的多路复用。头部压缩（HPACK）使用静态和动态字典，将重复的头字段压缩为索引引用。

然而，HTTP/2 仍然运行在 TCP 之上——TCP 的队头阻塞依然存在：如果 TCP 段丢失，**整个连接**的所有流都会被阻塞，直到丢失段被重传。这是 TCP 的"线头阻塞"（Head-of-Line Blocking），HTTP/2 无法解决。

### HTTP/3：QUIC 解放多路复用

HTTP/3 运行在 QUIC 之上，彻底解决了 TCP 层面的队头阻塞：每个 HTTP 请求是 QUIC 中独立的流，一个流的丢包**不影响其他流**。HTTP/3 还要求使用 TLS 1.3——默认加密。

| 版本 | 传输层 | 多路复用 | 队头阻塞 | 头部压缩 | 首发年份 |
|------|--------|---------|---------|---------|---------|
| **HTTP/1.1** | TCP（每个连接串行） | 否 | TCP 层 + 应用层 | 无 | 1997 |
| **HTTP/2** | TCP（单连接多路复用） | 是（帧级） | TCP 层仍有 | HPACK | 2015 |
| **HTTP/3** | QUIC (UDP) | 是（流级） | 无 | QPACK | 2022 |

---

## TLS 1.3：加密握手的极简主义

TLS 1.3 将握手从 TLS 1.2 的 2-RTT 压缩为 1-RTT（首次连接）或 0-RTT（恢复连接）。关键改进：

1. **移除静态 RSA**——所有密钥交换必须使用前向安全性（DHE/ECDHE）
2. **1-RTT 握手**：客户端在 ClientHello 中猜测服务器支持的密钥共享参数，如果猜对，握手在 1 个 RTT 内完成
3. **0-RTT 重连**：已连接过的客户端使用预共享密钥（PSK），在 ClientHello 中直接携带加密的应用数据——**重放攻击**的风险需要应用层自行防御（对幂等请求安全，对非幂等请求必须拒绝 0-RTT）

---

## 跨卷连接

应用层协议是"从半导体物理到用户界面"这条链路的最顶层——它的 DNS 查询最终触发 IP 包的收发，HTTP 的多路复用本质上是在应用层做任务调度：

| 本章概念 | 依赖的底层原理 | 支撑的上层抽象 |
|----------|---------------|---------------|
| DNS 递归查询 | [递归算法与分治策略](../../00-lingxi/04-algorithm-theory/) | [服务发现 Consul/Etcd](../../04-yuanhai/03-distributed-fundamentals/) |
| HTTP/2 多路复用 | [RTOS 任务多路复用与时间片轮转](../02-jiezi/03-rtos-fundamentals/#调度器优先级抢占与时间片) | [gRPC 双向流与微服务通信](../../08-qianli/02-system-design/) |
| TLS 1.3 DH 密钥交换 | [非对称加密 ECC 与 DH 算法](../../07-tianshu/02-asymmetric-cryptography/) | [OAuth 2.0 的 Token 交换流程](../../07-tianshu/05-system-security/) |
| QPACK 头部压缩 | [HPACK 与 Huffman 编码](../../00-lingxi/05-compiler-theory/) | [Protobuf/Avro 序列化压缩](../../04-yuanhai/05-data-pipelines/) |
| WebSocket 全双工 | [SPI 全双工通信的硬件基础](../02-jiezi/04-peripheral-drivers/#spi高速同步的时钟舞蹈) | [实时协作 CRDT 同步](../../05-wanxiang/05-human-computer-interaction/) |

:::tip[卷三内部路径]
- [**传输层**](../06-transport-tcp-udp-quic/)：QUIC——HTTP/3 的传输基础
- [**网络编程**](../08-network-programming/)：Socket——HTTP 服务的底层 API
:::
