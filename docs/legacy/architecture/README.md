# 📐 Architecture & Design

:::info
Yellow Network is a project in development. Not all solutions presented in the following (sub)sections are implemented at this stage. The current, and all subsequent sub-pages, are subject to change.

For more information, visit the [Roadmap](../about/roadmap.md)
:::

Yellow Network is using a mesh (peer-to-peer) network, using state channels to unify blockchains and reach tokens locked on isolated networks, without the need of bridging them. Our technology is not a new blockchain. It is an independent network using the same principle as the Bitcoin lightning network to reach high performance and secure consensus.

The matching throughput of Yellow Network allows for billions of messages per day, faster than any Layer-1 or Layer-2 solution available today.

Yellow Network is essentially an automated smart clearing house. Similar to the clearing houses found in traditional finance, it allows brokers to settle through a trusted intermediary, eliminating counterparty risk.

Brokers running on Yellow Network are non-custodial participants. This approach makes the business much more resilient to hacks, lowers maintenance costs, and simplifies the launching process.

All order book transactions are open for audit and review, instead of being stored inside a single server of a centralized exchange platform without any accountability or transparency.

When a broker opens a trading channel, he agrees on the state of the order book and broadcasts updates to it. When the channel is closed, positions are settled and written on the chain.

Through our state channel approach, we combine multiple different blockchains without bridging them. The absence of bridging improves architectural security, minimizing asset movement and the risk of human errors and losses.

#### How P2P trading works

1. Two brokers choose a Layer-1 EVM compatible blockchain to work on (e.g., Ethereum or Polygon) and lock collateral by deploying an [adjudicator smart contract](smart-clearing-protocol.md#adjudicator-smart-contract). They make a smart contract call to ensure that the [state channel](smart-clearing-protocol.md#state-channel-protocol) is open and funded by both parties.
2. A persistent connection between the two brokers is opened, enabling high-speed communication off-chain and allowing them to open thousands of positions in order to buy and sell any digital assets available in their custody. All those trade liabilities accumulate in the state channel without depending on the underlying blockchain.
3. When the amount of liabilities becomes significant relative to the collateral, any broker can trigger an ad-hoc settlement of open positions. Alternatively, Yellow Network automatically settles all open positions at 0:00 am UTC.
4. On-chain/off-chain settlement is executed simultaneously across all relevant blockchains [atomically using hash time lock](smart-clearing-protocol.md#hash-time-lock-htl).
