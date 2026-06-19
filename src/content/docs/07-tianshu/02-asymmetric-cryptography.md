---
title: 非对称加密
tags: [rsa, ecc, dh, public-key, key-exchange]
description: "公钥与私钥的舞蹈——从 RSA 因数分解到 ECC 椭圆曲线的非对称加密之路"
draft: false
---

> 公钥与私钥的舞蹈。

对称加密的密钥分发问题困扰了密码学数千年——在通信前，双方必须安全共享同一把密钥。1976 年，Diffie 和 Hellman 提出了一个看似不可能的想法：**用一对数学相关的密钥**——公钥可公开，私钥保密。公钥加密的数据只有私钥能解密；私钥签名的数据，公钥能验证。

---

## RSA：大数分解的数学基础

RSA 的安全性基于一个事实：**大数分解极其困难**。密钥生成：

1. 随机选择两个大素数 $p, q$
2. 计算 $n = p \times q$，$\phi(n) = (p-1)(q-1)$
3. 选择 $e$ 与 $\phi(n)$ 互质（常用 65537）
4. 计算 $d = e^{-1} \bmod \phi(n)$

公钥：$(n, e)$，私钥：$(n, d)$。加密：$C = M^e \bmod n$，解密：$M = C^d \bmod n$。

如果攻击者可以因数分解 $n$，他就可以计算 $d$——但 2048 位 RSA 的因数分解需要数千年。

---

## ECC：更短的密钥，同等的安全

椭圆曲线密码学（ECC）基于[椭圆曲线离散对数问题](../../00-lingxi/06-cryptographic-mathematics/#椭圆曲线密码学ecc)。256 位 ECC 密钥约等于 3072 位 RSA 密钥的安全强度——这使 ECC 成为移动设备和 IoT 场景的首选。Curve25519（Daniel Bernstein 设计）是目前最广泛使用的安全曲线之一。

---

## Diffie-Hellman 密钥交换

DH 协议使双方在不共享任何秘密的情况下协商一个共享密钥：

1. Alice 选择私钥 $a$，发送 $g^a \bmod p$ 给 Bob
2. Bob 选择私钥 $b$，发送 $g^b \bmod p$ 给 Alice
3. 双方独立计算共享密钥 $g^{ab} \bmod p$

窃听者看到 $g^a$ 和 $g^b$，但无法高效计算 $g^{ab}$——DH 问题的困难性假设。

---

## 跨卷连接

| 概念 | 关联 |
|---------|---------|
| RSA 因数分解 | [模运算与欧拉函数](../../00-lingxi/06-cryptographic-mathematics/#模运算与同余) |
| ECDH 密钥交换 | [椭圆曲线群与标量乘法](../../00-lingxi/06-cryptographic-mathematics/#椭圆曲线密码学ecc) |
| 后量子密码 Kyber | [格密码与 LWE 问题](../../00-lingxi/06-cryptographic-mathematics/#格密码后量子时代的希望) |

:::tip[卷七内部路径]
- [**对称加密**](../01-symmetric-cryptography/)：RSA/ECC 加密对称密钥——混合加密
- [**哈希与签名**](../03-hash-and-signature/)：RSA/ECDSA 签名——非对称的认证面
:::
