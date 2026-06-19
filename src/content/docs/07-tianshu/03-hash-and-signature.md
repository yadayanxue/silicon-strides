---
title: 哈希与签名
tags: [sha, digital-signature, mac, hash, merkle-tree]
description: "不可逆的指纹，不可伪造的印章——SHA 家族、数字签名与 Merkle Tree 的密码学支柱"
draft: false
---

> 不可逆的指纹，不可伪造的印章。

哈希函数是密码学的"瑞士军刀"——它将任意长度的消息映射为固定长度的摘要。数字签名让公钥持有者验证消息的真实来源。这两者的结合构成了区块链、数字证书和代码签名的基础安全原语。

---

## 密码学哈希函数

安全的哈希函数必须满足三个性质：

| 性质 | 含义 | 违反后果 |
|------|------|---------|
| **抗原像**（Preimage Resistance） | 从 $h = H(m)$ 找回 $m$ 不可行 | 密码哈希泄露可逆推 |
| **抗第二原像** | 给定 $m_1$，找到 $m_2 \neq m_1$ 使 $H(m_1) = H(m_2)$ 不可行 | 消息被替换而哈希不变 |
| **抗碰撞**（Collision Resistance） | 找到任意 $m_1 \neq m_2$ 使 $H(m_1) = H(m_2)$ 不可行 | 伪造相同哈希的两个合约 |

SHA-256 基于 Merkle-Damgård 结构，将消息分块后迭代压缩。SHA-3 基于完全不同的海绵结构（Sponge Construction）——吸收了 SHA-2 抗长度扩展攻击的教训。

---

## 数字签名

数字签名是非对称加密的"反向使用"——用私钥签名，用公钥验证。

| 算法 | 基于 | 特点 |
|------|------|------|
| **RSA-PSS** | [因数分解困难性](../02-asymmetric-cryptography/) | 最经典、验证最快 |
| **ECDSA** | [椭圆曲线离散对数](../../00-lingxi/06-cryptographic-mathematics/#椭圆曲线密码学ecc) | 签名短、广泛应用（Bitcoin） |
| **EdDSA**（Ed25519） | 扭曲爱德华曲线 | 恒定时间、抗侧信道、密钥短 |

---

## HMAC 与 Merkle Tree

**HMAC**（Hash-based MAC）将密钥与消息混合后哈希——没有密钥的人无法产生有效的 MAC，验证者必须持有相同密钥。**Merkle Tree** 将大量数据块的哈希组织为二叉树——仅需 $O(\log n)$ 个哈希即可证明某个数据块属于该树。这是区块链轻节点和 BitTorrent 内容验证的核心数据结构。

---

## 跨卷连接

| 概念 | 关联 |
|---------|---------|
| SHA 迭代压缩 | [AES 轮函数——迭代混淆-扩散范式](../01-symmetric-cryptography/) |
| Merkle Tree | [Git 的 Merkle DAG 对象存储](../../08-qianli/03-devops-practices/) |
| EdDSA 恒定时间 | [侧信道——时序攻击基于执行时间推断密钥](../05-system-security/) |

:::tip[卷七内部路径]
- [**非对称加密**](../02-asymmetric-cryptography/)：RSA/ECC——签名算法的数学基础
- [**零知识证明**](../04-zero-knowledge-proofs/)：Merkle Tree——zk 证明器的承诺方案
:::
