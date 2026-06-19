---
title: 对称加密
tags: [aes, block-cipher, stream-cipher, encryption-mode]
description: "一把钥匙锁住整个王国——AES 轮函数、分组模式与认证加密的完整剖析"
draft: false
---

> 一把钥匙，锁住整个王国。

对称加密是密码学的根基——通信双方共享同一把密钥。从凯撒密码到 AES，核心思想始终如一：**混淆**（打乱明文与密文的关系）与**扩散**（让每比特影响多比特密文）。本章深入 AES 内部结构与 GCM 认证加密。

---

## AES：分组加密之王

AES-128 处理 128 位数据块，经 10 轮变换。每轮四步：

| 步骤 | 操作 | 密码学作用 |
|------|------|-----------|
| **SubBytes** | S-Box 查表（基于 [$GF(2^8)$ 逆运算](../../00-lingxi/06-cryptographic-mathematics/#有限域)） | **混淆** |
| **ShiftRows** | 每行循环左移 | **扩散**（跨列混合） |
| **MixColumns** | 列与固定矩阵在 $GF(2^8)$ 上相乘 | **扩散**（每列 4 字节互相影响） |
| **AddRoundKey** | 与轮密钥 XOR | 注入密钥材料 |

---

## 分组模式

| 模式 | 并行 | 认证 | 风险 |
|------|------|------|------|
| **ECB** | ✓ | ✗ | 相同明文 → 相同密文（**禁用**） |
| **CBC** | ✗ | ✗ | IV 必须随机不可预测 |
| **CTR** | ✓ | ✗ | Nonce 绝不重复 |
| **GCM** | ✓ | ✓ | CTR 加密 + $GF(2^{128})$ GHASH 认证 |

**GCM** 是 TLS 1.3 推荐模式——同时提供机密性和完整性。

---

## ChaCha20：软件高效的流密码

ChaCha20 通过 20 轮 ARX（Add-Rotate-XOR）操作产生密钥流。无需 AES 硬件加速即可在软件中高效运行——被 WireGuard VPN 和 TLS 1.3 采纳为备用算法。

---

## 跨卷连接

| 概念 | 关联 |
|---------|---------|
| AES S-Box | [有限域 $GF(2^8)$](../../00-lingxi/06-cryptographic-mathematics/#有限域) |
| GCM GHASH | [$GF(2^{128})$ 多项式运算](../../00-lingxi/06-cryptographic-mathematics/) |
| AES-NI 指令 | [CISC 复杂指令对密码学加速](../../01-weichen/05-instruction-set-architecture/) |

:::tip[卷七内部路径]
- [**非对称加密**](../02-asymmetric-cryptography/)：用 RSA/ECC 传输 AES 密钥
- [**哈希与签名**](../03-hash-and-signature/)：GCM 认证与 HMAC 的哲学
- [**系统安全**](../05-system-security/)：AES-NI 侧信道防御
:::
