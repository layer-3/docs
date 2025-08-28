---
description: The funding mechanism for Yellow Reserve Vault
---

# Clearing Fee

Fees are paid from the broker to the [Yellow Network Reserve Vault](../yellow-reserve-vault.md).

A Clearing Fee is due whenever broker positions are cleared or settled on Yellow Network. The fee is calculated as % of the settlement liability, converted into $YELLOW, and invoiced to each broker's dedicated $YELLOW spending wallet on settlement.



* The Clearing Fee is only applied to net cross-broker exchanged volume.
* There are dynamic fee levels with a floor fee that depends on the number of $YELLOW tokens stacked.
* The Clearing Fee is not for profit and funds the Yellow Reserve Vault.

<mark style="background-color:yellow;">**Clearing Fee=Net Settlement Liability calculated  in  $YELLOW x Clearing Fee (%)**</mark>

<table data-header-hidden><thead><tr><th width="162"></th><th></th></tr></thead><tbody><tr><td>Defined by</td><td>Yellow Network</td></tr><tr><td>Beneficiary</td><td>Yellow Network</td></tr><tr><td>Payment Ccy</td><td><a href="../usdyellow/tokenomics.md">$YELLOW</a></td></tr><tr><td>Periodicity</td><td>Periodicity: Calculated and paid on settlement <br>(min. every 24h, or on a  specific settlement request by the broker)</td></tr></tbody></table>

### **Clearing Fee Tiers**

| Broker Tier\* | $YELLOW Stacked | Clearing Fee |
| ------------- | --------------- | ------------ |
| 4 channels    | 250.000         | 100 bps      |
| 8 channels    | 500.000         | 80 bps       |
| 16 channels   | 1.000.000       | 40 bps       |
| 32 channels   | 2.000.000       | 20 bps       |
| 64 channels   | 4.000.000       | 10 bps       |

_\*The applicable Broker Tier is defined at the beginning of each clearing cycle. Brokers can not move tiers during a clearing cycle._

_Note: All positions are subject to a daily clearing at 0.00 am UCT. Brokers must ensure a sufficient $YELLOW token balance (as outlined in the Risk Management Section) to cover any outstanding Clearing Fees. Failure to meet the clearing fee payment will prevent the broker from engaging in new positions until the payment for the previous cycle is satisfied._
