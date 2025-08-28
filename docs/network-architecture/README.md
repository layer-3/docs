# Network Architecture

A mesh (peer-to-peer) network using state channels to unify blockchains, reaching every token locked on isolated networks without the need of bridging them. It is not a new blockchain. It is an independent network using the same principle as the Bitcoin lightning network to reach high performances and secure consensus.

The matching throughput averages to billions of messages per day, way faster than any combined Layer-1 and Layer-2 solutions available today.

Yellow Network is essentially an automated smart clearing house, similar to a manual one in traditional finance, allowing brokers to settle without any intermediary.

Brokers running on Yellow Network are non-custodial participants. This approach makes the business much more resilient to hacks, lowers maintenance costs, and simplifies the launching process.

All of Yellow order book transactions are open for audit and review, instead of being stored inside a single server of a centralized exchange platform without any accountability or transparency.

When a broker opens a trading channel, he agrees on the state of the order book and broadcasts updates to it.

We are combining multiple different blockchains without bridging them. Not bridging is good for architectural security, which minimizes asset movement and the risk of human errors and losses.

#### How P2P trading works

1. Brokers choose a Layer-1 EVM compatible blockchain to work on (e.g. Ethereum or Polygon) and lock collateral in stablecoin by deploying an [adjudicator smart contract](smart-clearing-contract.md#adjudicator-smart-contract). They make a smart contract call to ensure that the [state channel](smart-clearing-contract.md#state-channel-protocol) is open and funded by both parties.
2. A persistent connection to each broker is opened, enabling high-speed communication off-chain and allowing them to open thousands of positions: buy and sell any digital assets available in custody. All those trade liabilities are accumulating in the state channel.
3. When the amount of liabilities becomes significant relative to the collateral, any broker can reduce its size by requesting an automated settlement operation.
4. On-chain/off-chain settlement is executed, potentially on multiple blockchains [atomically using hash time lock](smart-clearing-contract.md#hash-time-lock-htl)

### **Security**

#### **For brokers**

* State channel technology alleviates the risks of hacks and token steals as the funds are in the smart contract of the trading channel or the wallet of an end-user. It is impossible to break into the Wallet without knowing the private key or without confirmation from both parties of the final status of the trade-channel.

#### **For end-users**

* Yellow network is non-custodial, end-users can deposit funds to the smart contract with a hard/software wallet. This resolves major end-users’ concerns about improper funds storage and safety of their assets.
* The security of the end-users’ funds is also ensured by the amount of collateral funds locked with Yellow tokens. As soon as any fraud or malicious activity affecting end-users’ funds is detected on the broker's side - the dispute system will ensure the return of assets to their rightful owners.
