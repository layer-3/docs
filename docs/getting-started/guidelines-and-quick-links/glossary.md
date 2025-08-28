---
description: >-
  Not familiar with a term or need further information? Look no further, welcome
  to the Glossary.
---

# 📚 Glossary

{% tabs %}
{% tab title="A" %}
[Adjudicator](glossary.md#undefined)

[Atomic Swap](glossary.md#undefined)

[Automated Market Making (AMM](glossary.md#automated-market-making)[)](glossary.md#automated-market-making)
{% endtab %}

{% tab title="B" %}
[Broker](glossary.md#broker)

[B2B (Broker to Broker) liquidity channel](glossary.md#b2b-broker-to-broker-liquidity-channel)
{% endtab %}

{% tab title="C" %}
[Centralized Exchange (CEX)](glossary.md#centralized-exchange-cex)

[Clearing / Smart Clearing](glossary.md#clearing)

[Collateral](glossary.md#collateral)

[Custodians](glossary.md#custodians)
{% endtab %}

{% tab title="D" %}
[Decentralized Exchange (DEX)](glossary.md#decentralized-exchange-dex)
{% endtab %}

{% tab title="E" %}
[Exchanges](glossary.md#exchanges)
{% endtab %}

{% tab title="F" %}
[FAQ](glossary.md#undefined-1)

[Fees](glossary.md#fees)
{% endtab %}

{% tab title="G" %}

{% endtab %}

{% tab title="H" %}
[Hash Time Locked Contract (HTLC)](glossary.md#undefined-1)

[High Frequency Trading (HFT)](glossary.md#high-frequency-trading-hft)
{% endtab %}

{% tab title="I" %}

{% endtab %}

{% tab title="J" %}

{% endtab %}

{% tab title="K" %}
[Know Your Customer (KYC)](glossary.md#know-your-customer-kyc)
{% endtab %}

{% tab title="L" %}
[Layer (0-3)](glossary.md#layer-1-3)

[Liquidity Aggregation](glossary.md#liquidity-aggregation)
{% endtab %}

{% tab title="M" %}
[Market Makers](glossary.md#market-makers)

[Multi-Chain & Multi-Custody Support](glossary.md#multi-chain-and-multi-custody-support)
{% endtab %}

{% tab title="N" %}
[Yellow Network](glossary.md#yellow-network)
{% endtab %}

{% tab title="O" %}
[OpenDAX](glossary.md#opendax)
{% endtab %}

{% tab title="P" %}
[Policies](glossary.md#policies)

[Protocol](glossary.md#protocol)
{% endtab %}

{% tab title="Q" %}

{% endtab %}

{% tab title="R" %}
[Remote Order Matching](glossary.md#remote-order-matching)

[Reserve Vault](glossary.md#undefined-1)

[Retail Broker](glossary.md#retail-brokers)
{% endtab %}

{% tab title="S" %}
[Settlement](glossary.md#settlement)

[State Channel](glossary.md#state-channel)
{% endtab %}

{% tab title="T" %}
[Tokenomics](glossary.md#tokenomics)

[Tiers](glossary.md#tiers)

[Trading Channel](glossary.md#trading-channel)
{% endtab %}

{% tab title="U" %}

{% endtab %}

{% tab title="V" %}

{% endtab %}

{% tab title="W" %}
[Whitepaper](glossary.md#whitepaper)
{% endtab %}

{% tab title="X" %}

{% endtab %}

{% tab title="Y" %}
[Whitepaper](glossary.md#whitepaper)[Whitepaper](glossary.md#whitepaper)
{% endtab %}

{% tab title="Z" %}

{% endtab %}
{% endtabs %}

## A

#### Adjudicator

Our state channel smart contract is called the [Adjudicator](../../yellow-network/architecture-and-design/smart-clearing-protocol.md#adjudicator-smart-contract). Its role is to hold the [collateral](../../yellow-network/architecture-and-design/risk-management.md#collateral) of each participant while the channel is open. In case of a [settlement ](glossary.md#settlement)issue, the Adjudicator is also able to manage collateral to overcome the dispute.

#### Atomic Swap

An [atomic swap](https://www.investopedia.com/terms/a/atomic-swaps.asp) is an exchange of cryptocurrencies from separate blockchains. The swap is conducted between two entities without a third party's involvement. The idea is to remove centralized intermediaries like regulated exchanges and give token owners total control.

#### Automated Market Making

[Automated market makers](https://www.gemini.com/cryptopedia/glossary#automated-market-maker-amm) (AMMs) allow digital assets to be traded without permission and automatically by using [liquidity pools](https://www.gemini.com/cryptopedia/glossary#liquidity-pool) instead of a traditional market of buyers and sellers. On a [traditional exchange platform](https://www.gemini.com/cryptopedia/centralized-exchanges-crypto), buyers and sellers offer up different prices for an asset.

## B

#### Broker

Cryptocurrency brokers can be a platform, firm, or individual that acts as an intermediary between the cryptocurrency markets and an end client and facilitates the buying and selling of cryptocurrencies. See also [Retail Broker.](glossary.md#retail-brokers)

#### B2B (Broker to Broker) Liquidity Channel

Brokers use a state channel protocol \[@perun2] to keep track of assets owned from one broker to another. This technology allows a secure track of funds without the need for on-chain transactions for every trade. It makes the trading process between two brokers fast and secure.

To open a state channel, brokers need to agree on a specific amount of YELLOW tokens to be used as collateral. Once they have an agreement on the amount and they both deposited the tokens, the state channel is activated and they can start trading.

| Field               | Protobuf Type   | Description                                                                                                                                     |
| ------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| chain\_id           | uint64          | Identifier of the blockchain on which the application is deployed                                                                               |
| participants        | repeated string | Brokers' addresses                                                                                                                              |
| channel\_nonce      | uint64          | Unique identifier of the channel for all participants                                                                                           |
| app\_definition     | string          | Address of the smart contract of the adjudicator application                                                                                    |
| challenge\_duration | uint64          |                                                                                                                                                 |
| app\_data           | bytes           | See below the definition of the app\_data for Yellow Network liquidity channel                                                                  |
| outcome             | bytes           |                                                                                                                                                 |
| turn\_num           | uint64          | Turn number: incrementing at every turn, this allows the easy identification of the latest version of a state                                   |
| is\_final           | bool            | Once true and signed by all participants the channel is closed and the final outcome can be applied on the blockchain safely by any participant |

####

## C

#### Centralized Exchange (CEX)

Centralized cryptocurrency exchanges act as an intermediary between a buyer and a seller and make money through commissions and transaction fees. Imagine a [CEX ](../../about/the-problem.md#centralized-exchanges-cex)as similar to a stock exchange but for digital assets. Generally, a [CEX ](../../about/the-problem.md#centralized-exchanges-cex)not only acts as a marketplace but also requires users to custody assets.&#x20;

#### Clearing / Smart Clearing

Clearing is the correct and timely transfer of funds to the seller and securities to the buyer.

[Smart Clearing](../../yellow-network/architecture-and-design/smart-clearing-protocol.md) is a term we derived from traditional finance. The "smart" component indicates that instead of a trusted intermediary, the clearing process is conducted by a fully automated digital protocol.&#x20;

#### Collateral

Brokers have to lock collateral in order to guarantee their solvency for the other peer.&#x20;

We define two types of collateral that have to be provided:&#x20;

* [Network Access Collateral:](glossary.md#network-access-collateral) required to open state channels and become an accredited Yellow Network participant. It acts as a last resort for disputes between brokers.&#x20;
* [Trading Collateral:](glossary.md#trading-collateral) Agreed on a P2P level when a state channel is opened. Secures day-to-day trading activities between brokers and prevents overexposure. It acts as the first line of defense in disputes between brokers.&#x20;

#### Custodians

[Custodians](../../yellow-network/architecture-and-design/custodial-layer.md) are in charge of holding customers' funds securely. They can be an external provider or a smart contract. Custodians use a set of rules to release funds, whereby each party can provide a different set of features to increase security and to make sure the user requesting a withdrawal is the real initiator of the request and free of fraud. Additionally, they allow the broker to easily connect to multiple blockchains, depending on their current supported blockchains.

## D

#### Decentralized Exchange (DEX)

A decentralized exchange is another type of exchange that allows peer-to-peer transactions directly from your digital wallet without going through an intermediary. Examples of [DEX](../../about/the-problem.md#decentralized-exchanges-dex)s include Uniswap, PancakeSwap, dYdX, and Kyber.

These decentralized exchanges rely on smart contracts, self-executing pieces of code on a blockchain. These smart contracts allow for more privacy and less slippage (another term for transaction costs) than a centralized cryptocurrency exchange.

## E

#### Exchanges

Exchanges are big players in the network; they usually target a global audience and are regulated in many different countries. They can list exclusive tokens to the network and bring in some market makers. They can also manage the platform custody. In short, those actors incorporate all the roles of network participants, thus they don't necessarily need to connect to other brokers. However, using Yellow Network can bring additional benefits for their customers, like better liquidity and additional token pairings.

## F

#### FAQ

[Here ](faq.md)you can find answers to the most frequently asked questions from our community.

#### Fees

Yellow Network will charge fees and reward participants based on their activity. However, fees are not charged for profit; all collected fees are either redistributed to network participants or used to fund the [Reserve Vault](../../yellow-network/yellow-reserve-vault.md).

The first layer [(Layer 1)](broken-reference) is a **Liquidity Fee**

The second layer [(Layer 2)](../../yellow-network/fees/clearing-fee.md) is a **Clearing Fee**

## G

## H

#### Hash Time Lock Contract (HTLC)

The term [Hashed Time Lock Contract (HTLC)](https://academy.binance.com/en/glossary/hashed-timelock-contract) refers to a special feature used to create [smart contracts](https://academy.binance.com/en/glossary/smart-contract) that are able to modify payment channels. Technically, the HTLC feature enables the implementation of time-bound transactions between two users. In practice, the recipient of a HTLC transaction has to acknowledge the payment by submitting a cryptographic proof within a specified timeframe (number of blocks). If the recipient forfeits or fails to claim the payment, the funds will be returned to the original sender.

At Yellow Network we use [HTLC ](../../yellow-network/architecture-and-design/#how-p2p-trading-works)to settle trades off-chain.&#x20;

#### High Frequency Trading (HFT)

High-frequency trading, also known as HFT, is a method of trading that uses powerful computer programs to transact a large number of orders in fractions of a second. It uses complex [algorithms](https://www.investopedia.com/terms/a/algorithm.asp) to analyze multiple markets and execute orders based on market conditions.

## I&#x20;

## J&#x20;

## K

#### Know Your Customer (KYC)

Know Your Customer (KYC) is a standard in the investment industry that ensures [advisors](https://www.investopedia.com/terms/f/financial-advisor.asp) can verify a client's identity and know their client's investment knowledge and financial profile. For participants in Yellow Network, the end-user[ KYC](../../yellow-network/architecture-and-design/supported-technologies.md#kyc-know-your-customer) is the responsibility of each broker. Yellow Network will allow brokers to integrate their own third-party KYC provider.

## L&#x20;

#### Layer (0-3)

Layers in the blockchain space refer to scaling solutions that aim to solve the trilemma of Decentralization, Security, and Scalability.&#x20;

Layer-0 = Technical components (Hardware, Internet, etc.)

Layer-1 = Foundation layer and main blockchain (e.g. Bitcoin, Ethereum)

Layer-2 = Overlapping networks on Layer-1 to increase scalability (e.g. Bitcoin Lightning Network)

Layer-3 = Application layer, acts as user interface (UI)

#### Liquidity Aggregation

Liquidity aggregation refers to technology that allows participants to simultaneously obtain streamed prices from several liquidity providers/pools.

## M&#x20;

#### Market Makers

Market makers provide liquidity to the network, and create and maintain open orders to allow users to access the best offers possible. They receive fees from trades.

#### Multi-Chain & Multi-Custody Support

A broker may connect to multiple custody solutions, whereby each solution has a different list of supported blockchains. Brokers benefit from the supported blockchains of their custodians. Once a broker is connected to multiple custodians, end-users will be able to deposit and withdraw funds from all supported blockchains.

## N

#### Yellow Network

Yellow Network embodies a decentralized Layer-3 peer-to-peer mesh network allowing brokers to communicate, trade, and aggregate the liquidity of connected nodes.

## O

#### OpenDAX

[OpenDAX™](https://www.openware.com/product/opendax) cryptocurrency exchange software is a modular platform for building crypto exchanges, NFT marketplaces, and digital banking with built-in liquidity.

## P

#### Policies

Our policies set the foundation of our work and are readily available to everyone. They can be found under the [Legal](broken-reference) section.&#x20;

#### Protocol

Yellow Network allows brokers to pair liquidity from one to another. A broker pairing with another broker in the market will display orders from the counterparty in his own order book. This extends the broker's offering and increases the overall liquidity available to his users. When a user takes an offer coming from another broker, brokers exchange liabilities using the state channel protocol to ensure both agree on the accounting change. Later a settlement process is initiated by either broker to lower their risk and move owed funds from one to the other.

## Q

## R

#### Remote Order Matching

When a user's order matches an order from a peer-broker, the platform will use the active state-channel with the peer to perform the trade and account the liabilities of one broker to another.

#### Reserve Vault

The [Yellow Reserve Vault](../../yellow-network/yellow-reserve-vault.md) is our treasury entity and is tasked with two main responsibilities:

1. To provide stability for the [$YELLOW](glossary.md#usdyellow) token
2. To build a diversified currency reserve to resolve settlement disputes between brokers.

#### Retail Brokers

A small exchange located in a specific country or region that complies with local regulations. In our network, we define brokers as non-custodial businesses.

## S

#### Settlement

Yellow Network initiates a daily automatic settlement at 0:00 UTC. The settlement process can also be triggered by a broker at any time (ad-hoc); for example, if the broker requires liquidity to honor a withdrawal request from an end-user.&#x20;

If a broker's position has insufficient collateral he will be prevented from further B2B trades. Frequent broker-initiated settlements can prevent that situation.&#x20;

#### State Channel

[State channels](https://ethereum.org/en/developers/docs/scaling/state-channels/) refer to the process in which users transact with one another directly outside of the blockchain, or "off-chain," and greatly minimizes their use of "on-chain" operations.

## T

#### Tokenomics

Tokenomics is a term that captures a token’s economics. It describes the factors that impact a token’s use and value, including but not limited to the token’s creation and distribution, supply and demand, incentive mechanisms, and token burn schedules. You can find the Yellow Network Tokenomics [here](../../yellow-network/usdyellow/tokenomics.md).&#x20;

#### Tiers

Tiers are used to define the number of [trading channels](glossary.md#trading-channel) a participant can use. Tiers are based on the number of [$YELLOW](glossary.md#usdyellow) the participant locks with the [Yellow Network](glossary.md#yellow-network). Tiers are also used to determine the applicable [fee layer](glossary.md#fees) of a participant.&#x20;

#### Trading Channel

Participating brokers and liquidity providers can open trading channels to use and share liquidity with others. Opening trading channels requires [$YELLOW](glossary.md#usdyellow) tokens and the use of channels is subject to a [clearing fee](glossary.md#fees).&#x20;

## U

## V

## W

#### Whitepaper

A whitepaper is an informational document issued by a company or [not-for-profit ](https://www.investopedia.com/terms/n/not-for-profit.asp)organization to promote or highlight the features of a solution, product, or service that it offers or plans to offer. Our Whitepaper can be found [here](../../docs-hub/whitepaper.md).&#x20;

## X

## Y

#### $YELLOW

[$YELLOW](../../yellow-network/usdyellow/) is our ERC-20 token. The use of Yellow Network requires participants to hold $YELLOW.&#x20;

## Z
