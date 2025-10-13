# Background

Cryptocurrency trading is now a reality witnessing a massive user adoption rate worldwide. Since Bitcoin, many alternative projects have been developed in the space. Users now have a broad choice of different blockchains and many decentralized applications. New challenges appear to simplify the users' journey in this wild wide web 3.0. Bridges are an example of technologies brought to interconnect blockchains but suffer from a lack of decentralization, an ERC20 native connection from one to another chain, and a need for significant liquidity for many tokens on every chain to satisfy the users' demand.

### Related Work

#### Centralized Exchange

**Security concerns**

Centralized exchanges are entirely in charge of the assets deposited by users, meaning users have to trust them to secure platform wallets correctly and process trades fairly. Big exchanges take security seriously and make significant investments to do so. However, we can still read news of hacked cryptocurrency exchanges and users' funds drained by attackers. Nevertheless, often smaller exchanges can not afford the cost of securing users' funds effectively.

**Support of blockchains**

For a centralized exchange to continue running, many operations are needed. We just mentioned the security aspect, which requires a dedicated team's full-time attention. The support of many blockchains is also complex and leads to high costs. Each of them needs to be explicitly monitored to ensure nodes and platform applications stay synchronized and process blocks in real-time. The load of some chains sometimes escalates quickly with the cost of transactions, leading to withdrawals not proceeding or doing so very slowly. Overall the gas price for withdrawal transactions and deposit processing might need adjusting frequently.

**Compliance**

Complying with local regulations can be challenging for exchanges. Small exchanges will probably prefer to target a single market and abide by a single regulator. Another common approach is registering the company in a country where it can operate without regulations. This solution exposes users to the platform operator's goodwill, regulation rules usually being made to protect customers.

**Market making & Access to liquidity**

Running an exchange with many markets imposes maintaining order books with tight spreads to provide the best offers possible to users. It also requires deep liquidity in the order book to avoid significant price moves in case of sporadic big demand in a market. Centralized exchanges usually delegate this duty to "market makers." This service can be costly, and the exchange might still have to provide a big part of the liquidity injected into the order book.

#### Uniswap

**Short history**

Uniswap is a decentralized exchange application launched in 2018 \[@uniswap-history]. It is the first DEX to gain significant traction on the Ethereum Mainnet by August 2020. Since then, many clones and other decentralized applications have been launched on many blockchains and used by millions of users to swap tokens, lend or borrow cryptocurrencies assets, bridge funds between blockchains, and many more use cases.

Uniswap paved the way for DeFi (Decentralized Finance).

**Security, Auditability**

It brought many advantages compared to centralized exchanges. The exchange software is fully implemented in smart contracts deployed on the blockchain. Thus anyone can read how it works. Independent parties perform many audits, and many DeFi applications are left with breaches, with funds exploited. However, over time the security of those applications tends to be proven.

**Automatic market making**

Anyone can provide liquidity to Uniswap markets (AKA pools) and receive a revenue share from fees collected during trading (AKA swaps). Moreover, the price of assets is managed automatically; every trade impacts the price up or down depending if it is an ask or a bid. Since version one, the protocol evolved to be more resilient in v2 and to use more effectively the liquidity in v3 \[@angeris2020improved].

Uniswap protocol provided an elegant solution to the problem of market making and access to liquidity.

**Performances**

The success of those applications has led to congestion in the Ethereum network, cost of transactions has been increasing, reaching unsustainable levels. DEXes and other DeFi applications are facing the limitation of blockchains throughput. Many projects claim to solve the problem of blockchain scalability, and some drastically improve the throughput of transactions like Polygon or Solana.

**Front running bots**

Transparency of blockchain transactions and the fact that Ethereum orders transactions by gas price expose users of DEXes to front-run bots. \[@daian2019flash].

Such bots are monitoring the blockchain and the in-memory transactions pool (containing transactions not yet mined in a block) for incoming swap transactions. They check the slippage tolerance allowed by the user and calculate the cost of front-running transactions. When profitable, they execute a transaction just before the user by setting a higher gas price, and finalize this transaction just after the user takes the profit.

**Comply with local regulations**

Decentralized applications are accessible by everyone on the planet in the same way, without any difference between users. This feature allows anyone to access cryptocurrency wallets and use those solutions; this is a powerful feature that gives access to people who can not open a bank account to cryptocurrencies and decentralized finance products.

Nevertheless, each country has specific regulations applied to financial products; thus, those fully open and restrictionless solutions often violate those rules.

#### Lightning Network \[@poon2016bitcoin]

The Lightning Network is a Layer-2 solution for the Bitcoin network. It was proposed as a solution to the scalability problem of the Bitcoin network. It leverages state channel technology to be used as a payment channel to perform any number of off-chain transactions. A payment channel is initiated by an on-chain funding transaction. Then it is followed by any number of off-chain transactions. Finally, to commit balances, a settlement transaction is performed on-chain. At the same time, the lightning network introduces real-time fund transfer in the blockchain. Yellow Network protocol leverages the same technology for high-frequency trading.

#### DyDx \[@juliano2017dydx]

[DyDx](https://whitepaper.dydx.exchange/) is a trading platform of derivatives markets. It combines the speed of a centralized order book and the transparency of decentralized applications. The result is a more secure and faster software architecture. The downside is that it is limited to Ethereum's users.

#### Qredo \[@mccuskerqredo]

[Qredo](https://www.qredo.com/qredo-white-paper.pdf) focuses on securing digital assets using MPC \[REFERENCE NEEDED], eliminating the sensitive private key from the signature computation. It also allows settlements by updating an internal ledger entry without costly transactions on the blockchain \[TO BE CONFIRMED]. While Qredo brings state-of-the-art security for digital assets, it doesn't facilitate high-frequency trading.

#### LayerZero

LayerZero provides an SDK that enables cross-chain transactions, but it requires modifying existing smart contracts and does not solve performance issues. It actually increases the number of transactions on already congested chains.

###
