---
description: Technologies used and created by the Yellow Network team
---

# System Overview

![Technologies Used and Created by Yellow](/img/placeholder.png)

**Yellow Network** is mainly composed of two layers:

1. **The virtual ledger layer (Layer-3)** - Yellow Clearnet - formed by a network of nodes called "clearnode"
   - Clearnodes are gateways from blockchain to layer-3
   - Main duties: account record keeping, blockchain deposit and withdrawal using state-channels
   - Built with state-channel smart contracts (nitrolite) and clearnode golang microservices

2. **Applications built on layer-3** including:
   - **NeoDAX**: The prominent application for broker-to-broker trading
   - **Watchdogs**: Replicate states for participants and call challenges in case of disaster
   - **Oracles**: Off-chain price feeds and data providers using $YELLOW token subscription model
   - Other high-speed DeFi applications utilizing the virtual ledger

**Yellow Nodes:** [Jamstack](https://jamstack.org/), [Golang](https://go.dev/), [Next.js](https://nextjs.org/), [gRPC](https://grpc.io/)

## **The Broker Node** <a href="#id-88o83bna5dhs" id="id-88o83bna5dhs"></a>

The broker node is built with [NeoDAX™ WEB SDK](https://web-sdk.openware.com/?path=/story/getting-started--page), which offers reusable UI components for common exchange platform interfaces, including widgets.

All components come with a simple, modern design, and are customizable.

The library leverages React state management tools such as providers, hooks, and utils to connect to the [NeoDAX™ WEB SDK](https://web-sdk.openware.com/?path=/story/getting-started--page) for JavaScript and pass data to the UI layer, simplifying state synchronization.

Demo Version - [alpha.yellow.org](http://alpha.yellow.org/)

**Functionality**

1. MetaMask Sign In.
2. Deposit /Withdraw (custody contract).
3. Spot Trading (local node, network trading in progress).
4. Broker Admin Panel (Supabase Studio).

#### Modular Architecture

A great fit for exchange businesses allows deep customization.

* Worldwide accessible assets of any type.
* Secure, customizable, and easily localized.
* Ultra-high-speed performance.

## **Matching Engine**[**​**](https://www.yellow.org/docs/litepaper/product#matching-engine)

Each broker has its own matching engine, called _Finex,_ a high-performance trading engine of the [NeoDAX™ crypto exchange software stack](https://www.openware.com/product/neodax). It is written in GO language for high throughput of orders and trades. The _Finex_ engine is the core component of the trading platform. It accepts or rejects orders, adds them to the order book, processes trades when orders match, and keeps a persistent state in the database. It prevents users from spending more funds than are available on their balance.

Features supported in _Finex_ spot matching engine:

* **Bulk orders** to post or cancel many orders in a single request
* **Post-only order:**  advanced limit order which will not match immediately; it guarantees that it will be filled or canceled
* **Fill or kill order:** an advanced limit order which must be fully filled or gets automatically canceled
* **Stop-loss:** advanced market order used to buy or sell a specific asset once the market reaches the limit price. Once the predefined limit price is achieved, the system creates a spot market order.
* **Stop-limit:** advanced limit order used to buy or sell a specific asset at a predefined limit.  Contrary to the stop-loss order, a stop-limit order creates a limit order instead of buying the asset outright once the limit price is achieved.
* **API Rate limit**: a rate limiter configurable depending on user roles; it can be configured at the API server level and the trading engine level
* **Bi-directional WebSocket API**: allows end-users and brokers' bots to create and cancel orders and be notified about trades in real-time
* [**gRPC API** with JS and go libraries to speed up the development of bots](https://docs.openware.com/neodax/developers-guides/api-documentation/grpc-protocol)

## State Channel Technology <a href="#gxnel8rqtpbo" id="gxnel8rqtpbo"></a>

The state channel protocol keeps track of assets owned by brokers, without involving blockchains in trade operations, in an ultra-fast and secure manner.

The state channel technology creates a metadata index over the liquidity and digital assets on any blockchain, and can add liabilities to it.

Two brokers open a trading channel using state channel technology, to share liquidity and order books.

They deposit collateral in a smart contract called the adjudicator, which serves as an independent, neutral clearing house or intermediary; it also safeguards the collateral to ensure a fair outcome.

Brokers can close the trading channel or trigger a settlement process at any time to honor a withdrawal request by the end-user, or if the value of the underlying assets becomes unbalanced.

Brokers are required to lock $YELLOW tokens to open channels with other participants. Once a channel is closed any $YELLOW tokens can be unlocked 30 days after the last trade conducted on the trading channel.

[Read more about how we use state channel technology for our smart clearing protocol.](smart-clearing-protocol.md)

## Electronic Communication Network (ECN)

Yellow Network implements a mesh and decentralized ECN through its layer-3 virtual ledger infrastructure.

An electronic communication network (ECN) is a computerized system that automatically matches buy and sell orders for securities in the market. ECN trading is especially helpful when participants in different geographical areas wish to complete a secure transaction without the use of a third party.

The ECN aggregates the books of brokers and market makers in different locations through broker-to-broker connections. This leads to deeper liquidity and larger order books and thus a tighter bid-ask spread and faster order execution. Traders can get more attractive spreads and better order flow.

An additional benefit of the ECN's order aggregation is better price transparency for all participating brokers and market makers.

Using an ECN counters market fragmentation issues, while maintaining the decentralization aspect of the crypto trading market. The most advanced state-channel protocols are used between NeoDAX nodes and other backend servers, allowing instant, real-time PNL margin confirmation, which provides access to on-chain margin collateral at any given disaster event.

_\[INSERT: ECN Deal Flow Graphic (in preparation)]_

ECN provides brokers access to global financial markets; the Yellow Network protocol forms a decentralized ECN for digital assets through its layer-3 infrastructure and NeoDAX applications.

## <a href="#o8p3zt8mxh94" id="o8p3zt8mxh94"></a>
