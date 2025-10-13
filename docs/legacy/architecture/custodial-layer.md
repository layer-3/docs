# Custodial Layer

:::info
At this stage, Yellow Network does not provide any in-house custodial solution, neither centralized nor decentralized. This means that participating brokers are responsible to provide their own custody solutions.

However, we are aware of the need for decentralized custodial solutions and plan to address this issue in the near future.
:::

## Broker Identity and Security

Brokers are identified by an ECDSA key-pair. They are recommended to use an MPC TSS (Multi-Party Computation Threshold Signature Scheme) custody solution such as the FROST protocol for example.

**A key security principle depends on the diversity of custody solutions and providers used by the brokers to ensure there is no central vulnerability to the network.** This distributed approach to custody enhances the overall security and resilience of the Yellow Network.

## Collateral Types

The Yellow Network Smart Clearing Protocol does not custody assets of participating brokers except for:

1. **Access collateral** - For accessing the layer-3 ledger layer. Participants lock $YELLOW tokens to gain access to the state channel infrastructure.
2. **Trading collateral** - Typically a stablecoin amount locked for a NeoDAX session, either from retail-to-broker or broker-to-broker trading.

All participants should have registered their public key and locked $YELLOW tokens. Yellow Network will have access to the collateral for risk management purposes in the case of a dispute between brokers.

### Flexible Architecture

The custodian solution used by a broker is independent of Yellow Network. It comes with only a few mandatory requirements to integrate a new custody provider.

At this stage we plan to integrate the following third-party custody solutions:

* [Qredo](https://www.qredo.com/)
* [Gnosis safe](https://gnosis-safe.io/)
* [Cobo](https://cobo.com/)
* [Fireblocks](https://www.fireblocks.com/)

Technically, any custodial solution can be supported by Yellow Network, and we plan to expand our offer continuously. [Contact](#) our sales and development team for specific requests.

### Multi-Chain

Most custody solutions support a growing list of blockchains; we plan to leverage third-party custodial solutions to continuously grow the number of supported blockchains in Yellow Network. However, support of a native wallet solution is still possible, meaning that communication with the blockchain happens directly through the blockchain node, rather than a third-party service. This is achieved through a smart contract that secures withdrawals through a multi-signature process.

### Multi-Signature Withdrawals

To withdraw funds, the custodian requires a signature from the user, the broker, and a third party.

A third-party service is used to verify several factors before processing a user withdrawal. This party is independent of the user and the broker. It prevents users from malicious brokers withdrawing funds on their behalf.

We allow users to configure a combination of third-party verification methods to allow a withdrawal:

* 2FA (SMS, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2\&hl=en\&gl=US), [YubiKey](https://www.yubico.com/products/yubikey-5-overview/))
* Email verification

