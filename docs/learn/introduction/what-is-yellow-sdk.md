---
sidebar_position: 1
title: What is Yellow SDK
description: Learn about the Yellow SDK toolkit and its capabilities
keywords: [Yellow SDK, NitroliteRPC, state channels, web3 development]
---

# What is Yellow SDK

This is a real-time communication toolkit built on the **Nitrolite** protocol. It consists of two componentss, which are **NitroliteClient** and **Nitrolite RPC**: 

- **NitroliteClient**: Provides a set of methods to manage the lifecycle of state channels, including deposits, channel creation, application session management, and withdrawals.

- **Nitrolite RPC**: Provides an API to interact with Yellow Network Chain Abstraction Infrastructure. It enables developers to create applications with:

- **Instant Transactions**: Off-chain operations mean no waiting for block confirmations.
- **Minimal Gas Fees**: On-chain gas is primarily for channel opening and settlement.
- **High Throughput**: Capable of handling thousands of transactions per second.
- **Application Flexibility**: Ideal for games, payment systems, real-time interactions, and more.

##  Understanding NitroliteRPC
NitroliteRPC is a utility in our SDK that standardizes message creation for communication with Yellow Network.

### Key functions of NitroliteRPC include:

- **Message Construction**: Creates properly formatted request messages
- **Signature Management**: Handles the cryptographic signing of messages
- **Standard Format Enforcement**: Ensures all messages follow the required format for compatibility
- **Authentication Flow Helpers**: Simplifies the authentication process
Under the hood, NitroliteRPC provides functions that generate message objects with the correct structure, timestamps, and signature formatting, so you don't have to build these messages manually when communicating with ClearNodes.

## Package Information

The Yellow SDK is available as:

- **[@erc7824/nitrolite](https://www.npmjs.com/package/@erc7824/nitrolite)**: Core SDK package
- **Comprehensive documentation**: Step-by-step guides and examples
- **Production infrastructure**: ClearNode network and custody contracts
- **Developer tools**: Testing utilities and debugging helpers


## Getting Started

Ready to start building? Continue to the [Quick Start Guide](../../../build/quick-start) to build your first Yellow App in minutes.