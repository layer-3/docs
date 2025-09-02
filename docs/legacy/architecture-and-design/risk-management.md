---
description: Enhancing trust and providing security
---

# Risk Management

Applying a simple yet effective risk management system is key to maintaining stability, transparency, and trust.&#x20;

Yellow Network manages risks by requiring participating brokers to deposit collateral, providing an automated dispute resolution via smart contract, and with the ability to request manual intervention in the case of error detection.&#x20;

## Collateral

P2P trading is secured through collateral deposited by brokers. There are two types of collateral that have to be provided:

* [Network access collateral:](risk-management.md#network-access-collateral) required to open state channels and become an accredited Yellow Network participant. It acts as a last resort for disputes between brokers.&#x20;
* [Trading collateral:](risk-management.md#trading-collateral) agreed on a P2P level when a state channel is opened. Secures day-to-day trading activities between brokers and prevents overexposure. It acts as the first line of defense in disputes between brokers.&#x20;

### Network Access Collateral

The Network Access Collateral is the gateway to becoming an accredited participant of Yellow Network and requires $YELLOW tokens.&#x20;

To join Yellow Network, brokers must lock a minimum amount of 250,000 $YELLOW tokens. This allows them to create peer-to-peer trading channels and access the liquidity pool of those peers.

The more $YELLOW a participant locks in, the more state channels can be opened.&#x20;

Sample below:&#x20;

<table><thead><tr><th width="236">$YELLOW Stacked</th><th>Opened state channels</th></tr></thead><tbody><tr><td>250.000</td><td>4</td></tr><tr><td>500.000</td><td>8</td></tr><tr><td>1.000.000</td><td>16</td></tr><tr><td>2.000.000</td><td>32</td></tr><tr><td>4.000.000</td><td>64</td></tr></tbody></table>

To unstack funds, a broker needs to close open trading channels and request a withdrawal. There is a 30-day lockup period for funds post the withdrawal request in order to account for any post-transaction claims.

In case of disputes, the [adjudicator](smart-clearing-protocol.md#adjudicator-smart-contract) can access the network access collateral.

### Trading Collateral

When opening a trading channel with another broker,  both parties agree on a collateral amount to deposit on the channel. Those funds are used to reduce the risks of the trades between the two brokers, and prevent overexposure. Trading collateral also acts as first line of defense in case of dispute.&#x20;

#### Example

The state of the trading channel contains the liabilities that one broker owes to the other.

Considering the following trades:

* Broker A buys 1 BTC for 50,000$ from Broker B
* Broker B buys 10 ETH for 30,000$ from Broker A

These trades lead to the following liabilities between the two brokers:&#x20;

| Currency               | Broker A       | Broker B       |
| ---------------------- | -------------- | -------------- |
| ETH                    | 10 ETH (@ $3k) |                |
| BTC                    |                | 1 BTC (@ $50k) |
| USD                    | $20,000        |                |
| Total Liability in USD | $50,000        | $50,000        |

Now let's consider BTC price raises by 5% to $52,500 and ETH raises by 10% to $3,300. The estimated liabilities value in USD would become:

| Currency | Broker A         | Broker B         |
| -------- | ---------------- | ---------------- |
| ETH      | 10 ETH (@ $3.3k) |                  |
| BTC      |                  | 1 BTC (@ $52.5k) |
| USDC     | $20,000          |                  |
| Total    | $53,000          | $52,500          |

In this situation liabilities are unbalanced; Broker A owes 500$ more in assets to Broker B. As long as the collateral locked by both brokers is higher than this amount, Broker B's position is not at any risk.

In the last example, we can see that a small amount of collateral can be used to cover a relatively large number of trades even in the case of a significant market movement.

#### Collateral thresholds

Brokers are responsible for monitoring the balance of liabilities and ensuring the difference doesn't exceed the collateral of the other broker.

Actions can be configured at the following thresholds:

| Threshold                         | Action                                                                      |
| --------------------------------- | --------------------------------------------------------------------------- |
| Higher than 80% of the collateral | Trigger a settlement of the liabilities                                     |
| Higher than 95% of the collateral | Disconnect the order books streaming to ensure no more trades are performed |

## Disputes

Disputes occur when participating brokers fail to meet their liabilities within Yellow Network. We divide disputes into two categories: State Channel Disputes and Settlement Disputes.&#x20;

In the case of a dispute, trading activity on the channel in question is halted until the dispute is resolved.&#x20;

### Settlement Disputes

A settlement dispute occurs when a broker cannot fulfill his obligation at the [time of settlement](smart-clearing-protocol.md#settlement-trigger). In this case, the smart clearing contract will access the deposited collateral to satisfy the settlement process.

After a settlement dispute is resolved, the broker has to ensure that he has sufficient fresh [collateral](risk-management.md#collateral) before the state channel is reopened for activity.&#x20;

### State Channel Disputes

A State Channel Dispute is triggered manually by a broker and signals an issue between the broker and the protocol. For example, when a broker discovers a bug in the smart clearing protocol.&#x20;

State Channel Disputes trigger a halt of the trading channel and a manual intervention from the Yellow Network support team. If the dispute can be resolved the state channel is reopened for trading. If no solution is found, the channel is closed and all open positions are reverted, using brokers' collateral if necessary.&#x20;
