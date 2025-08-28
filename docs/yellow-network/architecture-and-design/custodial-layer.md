# Custodial Layer

{% hint style="info" %}
[NextSupported Technologies](https://app.gitbook.com/o/QctDSNMsySynj5wfSI1z/s/XSYwcbHANS5peGYWN1S6/~/changes/29zaX9vxbByRsicxZH9K/yellow-network/architecture-and-design/supported-technologies) At this stage, Yellow Network does not provide any in-house custodial solution, neither centralized nor decentralized. This means that participating brokers are responsible to provide their own custody solutions.

However, we are aware of the need for decentralized custodial solutions and plan to address this issue in the near future.&#x20;
{% endhint %}

The Yellow Network Smart Clearing Protocol does not custody assets of participating brokers except for:

1. [Network access collateral.](smart-clearing-protocol.md#network-access-collateral) Stacked Yellow Tokens which brokers lock with the Yellow Network protocol in order to gain access to state channels.
2. [Trading collateral.](smart-clearing-protocol.md#trading-collateral) Assets locked in the smart contracts between participating brokers to secure trading.

Yellow Network will have access to the Network Access Collateral and Trading Collateral for risk management purposes in the case of a dispute between brokers.&#x20;

### Flexible Architecture

The custodian solution used by a broker is independent of Yellow Network. It comes with only a few mandatory requirements to integrate a new custody provider.

At this stage we plan to integrate the following third-party custody solutions:

* [Qredo](https://www.qredo.com/)
* [Gnosis safe](https://gnosis-safe.io/)
* [Cobo](https://cobo.com/)
* [Fireblocks](https://www.fireblocks.com/)

Technically, any custodial solution can be supported by Yellow Network, and we plan to expand our offer continuously. [Contact](broken-reference) our sales and development team for specific requests.&#x20;

### Multi-Chain

Most custody solutions support a growing list of blockchains; we plan to leverage third-party custodial solutions to continuously grow the number of supported blockchains in Yellow Network. However, support of a native wallet solution is still possible, meaning that communication with the blockchain happens directly through the blockchain node, rather than a third-party service. This is achieved through a smart contract that secures withdrawals through a multi-signature process.

### Multi-Signature Withdrawals

To withdraw funds, the custodian requires a signature from the user, the broker, and a third party.

A third-party service is used to verify several factors before processing a user withdrawal. This party is independent of the user and the broker. It prevents users from malicious brokers withdrawing funds on their behalf.

We allow users to configure a combination of third-party verification methods to allow a withdrawal:

* 2FA (SMS, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2\&hl=en\&gl=US), [YubiKey](https://www.yubico.com/products/yubikey-5-overview/))
* Email verification

