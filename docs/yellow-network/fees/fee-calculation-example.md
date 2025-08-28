---
description: A real-life calculation example for Layer-1 and Layer-2 fees
---

# Fee Calculation Example

#### Pre-Defined parameters (Assumptions)

* Liquidity Fee is charged at the end of each clearing cycle
* Clearing Fee is charged at the end of each clearing cycle
* Liquidity Fee as agreed between brokers is 0.01%&#x20;
* Price BTC/USDT = 20,000&#x20;
* Price $YELLOW/USDT = 10
* Transaction: Broker A buys 20 BTC vs. USDT from Broker B
* Agreed Liquidity Fee between brokers = 0.05%

**Broker A**

* Acts as Market Taker and is thus subject to **pay** the Liquidity Fee
* 4 open State Channels = 100 bps Clearing Fee
* Liability Broker A: 200,000 USDT (will have to settle/send USDT to Broker B)

#### Broker B

* Acts as Market Maker and is thus entitled to **receive** the Liquidity Fee
* 8 open State Channels = 80 bps Clearing Fee&#x20;
* Liability Broker B: 10 BTC (will have to settle/send BTC to Broker A)

**Fee Calculation**

* Liquidity Fee Broker A = 200,000 x 0.05% = 100 USDT
* Clearing Fee Broker A = 200,000 / 10 x 1% = 200 YELLOW
* Clearing Fee Broker B = 10 x 20,000 / 10 x 0.8% = 160 YELLOW

#### Settlement Amounts

| Currency | Broker A | Broker B |
| -------- | -------- | -------- |
| BTC      | +10      | -10      |
| USDT     | -200,100 | +200,100 |

#### Fee Payment Cash Flow

<table><thead><tr><th width="150">Type</th><th width="150">Broker A</th><th>Broker B</th><th>Period</th></tr></thead><tbody><tr><td>Liquidity Fee (L1)</td><td>-100 USDT</td><td>n/a</td><td>On Settlement</td></tr><tr><td>Clearing Fee (L2)</td><td>-200 $YELLOW</td><td>-160 $YELLOW</td><td>On Settlement</td></tr></tbody></table>

Broker A will receive a total of 10 BTC on settlement and pay a total of USDT 200,100. Yellow Network will receive a total of 360 $YELLOW for the Reserve Vault.

* The Liquidity Fee is charged automatically to the wallet of the Market Taker at the clearing.
* The Clearing Fee is automatically charged to the $YELLOW wallet of both brokers at the clearing.
