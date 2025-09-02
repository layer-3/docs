# Design

Mesh network

### Network participants

#### Retail brokers

A small exchange, located on a specific country or region, comply with local regulations. In our network we define brokers as non-custodial business.

#### Market makers

Market makers are providing liquidity to the network, they create and maintain open orders to allow users to access to the best offers possible. They are getting fees from trades.

#### Exchanges

Exchanges are big players of the network, they usually target a global audience and are regulated in many different countries. They can list exclusive tokens to the network and bring some market makers. They can also manage themselves the platform custody. In short those actors are managing all roles of network participants, they don't absolutely need to connect to others brokers, still it can only be better for their customers to bring more liquidity and offers on markets.

#### Custodians

Custodians are in charge of holding customers funds securely. Additionally they allow the broker to easily connect to multiple blockchains, depending on their current supported blockchains.

We plan to support following custodians as a start:

* Qredo
* Cobo
* Fireblocks
* Gnosis safe (decentralized)

### System components

#### Network nodes

Network nodes are operated by brokers, they have local markets and their own connections to blockchains and custodians; they interconnect with different brokers to bring liquidity to their markets.

#### Adjudicator

The adjudicator is a smart contract used by brokers to validate a settlement, it verifies that the last state transition is valid and signed by both brokers. Being a smart contract ensure brokers rules transparency and they won't change over time without both parties to agree to upgrade to a newer version of the protocol.

#### Custodian

Custodian are responsible of holding users' funds securely. It can be an external provider or a smart contract. Custodian are using a set or rules to release funds, each technology can provide different set of features to increase the security of the funds and make sure the user requesting a withdrawal is the real initiator of the request and make sure he didn't performed any kind of fraud.

### Protocol

Yellow network allows brokers to peer liquidity from one to another. A broker peering with another broker on a market will display orders from the other broker in his orderbook, this extends his offering and increase the overall liquidity available for his users. When a user takes an offer coming from another broker, brokers exchange liabilities using state channel protocol to ensure both agree on the accounting change. Later a settlement process can be initiated by any broker to lower their risk and move partial or all funds owed from one to another.

#### Collateral

Both exchanges have to lock a collateral in order to guaranty they are solvable for the other peer. Different currencies can be used as collateral, a mix of stable coins and major crypto-currencies tokens is probably a good choice for the platform in order to keep a relative stability of this collateral value while the market swings.

#### B2B (Broker to Broker) liquidity channel

Brokers are using a state channel protocol \[@perun2] to keep track of assets owned from one broker to another. This technology allows a secure track of funds without the need of on-chain transaction for every trade. It makes the trading process between two brokers very fast and secure.

To open a state-channel, brokers need to agree on an amount of YELLOW tokens to be used as collateral. Once they have an agreement on the amount and they both deposited the tokens, the state-channel is active and they can start trading.

**State definition:**

| Field               | Protobuf type   | Description                                                                                                                                    |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| chain\_id           | uint64          | Identifier of the blockchain on which the application is deployed                                                                              |
| participants        | repeated string | Brokers addresses                                                                                                                              |
| channel\_nonce      | uint64          | Unique identifier of the channel for all participants                                                                                          |
| app\_definition     | string          | Address of the smart contract of the adjudicator application                                                                                   |
| challenge\_duration | uint64          |                                                                                                                                                |
| app\_data           | bytes           | See bellow the definition of the  app\_data for Yellow Network liquidity channel                                                               |
| outcome             | bytes           |                                                                                                                                                |
| turn\_num           | uint64          | Turn number, this number is incrementing at every turn, it allows to easily identify the latest version of a state                             |
| is\_final           | bool            | Once true and signed by all participant the channel is closed and the final outcome can be applied on the blockchain safely by any participant |

#### Remote order matching

When a user's order matches an order from a peer-broker, the platform will use the active state-channel with the peer to perform the trade and account the liabilities of one broker to another.

#### Settlement

Every once for a while brokers will perform a settlement process to finally transfer assets owns to each other. A settlement process can be triggered by any broker at any time. A broker can decide to settle if it needs some asset liquidity, to honor a withdrawal request for example. An other reason of triggering a settlement is the value of assets being hold from one to another getting unbalanced, if the difference of assets value between two brokers reach the value of the collateral it's getting urgent for one broker to trigger the settlement.

#### Multi-chain & Multi-custody support

The broker can connect to many custodians solutions, each custody solution have a different list of supported blockchains. The broker will benefit from supported blockchains of his custodies. Once connected to a custody, users will be able to deposit and withdraw funds from all supported blockchains.

#### Comparison

| Criteria         | Existing solutions                                                                  | Yellow Network                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Speed            | CEX: 50-450 ms<br/>DEX: 30-120 sec                                            | You have the lowest latency at any point on the globe: 10-50 ms                                     |
| Liquidity        | Fragmented and in competition for stacking                                          | Aggregated without locking requirements, you can mine trading fees without unstacking your Assets   |
| Cross-chain      | Using bridges, extremely high risk and slow                                         | Through layer-3 Virtualization, off-chain assets can remain in cold wallets but traded at low costs |
| Decentralization | CEX: Are centralized in a data center.<br/>DEX: Are located on a single chain | High, True Decentralization of business, data centers, and chains                                   |

Table: Benefits of solution
