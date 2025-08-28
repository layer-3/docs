# Layer 2 - Clearing Fee

Fees that are paid from the broker to the Yellow Clearing House.

A Clearing Fee is due whenever Broker positions are cleared/settled on the Yellow Network. The fee is calculated as % of the settlement liability, converted into $YELLOW, and invoiced to each broker's dedicated $YELLOW spending wallet on settlement.

* The Clearing Fee is due whenever Broker positions are cleared/settled on the Yellow Network.
* The Clearing Fee is calculated as % of the settlement liability, converted into $YELLOW, and invoiced monthly to each broker's dedicated $YELLOW spending wallet.
* The Clearing Fee Fee is only applied to net cross-broker exchanged volume.
* The Clearing fees are defined by Yellow Clearing House, and 100% of it goes to the Clearing House.
* There are dynamic fee levels with a floor fee that depends on the number of $YELLOW tokens stacked.
* The Clearing Fee is not for profit and funds the Yellow Reserve Vault.

**Clearing Fee=Net Settlement Liability calculated  in  $YELLOW x Clearing Fee (%)**

**Defined by:**        Yellow Clearing House\
**Beneficiary:**      Yellow Clearing House\
**Payment Ccy:**    $YELLOW\
**Periodicity:**        Periodicity: Calculated and paid on settlement \
&#x20;                           (min. every 24h, or on a  specific settlement request by the Broker)

| Broker Tier\* | $YELLOW Stacked | Clearing Fee |
| ------------- | --------------- | ------------ |
| 4 channels    | 250.000         | 100 bps      |
| 8 channels    | 500.000         | 80 bps       |
| 16 channels   | 1.000.000       | 40 bps       |
| 32 channels   | 2.000.000       | 20 bps       |
| 64 channels   | 4.000.000       | 10 bps       |

_\*The applicable Broker Tier is defined at the beginning of each clearing cycle. Brokers can not move tiers during a clearing cycle._

_Note: All positions are subject to a daily clearing at 0.00 am UCT. Brokers must ensure a sufficient $YELLOW token balance (as outlined in the Risk Management Section) to cover any outstanding Clearing Fees. Failure to meet the clearing fee payment will prevent the Broker from engaging in new positions until the payment for the previous cycle is satisfied._
