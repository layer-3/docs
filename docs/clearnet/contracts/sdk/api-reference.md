---
title: "SDK API Reference"
description: "All exports: ABIs, addresses, and types."
sidebar_position: 2
displayed_sidebar: buildSidebar
---

# SDK — API Reference

All exports from `@yellow-org/contracts`.

## ABIs

Each ABI is exported as a `const` array for full type inference with viem and wagmi.

```ts
import {
  YellowTokenAbi,
  NodeRegistryAbi,
  AppRegistryAbi,
  YellowGovernorAbi,
  TimelockControllerAbi,
  TreasuryAbi,
  FaucetAbi,
  ILockAbi,
  ISlashAbi,
} from "@yellow-org/contracts";
```

| Export | Contract | ABI Entries | Description |
|---|---|---|---|
| `YellowTokenAbi` | YellowToken | 33 | ERC-20 + EIP-2612 permit |
| `NodeRegistryAbi` | NodeRegistry | 48 | Staking + voting (ILock + IVotes) |
| `AppRegistryAbi` | AppRegistry | 51 | Collateral + slashing (ILock + ISlash + AccessControl) |
| `YellowGovernorAbi` | YellowGovernor | 98 | Governance (Governor + extensions) |
| `TimelockControllerAbi` | TimelockController | 46 | Delayed execution |
| `TreasuryAbi` | Treasury | 16 | Foundation vault |
| `FaucetAbi` | Faucet | 16 | Testnet faucet |
| `ILockAbi` | ILock | 19 | Lock/unlock interface (shared by both registries) |
| `ISlashAbi` | ISlash | 6 | Slash interface |

### Interface ABIs

Use `ILockAbi` to write generic code that works with both NodeRegistry and AppRegistry:

```ts
import { ILockAbi } from "@yellow-org/contracts";

// Works with either registry
const balance = await client.readContract({
  address: registryAddress,
  abi: ILockAbi,
  functionName: "balanceOf",
  args: [userAddress],
});
```

## Addresses

```ts
import { addresses, type ContractAddresses } from "@yellow-org/contracts";
```

### `addresses`

`Record<number, Partial<ContractAddresses>>` — deployed addresses keyed by chain ID.

```ts
addresses[1]         // Ethereum Mainnet
addresses[11155111]  // Sepolia
```

### `ContractAddresses` type

```ts
type ContractAddresses = {
  yellowToken: `0x${string}`;
  nodeRegistry: `0x${string}`;
  appRegistry: `0x${string}`;
  governor: `0x${string}`;
  timelock: `0x${string}`;
  treasuryFounder: `0x${string}`;
  treasuryCommunity: `0x${string}`;
  treasuryTokenSale: `0x${string}`;
  treasuryFoundation: `0x${string}`;
  treasuryNetwork: `0x${string}`;
  treasuryLiquidity: `0x${string}`;
  faucet?: `0x${string}`;  // testnet only
};
```

### Current Addresses

See [Deployed Addresses](../operations/addresses.md) for the full list.
