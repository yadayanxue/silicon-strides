---
title: 零知识证明
tags: [zkp, zk-snark, zk-stark, privacy, verifiable-computation]
description: "证明你知道，但不泄露知道什么——zk-SNARK 与 zk-STARK 的隐私计算革命"
draft: false
---

> 证明你知道，但不泄露知道什么。

1985 年，Goldwasser、Micali 和 Rackoff 提出了**零知识证明**（ZKP）的概念：证明者让验证者相信一个陈述为真，但验证者除了"陈述为真"之外什么也学不到。三十年后，ZKP 从理论论文走进了区块链扩容（zkRollup）和隐私保护（ZCash）的工程实践。

---

## ZKP 三性质

| 性质 | 含义 |
|------|------|
| **完备性**（Completeness） | 如果陈述为真，诚实的证明者总能说服验证者 |
| **可靠性**（Soundness） | 如果陈述为假，任何作弊证明者无法说服验证者 |
| **零知识**（Zero-Knowledge） | 验证者除了"陈述为真"之外学不到任何新信息 |

---

## zk-SNARK vs zk-STARK

| 特性 | zk-SNARK | zk-STARK |
|------|---------|---------|
| **全称** | Zero-Knowledge Succinct Non-Interactive Argument of Knowledge | Scalable Transparent Argument of Knowledge |
| **证明大小** | ~200 字节（极短） | ~50KB（较大但可聚合） |
| **验证时间** | 毫秒级 | 毫秒级 |
| **可信设置** | 需要（Groth16 每个电路需一次） | 不需要（**透明**） |
| **后量子安全** | 否（基于椭圆曲线配对） | 是（基于哈希函数和多项式承诺） |
| **代表应用** | ZCash 隐私交易 | StarkNet、Polygon Miden |

---

## 递归证明

递归证明是 ZKP 的"工业革命"——它允许将多个证明聚合为一个。第一个证明验证一批交易，第二个证明验证第一个证明本身，以此类推。这种**证明压缩**使 Layer 2 扩容方案能够将数千笔交易压缩为一个链上证明，大幅降低 Gas 费用。

---

## 应用场景

- **隐私交易**：ZCash 使用 zk-SNARK 隐藏交易金额和参与方
- **zkRollup**：StarkNet 将成千上万笔交易打包为一个 STARK 证明，提交到以太坊主网
- **身份验证**：证明年龄大于 18 岁，但不暴露具体出生日期

---

## 跨卷连接

| 概念 | 关联 |
|---------|---------|
| 多项式承诺 | [Merkle Tree——哈希函数逐层承诺](../03-hash-and-signature/#hmac-与-merkle-tree) |
| FRI 协议 | [纠错码——RS 码的 FFT 高效验证](../../00-lingxi/06-cryptographic-mathematics/) |
| Groth16 配对 | [椭圆曲线配对——双线性映射](../../00-lingxi/06-cryptographic-mathematics/#椭圆曲线密码学ecc) |

:::tip[卷七内部路径]
- [**哈希与签名**](../03-hash-and-signature/)：Merkle Tree 与 FRI 的哈希系证明
- [**系统安全**](../05-system-security/)：TEE 可信执行——硬件零知识（SGX）vs 密码学零知识（ZKP）
:::
