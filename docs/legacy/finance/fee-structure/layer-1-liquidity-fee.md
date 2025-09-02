# Layer 1 - Liquidity Fee

The Liquidity Fee is agreed upon between the brokers when opening a channel. The broker acting as a market maker will set receive the entirety (100%) of the fees paid by the broker acting as a market taker.

The Liquidity Fee is volume-based, calculated at position opening in % of the base currency of the market taker and added to, or subtracted from, the market taker's liability.

**Liquidity Fee=Trade Nominal in  Liability Ccy x Market Taker Fee (%)**

Broker Fees are due on settlement, directly charged to the market takers stablecoin wallet and transferred to the market maker.

**Defined by:**     Brokers when they establish a trading channel\
**Beneficiary:**     Market Making Broker\
**Payment Ccy:**   Liability Currency of Trade\
**Periodicity:**      Calculated on every trade and charged on the settlement at 0.00 am UTC
