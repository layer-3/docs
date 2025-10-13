---
description: How Yellow Network operates
---

# Smart Clearing Protocol

Despite the stakeholders in crypto being slightly different from a [clearing house in traditional finance](../about/related-work/traditional-finance.md), the introduction of an independent Layer-3 smart clearing protocol helps to mitigate the problems of:

Market fragmentation by connecting smaller brokers, market makers, and exchanges; cross-chain and cross-network.

Market depth & liquidity by aggregating liquidity and order flow between all participants.

Conflict of interest whereby many traditional crypto exchanges not only act as a marketplace but at the same time act as market makers, liquidity providers, and custodians.

Introducing a dedicated smart clearing protocol will de-risk the existing landscape and open the market for new participants while simultaneously comforting regulators.

Liquidity aggregation helps smaller, specialized exchanges and brokers to offer better pricing and handle larger trade volumes.

Clients from large exchanges can trade additional token pairings for which they otherwise would have to move custodied assets.

By holding margin accounts with the clearing house, brokers and exchanges can use margin netting to allow for more efficient use of capital.

This greatly reduces the risk of overexposure and helps to streamline liquidity management and capital efficiency.

The Clearing Protocol can accurately report order flow data to regulators. This lowers the reporting burden for traders and brokers while simultaneously increasing the marketplace's safety and transparency, and helping to identify and exclude bad actors.

![The Yellow Network brings these functionalities using cutting-edge state channel technology and settlement via smart contracts.](/img/placeholder.png)

## Protocol Overview

The Yellow Network smart clearing protocol is a set of automated smart contracts and services allowing brokers to exchange assets by storing off-chain liabilities and periodically settling those liabilities on-chain.

Liabilities are secured by [state channel technology](smart-clearing-protocol.md#state-channel-protocol) and backed by [collateral](risk-management.md#collateral), acting as an insurance fund for each broker.

This allows brokers to perform high-frequency trading of on-chain assets by removing the need to move those assets at every transaction.

The Yellow Network smart clearing protocol takes care of brokers' collateralization levels and liability risk management in real time. If anything goes wrong during an exchange, the state channel [adjudicator](smart-clearing-protocol.md#adjudicator-smart-contract) will allow the quick and easy resolution of the issue.

A [settlement](smart-clearing-protocol.md#settlement) mechanism is used to clear/reduce the liabilities of a broker by moving funds between custodians.

![General overview of Yellow Network Clearing Protocol](/img/placeholder.png)

## State Channels

#### Logic

State channels allow for fast, direct communication between two participants with trustless off-chain state manipulation. All participants sign each state change (transition) in the channel.

A state transition consists of updates of a participant's liabilities; i.e., when one participant exchanges an asset, liabilities on both sides are created, representing this exchange.

Here is an example of how the state channel captures a trade between two brokers:

* Broker A buys `1 BTC` for `30,000 USDC` from Broker B\
  Two liabilities will be added to the channel state
  * Liability 1: Broker A liability to Broker B: `30,000 USDC`\
    It means that Broker A will have to give `30,000 USDC` to Broker B at settlement time
  * Liability 2: Broker B liability to Broker A: `1 BTC`\
    It means that Broker B will have to give `1 BTC` to Broker A at settlement time

#### State Definition

A state channel's definition, as seen in the [overview,](smart-clearing-protocol.md#protocol-overview) contains liabilities held between two participants.

This means that, at any point in time, each participant knows what liabilities they have, in which asset, and with whom these liabilities have to be [settled](smart-clearing-protocol.md#settlement).

#### Adjudicator Smart Contract

The state channel smart contract is called the adjudicator. Its role is to hold the [collateral](risk-management.md#collateral) of each participant while the channel is open.

If any transaction leads to an invalid state, the smart contract resolves the issue (dispute) and uses the locked collateral as insurance.

In case of a [settlement ](smart-clearing-protocol.md#settlement)issue, the adjudicator is also able to manage collateral to overcome the dispute.

#### Channel Creation

A channel creation consists of two phases:

* **Pre-funding stage**\
  Each participant agrees on how much collateral he will lock in the channel.\
  When both participants agree on the collateral amount, they lock the collateral in the [adjudicator](smart-clearing-protocol.md#adjudicator-smart-contract) smart contract.
* **Post-funding stage**\
  After the collateral of both participants is locked on-chain, the channel is considered open and ready to receive state updates by either participant.

#### Channel Closing

Closing a state channel is done by producing a final state transition. This will cause an automatic [settlement](smart-clearing-protocol.md#settlement) of all open positions, clear liabilities, and allow each participant to see their [collateral](risk-management.md#collateral) being unlocked (if no dispute is in progress).



## Settlement

Settlement is the act of clearing each state channel participant's liabilities.

Clearing or reducing the liabilities of participants is achieved by moving funds between each participant's [custodian](custodial-layer.md).

The settlement is an atomic, multi-chain, and multi-asset transfer process which is written on the respective blockchains.

#### Settlement trigger

A settlement may be triggered manually (allowing a broker to reduce his collateral usage) or automatically at 0.00 am UTC.

Situations that trigger a settlement:

* [Closing a state channel](smart-clearing-protocol.md#close-a-channel).
* Automated daily settlement at 0.00 am UTC.
* The risk exposure of open trades is considered too high by a participant node, i.e. the open net liabilities exceed the [collateral thresholds](risk-management.md#collateral-thresholds).
* An end-user requests a withdrawal of an asset that is not in the broker's custody but still in a trading channel's liabilities.

#### Hash Timelocked Contracts (HTLC)

Every settlement is processed using a set of hash timelocked contracts.

A hash timelocked contract (HTLC) is a smart contract used to ensure that a transfer between two parties, performed before an expiration time, allows a rollback and payer to be refunded. It allows two parties to perform an atomic swap without a third party.

Using an HTLC for the settlement process can move funds from one broker's custody to another on an atomic level and on multiple blockchains.

This technology was introduced first in Bitcoin and is compatible with all blockchains.

See also: [https://en.bitcoin.it/wiki/Hash\_Time\_Locked\_Contracts](https://en.bitcoin.it/wiki/Hash_Time_Locked_Contracts)

## Disputes

Disputes occur when participating brokers fail to meet their liabilities within Yellow Network. We divide disputes into two categories: State Channel Disputes and Settlement Disputes.

In the case of a dispute, trading activity on the channel in question is halted until the dispute is resolved.

### Settlement Disputes

A settlement dispute occurs when a broker cannot fulfill his obligation at the [time of settlement](smart-clearing-protocol.md#settlement-trigger). In this case, the smart clearing contract will access the deposited collateral to satisfy the settlement process.

After a settlement dispute is resolved, the broker has to ensure that he has sufficient fresh collateral before the state channel is reopened for activity.

### State Channel Disputes

A state channel dispute is triggered manually by a broker and signals an issue between the broker and the protocol; for example, when a broker discovers a bug in the smart clearing protocol.

State channel disputes trigger a halt of the trading channel and a manual intervention from the Yellow Network support team. If the dispute can be resolved the state channel is reopened for trading. If no solution is found the channel is closed and all open positions are reverted, using brokers' collateral if necessary.

