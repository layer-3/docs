# Running Clearnode Locally

This manual explains how to run a Clearnode locally using Docker Compose for development and testing purposes. Clearnode is an implementation of a message broker node providing ledger services for the Nitrolite protocol, which enables efficient off-chain payment channels with on-chain settlement capabilities.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/erc7824/nitrolite.git
cd nitrolite/clearnode
```

### 2. Configuration Setup

Create a configuration directory:

```bash
cp -r config/compose/example config/compose/local
```

### 3. Configure Blockchain Connections

Edit `config/compose/local/blockchains.yaml` to configure your blockchain connections. Here's an example:

```yaml
default_contract_addresses:
  custody: "0x490fb189DdE3a01B00be9BA5F41e3447FbC838b6"
  adjudicator: "0xcbbc03a873c11beeFA8D99477E830be48d8Ae6D7"
  balance_checker: "0x2352c63A83f9Fd126af8676146721Fa00924d7e4"

blockchains:
  - name: polygon
    id: 137
    disabled: false
    block_step: 10000
  - name: base
    id: 8453
    disabled: true
```

### 4. Configure Assets

Edit `config/compose/local/assets.yaml` to configure supported assets:

```yaml
assets:
  - name: "USD Coin"
    symbol: "usdc"
    tokens:
      - blockchain_id: 137
        address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
        decimals: 6
  - name: "Wrapped Ether"
    symbol: "weth"
    tokens:
      - blockchain_id: 137
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"
        decimals: 18
```

### 5. Environment Variables

Create a `.env` file in `config/compose/local/.env` with the following:

```bash
# Required
BROKER_PRIVATE_KEY=your_private_key_here

# Add RPC endpoints for each enabled blockchain
POLYGON_BLOCKCHAIN_RPC=wss://my-polygon-rpc.example.com
# BASE_BLOCKCHAIN_RPC=wss://my-base-rpc.example.com

# Optional configuration
CLEARNODE_LOG_LEVEL=info
```

### 6. Start Services

Run the following command to start all services:

```bash
docker compose up
```

This will start:
- Clearnode service on port 8000 (WebSocket/HTTP)
- PostgreSQL database
- Prometheus metrics on port 4242

### 7. Stop Services

To stop all services:

```bash
docker compose down
```

## Configuration Reference

### Environment Variables

| Variable                           | Description                                      | Required | Default      |
|------------------------------------|--------------------------------------------------|----------|--------------|
| `BROKER_PRIVATE_KEY`               | Private key used for signing broker messages     | Yes      | -            |
| `DATABASE_DRIVER`                  | Database driver to use (postgres/sqlite)         | No       | sqlite       |
| `CLEARNODE_CONFIG_DIR_PATH`        | Path to directory containing configuration files | No       | .            |
| `CLEARNODE_DATABASE_URL`           | Database connection string                       | No       | clearnode.db |
| `CLEARNODE_LOG_LEVEL`              | Logging level (debug, info, warn, error)         | No       | info         |
| `HTTP_PORT`                        | Port for the HTTP/WebSocket server               | No       | 8000         |
| `METRICS_PORT`                     | Port for Prometheus metrics                      | No       | 4242         |
| `MSG_EXPIRY_TIME`                  | Time in seconds for message timestamp validation | No       | 60           |
| `<BLOCKCHAIN_NAME>_BLOCKCHAIN_RPC` | RPC endpoint for each enabled blockchain         | Yes      | -            |

### Blockchain Configuration (blockchains.yaml)

**Configuration Structure:**

- **default_contract_addresses**: That's the optional set of default contract addresses applied to all blockchains unless overridden
  - `custody`: Custody contract address
  - `adjudicator`: Adjudicator contract address
  - `balance_checker`: Balance checker contract address

- **blockchains**: Array of blockchain configurations
  - `name`: Blockchain name (required; lowercase, underscores allowed)
  - `id`: Chain ID for validation (required)
  - `disabled`: Whether to disable this blockchain (optional, default: false)
  - `block_step`: Block range for scanning (optional, default: 10000)
  - `contract_addresses`: Override default addresses for this specific blockchain (optional)
    - `custody`: Custody contract address
    - `adjudicator`: Adjudicator contract address
    - `balance_checker`: Balance checker contract address

:::warning
Even though both `default_contract_addresses` and blockchain-specific `contract_addresses` are described as optional, each blockchain must have all required contract addresses set. If no defaults are provided under `default_contract_addresses`, you must specify `custody`, `adjudicator`, and `balance_checker` addresses for every blockchain in its `contract_addresses` section. Otherwise, Clearnode will fail to start due to missing contract address configuration.
:::

RPC endpoints follow the pattern: `<BLOCKCHAIN_NAME_UPPERCASE>_BLOCKCHAIN_RPC`

Example:
```bash
MY_NETWORK_BLOCKCHAIN_RPC=wss://my-network-rpc.example.com
```

### Asset Configuration (assets.yaml)

**Configuration Structure:**

- **assets**: Array of asset configurations
  - `name`: Human-readable name of the asset (e.g., "USD Coin")
  - `symbol`: Ticker symbol for the asset (required; lowercase, e.g., "usdc")
  - `disabled`: Whether to skip processing this asset (optional, default: false)
  - `tokens`: Array of blockchain-specific token implementations
    - `name`: Token name on this blockchain (optional, inherits from asset)
    - `symbol`: Token symbol on this blockchain (optional, inherits from asset)
    - `blockchain_id`: Chain ID where this token is deployed (required)
    - `disabled`: Whether to skip processing this token (optional, default: false)
    - `address`: Token's contract address (required)
    - `decimals`: Number of decimal places for the token (required)

**Asset Token Inheritance:**
- If a token's `name` is not specified, it uses the asset's `name`
- If a token's `symbol` is not specified, it uses the asset's `symbol`
- If an asset's `name` is not specified, it defaults to the asset's `symbol`

## Key Features

- **Multi-Chain Support**: Connect to multiple EVM blockchains simultaneously
- **Off-Chain Payments**: Efficient payment channels for high-throughput transactions
- **Virtual Applications**: Create multi-participant applications
- **Message Forwarding**: Bi-directional message routing between participants
- **Flexible Database**: Support for both PostgreSQL and SQLite
- **Prometheus Metrics**: Built-in monitoring on port 4242
- **Quorum-Based Signatures**: Multi-signature schemes with weight-based quorums

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If you encounter port conflicts, check which services are running on ports 8000 (HTTP/WebSocket) or 4242 (metrics) and either stop them or modify the ports in docker-compose.yml

2. **RPC Configuration**: Ensure RPC endpoints match the pattern `<BLOCKCHAIN_NAME_UPPERCASE>_BLOCKCHAIN_RPC` and that the chain ID matches your configuration

3. **Configuration Files**: Make sure `blockchains.yaml` and `assets.yaml` are properly formatted YAML files in your CONFIG_DIR_PATH

4. **Database Connection**: If using PostgreSQL, ensure the database service is running and accessible

### Useful Commands

Check service status:

```bash
docker-compose ps
```

View logs for a specific service:

```bash
docker-compose logs -f <service-name>
```

Restart a specific service:

```bash
docker-compose restart <service-name>
```

Clean up (remove containers, networks, and volumes):

```bash
docker-compose down -v
```

## Development Tips

1. **Debug Mode**: Set `CLEARNODE_LOG_LEVEL=debug` for verbose logging
2. **Database Access**: Use a database client to connect to `localhost:5432` with PostgreSQL credentials
