---
title: "Getting Started"
description: "Install, import, and use the contracts SDK."
sidebar_position: 1
displayed_sidebar: clearnetSidebar
---

# SDK — Getting Started

`@yellow-org/contracts` provides typed ABIs and deployed addresses for all Yellow Network contracts. Works with viem, ethers.js, wagmi, or any EVM library.

## Install

```bash
# bun
bun add @yellow-org/contracts

# npm
npm install @yellow-org/contracts

# yarn
yarn add @yellow-org/contracts

# pnpm
pnpm add @yellow-org/contracts
```

## Quick Start

### viem

```ts
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { NodeRegistryAbi, addresses } from "@yellow-org/contracts";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Read a node operator's locked collateral — fully typed
const balance = await client.readContract({
  address: addresses[1].nodeRegistry!,
  abi: NodeRegistryAbi,
  functionName: "balanceOf",
  args: ["0x..."],
});
```

### ethers v6

```ts
import { Contract, JsonRpcProvider } from "ethers";
import { NodeRegistryAbi, addresses } from "@yellow-org/contracts";

const provider = new JsonRpcProvider("https://eth.llamarpc.com");

const nodeRegistry = new Contract(
  addresses[1].nodeRegistry!,
  NodeRegistryAbi,
  provider
);

const balance = await nodeRegistry.balanceOf("0x...");
```

### wagmi (React)

```ts
import { useReadContract } from "wagmi";
import { NodeRegistryAbi, addresses } from "@yellow-org/contracts";

function LockedCollateral({ user }: { user: `0x${string}` }) {
  const { data: balance } = useReadContract({
    address: addresses[1].nodeRegistry!,
    abi: NodeRegistryAbi,
    functionName: "balanceOf",
    args: [user],
  });

  return <span>{balance?.toString()} YELLOW</span>;
}
```

## What's Included

- **9 ABIs** as `as const` TypeScript arrays (full type inference with viem/wagmi)
- **Deployed addresses** keyed by chain ID
- **ESM + CJS** builds with TypeScript declarations

See [API Reference](./api-reference.md) for the full export list.
