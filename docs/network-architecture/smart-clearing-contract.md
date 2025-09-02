# Smart Clearing Protocol

### Overview

Yellow Network smart clearing protocol is a set of automated smart contracts and services, that allow Brokers to exchange assets by storing off-chain liabilities and periodically settle those liabilities on-chain.

Liabilities are secured by the [state channels technology](smart-clearing-contract.md#state-channel-protocol) and backed by a [collateral](smart-clearing-contract.md#collateral), acting as an insurance fund for each broker.

Those liabilities allow brokers to perform high frequency trading of on-chain assets, by removing the need of moving those assets at every transaction.

Yellow Network smart clearing protocol takes care of brokers collateralization level and risk of active liabilities by taking into account live market conditions. If anything goes wrong during exchanges, state channel [Adjudicator](smart-clearing-contract.md#adjudicator-smart-contract) will allow quick and easy resolution of the issue.

A [settlement](smart-clearing-contract.md#settlement) mechanism is used to clear/reduce liabilities of a broker, by moving funds between custodians.

![General overview of Yellow Network Clearing Protocol](/img/placeholder.svg)

### Network access

To join the Yellow Network, the broker needs to stake a minimum amount of 250,000 $YELLOW tokens. This allows him to create 4 peer-to-peer trading channels and access the liquidity pool of those 4 peers.

Sample bellow:&#x20;

| $YELLOW token staked | Opened state channels |
| -------------------- | --------------------- |
| 250,000              | 4                     |
| 500,000              | 8                     |
| 1,000,000            | 16                    |

To unstake his funds a broker needs to close open trading channels, request the funds withdrawals and **wait for 30 days** for funds to be available.

### Collateral

Before opening a trading channel, brokers agree on a collateral amount to deposit on the channel. Those funds are used to reduce the risks of the trades between the two brokers, it might be used in case of dispute to compensate a good faith broker against a malicious one.

#### Trading liabilities

The state of the trading channel contains the liabilities that one broker owes to the other.

Considering the following trades:

* Broker A buys 1 BTC for 50,000$ to the Broker B
* Broker B buys 10 ETH for 30,000$ to the Broker A

Liabilities will be the following:

| Currency | Broker A    | Broker B |
| -------- | ----------- | -------- |
| ETH      | 10 ETH      |          |
| BTC      |             | 1 BTC    |
| USDC     | 20,000 USDC |          |

Considering the price of those assets didn't move until now the estimated value in USD would be the following:



| Currency  | Broker A    | Broker B    |
| --------- | ----------- | ----------- |
| ETH       | $30,000     |             |
| BTC       |             | $50,000     |
| USDC      | $20,000     |             |
| **Total** | **$50,000** | **$50,000** |

In this situation liabilities are balanced.

Now let's consider BTC price raises by 5% to $52,500 and ETH raises by 10% to $3,300, the estimated liabilities value in USD would become:



| Currency  | Broker A    | Broker B    |
| --------- | ----------- | ----------- |
| ETH       | $33,000     |             |
| BTC       |             | $52,500     |
| USDC      | $20,000     |             |
| **Total** | **$53,000** | **$52,500** |

In this situation liabilities are unbalanced, Broker A owes 500$ more of asset to Broker B. As long as the collateral locked by both brokers is higher to this amount, the Broker B position is not at any risk.

In the last example we can see that a small collateral can be used to cover a relatively large amount of trades even in the case of a significant market movement.

#### Collateral thresholds

Brokers are responsible of monitoring the balance of liabilities and making sure the difference doesn't exceed the collateral of the other broker.

Actions can be configured on the following thresholds:

| Threshold                         | Action                                                                     |
| --------------------------------- | -------------------------------------------------------------------------- |
| Higher than 80% of the collateral | Trigger a settlement of the liabilities                                    |
| Higher than 95% of the collateral | Disconnect the orderbooks streaming to ensure no more trades are performed |

Those thresholds and mechanisms are not enforced by the protocol, the values can be different for each broker. Tweaking those parameters makes the broker settle more often or be more exposed to the market prices changes.

### State channel protocol

#### Overview

State channels allow a fast direct communication between two participants with trust-less off-chain state manipulation. Each state change (transition) in the channel is signed by all participants.

A state transition consist of updates of participants liabilities. Basically when participants want to exchange assets, liabilities on both sides will be produced to represent this exchange.

Here is an example of a network trade between two brokers:

* **Broker A** buy `1 BTC` for `30,000 USDC` to **Broker B**\
  Two liabilities will be added to the channel state
* **Broker A** liability to **Broker B**: `30,000 USDC`\
  It means that **Broker A** will have to give `30,000 USDC` to **Broker B**, at settlement time
* **Broker B** liability to Broker A: `1 BTC`\
  It means that **Broker B** will have to give `1 BTC` to **Broker A**, at settlement time

#### State definition

Channel's state definition, as seen in [Overview](smart-clearing-contract.md#overview), contains liabilities held between each participants of the channel.

This mean that at any point in time, each participant knows how much liabilities they have, in which asset, and to whom these liabilities have to be [settle](smart-clearing-contract.md#settlement).

#### Adjudicator smart contract

The state channel smart contract is called the Adjudicator. His role is to hold [collateral ](smart-clearing-contract.md#collateral)of each participant of the channel, while it is open.

If any state transition leads to an invalid state, the smart contract is able to resolve the issue (called Dispute) and use the locked collateral as insurance.

In case of a [settlement ](smart-clearing-contract.md#settlement)issue, the Adjudicator is also able to manage collateral to overcome the dispute.

#### Create a channel

A channel creation consists of two phases:

* **Pre-fund stage**\
  Each participant agrees on how much collateral he will lock into the channel.\
  When all participant agreed, they lock the collateral on the [Adjudicator](smart-clearing-contract.md#adjudicator-smart-contract) smart contract.
* **Post fund stage**\
  When each participant have locked its collateral on-chain, the channel is now considered opened, and is ready to receive state update by any of the participant.

#### Close a channel

Closing a state channel is done by producing a **final** state transition, allowing each participant to see their [collateral ](smart-clearing-contract.md#collateral)being unlocked (if no dispute is in progress).

Note that a channel closing will force a [settlement ](smart-clearing-contract.md#settlement-trigger)to clear participant liabilities.

### Settlement

Settlement is the act of clearing each state channel participant liabilities.

Clearing/Reducing liabilities of participants, is achieved by moving funds between each participant [custodians](custody-layer.md).

The settlement is an atomic, multi-chain and multi-asset transfer process.

#### Settlement trigger

A settlement may be triggered manually (allowing a broker to reduce his collateral usage) or automatically.

Reasons to trigger a automatic settlement:

* [Closing a state channel](smart-clearing-contract.md#close-a-channel)&#x20;
* The risk is considered too high by a participant node
* A user request a withdrawal of an asset which is not in the broker custody but still in a trading channel liabilities

#### Hash Time Locked Contracts (HTLC)

Settlement is processed using a set of Hash Time lock contracts.

A hash time locked contract (HTLC) is a type of smart contract used to ensure a transfer between two parties is performed before an expiration time or allow a rollback and payer to be refunded. It allows two parties to perform an atomic swap without a third party.

Using HTLC a settlement process can move funds from one broker custody to another atomically  and on multiple blockchains.

This technology was introduced first in Bitcoin and is compatible with all blockchains.

See also: [https://en.bitcoin.it/wiki/Hash\_Time\_Locked\_Contracts](https://en.bitcoin.it/wiki/Hash\_Time\_Locked\_Contracts)

