# Custody Layer

{% hint style="info" %}
At this stage, the Yellow Network does not provide any in-house custodial solution, neither centralized nor decentralized. This means that participating brokers are responsible to provide their own custody solutions.

However, we are aware of the need for decentralized custodial solutions and plan to address this issue in the near future.&#x20;
{% endhint %}

### Flexible architecture

The custodian solution used by a broker is independent from the yellow network, few requirements are mandatory to integrate a new custody provider.

We plan to integrate in priority the following custody solutions:

* Yellow vault smart contract
* [Qredo](https://www.qredo.com/)
* [Gnosis safe](https://gnosis-safe.io/)
* [Cobo](https://cobo.com/)
* [Fireblocks](https://www.fireblocks.com/)

Potentially any custody can be supported by the network.

### Multi-chain

Most custody solutions are supporting a growing list of blockchains, we leverage custodian blockchains support to grow quickly the number of supported blockchains in the Yellow \
Network. However native support is still possible, for this we use a smart-contract which secure withdrawals with a multi-signature process.

### Multi-signature withdrawals

To withdraw funds the custody requires a signature from the user, the broker and a third party.

#### Third party signature

A third party service is used to verify several factors before processing a user withdrawal. This party is independent from the user and the broker. It prevents users from malicious brokers to withdraw funds on their behalf.

The service allows the user to configure a combination of factors to allow a withdrawal:

* 2FA (SMS, [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2\&hl=en\&gl=US), [YubiKey](https://www.yubico.com/products/yubikey-5-overview/))
* Email verification

