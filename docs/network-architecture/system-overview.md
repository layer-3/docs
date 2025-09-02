# System Overview

### The Product <a href="#_qrz16kmo4nrn" id="_qrz16kmo4nrn"></a>

### Overview[​](https://www.yellow.org/docs/litepaper/product#overview) <a href="#_9lqr4nsnpms7" id="_9lqr4nsnpms7"></a>

#### **The Broker Node** <a href="#_88o83bna5dhs" id="_88o83bna5dhs"></a>

Is built with OpenDAX™ WEB SDK which offers reusable UI components for common exchange platform interfaces, including widgets.

All components come with a simple, modern design and are customizable.

The library leverages React state management tools such as Providers, Hooks, and Utils to connect to the OpenDAX™ WEB SDK for JavaScript and pass data to the UI layer, simplifying state synchronization.

#### **Demo Version** <a href="#_thuljtxfvgkg" id="_thuljtxfvgkg"></a>

****[alpha.yellow.org](http://alpha.yellow.org/)

**Functionality**

1. MetaMask Sign In;
2. Deposit / Withdraw (custody contract);
3. Spot Trading (local node, network trading in progress);
4. Broker Admin Panel (Supabase Studio).

**Links**

* npm: [https://www.npmjs.com/package/@openware/opendax-web-sdk](https://www.npmjs.com/package/@openware/opendax-web-sdk)
* docs: [https://storybook-odax-master.v4.uat.opendax.app/?path=/story/getting-started--page](https://storybook-odax-master.v4.uat.opendax.app/?path=/story/getting-started--page)

#### Modular Architecture&#x20;

A great fit for exchange businesses, allows deep customization.

* Worldwide accessible assets of any type;
* Secure, customizable, and easily localized;
* Ultra-high-speed performance.

**Matching Engine\*\***[**​**](https://www.yellow.org/docs/litepaper/product#matching-engine)

Each broker has its own matching engine, called _Finex_ is a high performance trading engine of the [OpenDAX™ crypto exchange software stack](https://www.openware.com/product/opendax). It is written in GO language for high throughput of orders and trades. The _Finex_ engine is the core component of the trading platform. It accepts or rejects orders, adding them to the order book, processes trades when orders match, and keeps persistent state in database. It prevents users from spending more funds than available on their balance.

Features supported in _Finex_ spot matching engine:

* **Bulk orders** to post or cancel many orders in a single request
* **Post-only order** is an advanced limit order which will not match immediately, it guaranty that it will be maker or canceled
* **Fill or kill order** is an advanced limit order which must be fully matched or fully canceled
* **Stop-loss** is an advanced market order used to buy or sell a specific asset once the market reaches a certain price
* **Stop-limit** is an advanced limit order used to buy or sell a specific asset once the market reaches a certain price
* **API Rate limit**: a rate limiter configurable depending on user roles, it can be configured at the API server level and at the trading engine level
* **Bi-directional WebSocket API**: allows end-users and brokers' bots to create and cancel orders  and be notified about trades in real time
* ****[**gRPC API** with JS and go libraries to speed up the development of bots](https://docs.openware.com/opendax/developers-guides/api-documentation/grpc-protocol)

### State Channel Technology <a href="#_gxnel8rqtpbo" id="_gxnel8rqtpbo"></a>

The state channel protocol keeps track of assets owned by brokers without involving blockchains in trade operations in an ultra-fast and secure manner.

State-channel technology creates a metadata index over the liquidity and digital assets of any blockchain and can add liabilities to it.

Two brokers open a trading channel using state channel technology, to share liquidity and order books.

They deposit collateral in a smart contract called the Adjudicator, which serves as an independent, neutral clearing house or intermediary; it also safeguards the collateral to ensure a fair outcome.

Brokers can close the trading channel or trigger a settlement process at any time to honor a withdrawal request by the end-user, or if the value of assets becomes unbalanced.

$YELLOW tokens can be unlocked 30 days after the last trade conducted on the trading channel.

[Read more about smart clearing protocol](smart-clearing-contract.md)

#### Multi-Chain Support <a href="#_o8p3zt8mxh94" id="_o8p3zt8mxh94"></a>

_Pluggable custodians solutions:_

* [Qredo](https://www.qredo.com/)
* [Gnosis safe](https://gnosis-safe.io/)
* [Cobo](https://cobo.com/)
* [Fireblocks](https://www.fireblocks.com/)

**KYC (Know Your Customer)**

* End-user identity verification procedure is a standard process in the industry to avoid participating in money laundering and terrorism financing activities
* Each broker has the ability to change and integrate a specific KyC provider

**Blockchains**[**​**](https://www.yellow.org/docs/litepaper/product#blockchains)

List of supported blockchain networks:

* Ethereum
* Polygon
* Binance Smart Chain

List of networks to be supported later:

* Solana
* Polkadot

**Currencies and Supported**[**​**](https://www.yellow.org/docs/litepaper/product#currencies-and-markets-supported) **Markets**

* The list of supported currencies is independent for each broker. The broker has an ability to add currencies and appropriate markets at his own discretion from the Admin panel.
* P2P trading is available to brokers only for approved markets with assets matching from both sides.

**Decentralized Support**[**​**](https://www.yellow.org/docs/litepaper/product#decentralized-support)

* Each broker operates as an independent exchange and is free to provide customer care for his end-users.
* Best practice is to use Zendesk-like systems for operating activities ([ZenDesk](https://www.zendesk.com/), [FreshDesk](https://freshdesk.com/), ...)

### **Technologies Used and Created by Yellow** <a href="#_5c6uz4n9qot6" id="_5c6uz4n9qot6"></a>

**Yellow Network:** state channel; P2P network

**Yellow nodes:** [Jamstack](https://jamstack.org/), [Golang](https://go.dev/), [Next.js](https://nextjs.org/), [gRPC](https://grpc.io/)

![Technologies Used and Created by Yellow](/img/placeholder.png)
