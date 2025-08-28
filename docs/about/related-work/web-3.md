---
description: Summary of Web3 projects with related work to Yellow Network
---

# 🌕 Web 3

{% hint style="info" %}
Related Work refers to aspects of existing concepts that lay the groundwork for a new project.&#x20;
{% endhint %}

Since the launch of Bitcoin, cryptocurrency trading has witnessed massive user adoption on a global scale and many alternative projects have been developed in the space. Users now have a broad choice of different blockchains, tokens, and decentralized applications. New projects are launched daily, many of which aim to simplify the users' journey in this wild Web3.0.&#x20;

Solutions such as bridges are great examples of an effort to interconnect blockchains, but they suffer from a lack of decentralization and pose a security risk. To avoid bridges and still trade effectively, users often require significant liquidity of the same token across different chains to trade efficiently.

## Scope & Key Takeaways

* Identify projects that classify as related work to Yellow Network Smart Clearing Protocol;
* Focus on best-in-class decentralized exchange services, liquidity aggregators, and layer-3 protocols;
* Clarify that there is currently no related project with the same scope;
* State of the market overview.

## Decentralized Applications (dApps)

### Uniswap—A DEX Case Study

#### **Short history**

Uniswap is a decentralized exchange application launched in 2018. It is the first DEX to gain significant traction on the [Ethereum Mainnet](https://ethereum.org/en/) in 2020. Since then, many clones and other decentralized applications have been launched across various blockchains and are used by millions of users to swap tokens, lend or borrow cryptocurrency assets, bridge funds, etc. &#x20;

In short, Uniswap paved the way for DeFi (Decentralized Finance).

#### **Security, and Auditability**

Uniswap, and other DEXs brought many advantages compared to centralized exchanges. The exchange software is fully implemented in smart contracts deployed on the blockchain. Its open-source nature means anyone can read how it works and potentially build a clone. As the DEX has no custody over user assets, there are fewer risks of wallet hacks. Since there is no expensive underlying business operation, transaction costs tend to be lower. But despite independent audits, self-custody, and other security mechanisms, many DeFi applications are still victims of breaches and exploits.&#x20;

#### **Automatic Market Making (AMM)**

Anyone can provide liquidity to Uniswap markets, called pools, and receive a revenue share from fees collected from trading (swapping). Moreover, the price of assets is managed automatically; every trade impacts the price up or down depending on whether it is placed as an ask or a bid order. Since its v1, the protocol evolved to be more resilient and secure with v2 and introduced more effective liquidity use with v3.&#x20;

The Uniswap protocol provides an elegant solution to the problem of market making and access to liquidity.

#### **Performances**

The success of decentralized applications is increasingly leading to network congestion. A prime example was the spike in gas fees on Ethereum in 2021. But the Ethereum chain was not alone, and the cost of transactions on many other chains increased drastically, sometimes to a point where it was reaching such unsustainable levels that users stopped interacting with the chain as it became simply too expensive. In addition, many DEXes and other DeFi applications face throughput limitations caused by the low hash rates of certain blockchains. Today many new projects claim to tackle the blockchain scalability problem, and some, like Polygon and Solana, indeed drastically improved the throughput of transactions.

### Lightning Network

The Lightning Network is a Layer-2 solution for the Bitcoin network. It was proposed as a solution to the scalability problem of the Bitcoin network and leverages state channel technology to be used as a payment channel to perform any number of off-chain transactions. An on-chain funding transaction initiates a payment channel. Then, it is followed by any number of off-chain transactions. Finally, to commit balances, a settlement transaction is performed on-chain. At the same time, the Lightning Network introduces real-time fund transfers in the blockchain. Yellow Network protocol leverages the same technology for high-frequency trading.

### DyDx

DyDx is a trading platform for crypto derivatives. It combines the speed of a centralized order book and the transparency of decentralized applications. The result is a more secure and faster software architecture. The downside is that it is limited to Ethereum users.

### Qredo

Qredo focuses on securing digital assets using MPC, eliminating the sensitive private key from the signature computation. It also allows settlements by updating an internal ledger entry without costly transactions on the blockchain. While Qredo brings state-of-the-art security for digital assets, it doesn't facilitate high-frequency trading.

### LayerZero

LayerZero provides an SDK that enables cross-chain transactions, but it requires modifying existing smart contracts and does not solve performance issues. It increases the number of transactions on already congested chains.

### Woo network

Wootrade is a dark pool trading platform that offers significantly above-average liquidity, tighter spreads than the major exchanges, and zero (or even negative!) fees. Wootrade trying to solve the liquidity, cost, and adverse selection issues of cryptocurrency trading for exchanges, institutions, and (eventually), retail traders, through the use of redesigned incentive mechanics.

### 1Inch

An entry point to the 1inch Network's tech. The 1inch dApp is a 1 DeFi aggregator, offering access to the liquidity and token swap rates on various DEXes, with features, including partial fill and the ability to find the best swap paths across multiple liquidity sources. Users can optimize trades of DEXs on multiple networks and also with the 1inch DeFi Wallet users can buy crypto with their bank card using our partner fiat gateway providers.

## State of the Market (Q4, 2023—Q1, 2024)

The macroeconomic climate has been defined by inflation and the extension of geopolitical crises. These headwinds have been strongly reflected in the crypto markets. We have also seen the effects of Terra, Celsius, and 3AC’s capitulations impact the market and encourage mass de-risking across all crypto assets.

2022 has seen the Total Crypto Market Cap fall from over $2.2 Trillion down to below $1 Trillion, further demonstrating the fear in the markets and low-risk sentiment. The move into digital assets and out of fiat currencies due to diminished confidence in monetary bodies is a dynamic that may continue to foster if current economic conditions persist.

After we saw the collapse of Terra in Q2, the total value locked (TVL) across the major chains fell sharply. We peaked this year with over $196 Billion in TVL which sold off to current levels at below $64 Billion.

TVL’s behavior during Q3 was similar to the consolidation we saw in digital asset prices, during the same period. As the value of the underlying assets varied in value off the back of macroeconomic risk, TVL adjusted accordingly. QoQ TVL increased by 1.99%.

**Since the huge capitulation, markets have seen very little recovery. This is relevant as the competitive market analysis is looking at a crippled market, which should be noted.**
