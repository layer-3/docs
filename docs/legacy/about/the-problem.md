---
description: The market challenges Yellow Network seeks to address
---

# 🚧 The Problem

Today, the world of cryptocurrency trading shows significant inefficiencies partially due to its decentralized nature. Here at Yellow Network, we are dedicated to tackling some of the deficiencies of the Web3 space.

## The Blockchain Trilemma

*[Blockchain Trilemma Diagram - Source: Yellow.org & Ledger Academy]*

> "The three pillars of blockchain scalability, decentralization and security co-exist but struggle to exist in harmony." - Vitalik Buterin

The so-called blockchain trilemma describes the problem that any project can only prioritize two out of three aspects at any given time.

Based on this theory, the Yellow Network team has identified critical key deficiencies in cross-broker and cross-chain cryptocurrency trading.

### Scalability

Traditional finance approaches this problem by having multiple layers of specialized actors.

On the other hand, crypto markets primarily operate in silos and independent blockchains, leading to a highly fragmented ecosystem.

Since we started this project, many more Layer-1 and Layer-2 blockchains have appeared, and we are now dealing with hundreds of blockchains. The fragmentation is now acute. There are over 200 notable exchanges and over 6000 cryptocurrencies. Around 100 use their own proprietary blockchain, making it hard to achieve secure interoperability.

Despite the critical nature of blockchain interoperability, cross-chain systems still face several hurdles when transacting assets or data between chains. These difficulties include transaction rate bottlenecks and disparities in trust.

Many projects attempting to solve cross-chain issues have relied on interblockchain communications, copying state from one chain to another. This approach is very problematic as it generates waste on-chain, increases the usage of transactions per chain, is very slow since it requires blockchain confirmation on both ends, and is fairly complex to scale as a generic solution for every blockchain. Different chains may have different security requirements to confirm a state is valid and won't be reverted.

The layer-3 virtual ledger approach remedies these issues by using state-channel smart contracts deployed on every chain and synchronizing the data off-chain using traditional high-speed databases such as Postgres, SQLite, and DHT networks like Kademlia.

These silos and sub-ecosystems hinder scalability, efficiency, and mass adoption.

*[Image placeholder: Traditional finance vs. Crypto finance comparison diagram]*

### Security

Certain scalability projects such as [bridges](https://www.coindesk.com/learn/are-blockchain-bridges-safe-why-bridges-are-targets-of-hacks/) increasingly suffer from fraudulent attacks and exploits. This impacts trust, acts as a major roadblock for many traders, and traps them within chain ecosystems, further hindering scalability.

Market places like [centralized exchanges](the-problem.md#centralized-exchanges-cex) that offer custody provide ease of access, but their custody solutions can put user funds at risk if hacked.

Decentralized exchanges eliminate the custody risk but introduce a subset of [other threats](the-problem.md#decentralized-exchanges-dex).

### Decentralization

As the current situation reveals, even though decentralization is considered the driving force within the crypto space, it is far from being a reality. What is referred to as "[decentralization theater](https://www.imf.org/en/Publications/fandd/issues/2022/09/Defi-promise-and-pitfalls-Fabian-Schar)" creates a risk of deception as, in many cases, DeFi protocols remain heavily centralized.

As a matter of fact, even with most DEXs, there is no real decentralized trading. For example, some DEXs may still rely on a central entity to control the flow of buy and sell orders, which allows them to prevent users from placing orders. Others continue to use third-party accounts as a way to route transactions, making them not really non-custodial in nature. When it comes to their underlying technology blockchain, computing is not fully decentralized, as all machines re-compute the same code in order to reach consensus. Additionally, liquidity remains concentrated on a single chain. As such, trading on decentralized exchanges stands in contrast to something like the shipping industry, which exhibits true decentralization. A vast network of companies works together to ensure global shipping functions effectively.

## Market and liquidity fragmentation

Due to the proliferation of blockchains, there has been a fragmentation of assets and liquidity across different layer-1 protocols and increasingly [layer-2 chains](https://l2beat.com/scaling/tvl/). Their interoperability is limited, having hitherto been dependent on centralized cross-chain bridges that have emerged as a [top security risk](https://blog.chainalysis.com/reports/cross-chain-bridge-hacks-2022/) due to the many substantial hacks that have [occurred](https://twitter.com/tokenterminal/status/1582376876143968256/photo/1) since September 2020.

To counteract market fragmentation, centralized crypto exchanges (CEXs) have rushed onto the scene. Over the last few years, [more than 200](https://coinmarketcap.com/rankings/exchanges/) CEXs have emerged worldwide. While many of them allow for the trading of digital assets across various blockchains, these CEXs remain isolated silos that trap liquidity. They all have their list of markets, which, unlike in traditional finance, are neither global nor aggregated. Some exchanges even choose a set of blockchains they more closely work with, amplifying the overall market's fragmentation.

The dominance of CEXs in crypto trading has been hailed as one of the [big ironies](https://www.coindesk.com/markets/2019/03/30/the-ultimate-irony-of-crypto-trading/) of a world that wants to achieve decentralization. Thus, decentralized crypto exchanges (DEXs) have gained in popularity and volume, at one point in time even [driving on-chain transaction volumes past](https://blog.chainalysis.com/reports/defi-dexs-web3/) that of centralized platforms.

Although DEXs may provide a number of benefits over CEXs in terms of censorship resistance or accessibility, they are not yet of [sufficient quality to compete](https://www.snb.ch/n/mmr/reference/sem_2022_06_03_barbon/source/sem_2022_06_03_barbon.n.pdf)\[^12] with the largest CEXs. One of their main problems is the fact that a DEX's blockchain-enabled transparency lends itself to [front-running](https://link.springer.com/chapter/10.1007/978-3-030-43725-1_13). Also, they lack speed and have a hard time competing regarding transaction costs and price efficiency.

Due to their on-chain architecture, DEXs remain unsuitable for high-frequency trading. Furthermore, when compared to centralized exchanges, there is a general lack of market depth. Market making is limited because, in the context of DEXs, liquidity providers factor in the volatility and security issues of decentralized exchange protocols and therefore deploy limited capital in accordance with their risk profiles. More generally, because the competition among DEXs is currently high, individual platforms struggle to retain liquidity as most liquidity providers only deploy [mercenary capital](https://www.mechanism.capital/native-token-liquidity/) that will instantly withdraw funds if competitors bait them with higher short-term returns.

A recent analysis purports to [show](https://blog.bitfinex.com/media-releases/hodlers-put-faith-in-centralised-exchanges-as-platforms-flex-high-tech-security/) that crypto traders are more comfortable trading on CEXs given the growing threat of hacks that have materialized in the decentralized finance (DeFi) space over the course of this year. In the aftermath of the [FTX collapse](https://www.investopedia.com/what-went-wrong-with-ftx-6828447), this could be changing, as the inherent count party risk coming with CEXs could increasingly be seen as a major disadvantage. While CEXs are striving to provide transparency by incorporating [proof of reserves](https://niccarter.info/proof-of-reserves/), in which a custodian transparently attests to the existence of on-chain reserve assets (but not liabilities), DEXs are working towards solving their [blockchain-based scalability issues](https://www.researchgate.net/publication/342639281_Scaling_Blockchains_A_Comprehensive_Survey).

## Lack of regulatory frameworks

Undeniably, DEXs with centralized components must be subject to the regulatory standards that CEXs must follow. However, this is not the case as specific regulation pertaining to the crypto industry is still missing. Consequently, this lack of regulatory frameworks leads to the fact that there is no separation of responsibilities -- mostly among CEXs. In fact, they are doing a bit of everything: Managing their security in-house, doing their own custody, issuing their own stablecoin, launching investment products, or acting as a launchpad. This not only creates a conflict of interest since CEXs act as marketplaces, market makers, liquidity providers, and custodians, but with this concentration in services, a lot of trust ends up being placed in CEXs - the opposite of what the blockchain space is about.
