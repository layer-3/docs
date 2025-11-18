export const tooltipDefinitions = {
  nitroliteProtocol:
    "The on-chain smart contract protocol for state channels.",
  channel:
    "A secure communication pathway between participants that locks funds in an on-chain smart contract while enabling off-chain state updates.",
  clearnode:
    "A virtual ledger layer that provides a unified ledger (through Nitro RPC) and coordinates state channels (through Nitrolite), providing chain abstraction for developers and users.",
  nitroRpc: "The off-chain communication protocol.",
  channelState:
    "A snapshot of the channel at a point in time, including fund allocations and application-specific data.",
  blockchain:
    "The underlying distributed ledger technology (e.g., Ethereum).",
  participant:
    "An entity (identified by a wallet address) that is part of a channel.",
  appChannel:
    "Off-chain channels built on top of payment channels, intended to be used by app developers to enable application-specific interactions and transactions without touching the blockchain.",
  custodyContract:
    "The main on-chain contract implementing channel creation, joining, closure, and resizing. It is an implementation of the Nitrolite protocol.",
  unifiedBalance:
    "An abstraction that aggregates a user's funds across multiple blockchain networks, managed by a clearnode.",
  sessionKey:
    "A temporary cryptographic key delegated by a user's main wallet that provides a flexible way for the user to manage security of their funds by giving specific permissions and allowances for specific apps.",
  walletAddress:
    "A user's blockchain address (0x-prefixed hex string, 20 bytes) that identifies their account and owns funds.",
  chainId: "A blockchain network identifier (uint64).",
  channelNonce: "Unique number ensuring channel identifier uniqueness.",
  adjudicator:
    "A smart contract that validates state transitions according to application-specific rules.",
  channelId:
    "A unique identifier for a channel, computed as the hash of the channel configuration (0x-prefixed hex string, 32 bytes).",
  stateHash:
    "A cryptographic hash of a channel state, used for signature verification.",
  assetSymbol: "A lowercase string identifier for a supported asset.",
  sessionThreshold:
    "Minimum total weight of signatures required to approve app session state updates.",
  creatorRole:
    "Most often a light client willing to fund a ledger account with a clearnode (the Broker).",
  stateIntent:
    "An enum defining the purpose of a state: INITIALIZE (0), OPERATE (1), RESIZE (2), FINALIZE (3).",
  creatorParticipant:
    "The participant at index 0 in a channel who initiates channel creation.",
  appSessionId:
    "A unique identifier for an app session, formatted as a 0x-prefixed hex string (32 bytes).",
} as const;

export type TooltipDefinitionKey = keyof typeof tooltipDefinitions;
