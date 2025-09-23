# Running Clearnode Locally

This manual explains how to run a clearnode locally using Docker Compose for development and testing purposes.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/erc7824/nitrolite.git
cd clearnode
```

### 2. Environment Configuration

Create a new `.env` file. This file contains all necessary configuration for running clearnode locally. Below is an example with default values:

```bash
# ===================================================
#             CLEARNODE SERVICE CONFIGURATION
# ===================================================
CLEARNODE_LOG_LEVEL=info
BROKER_PRIVATE_KEY=0xac0974bec38a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Networks Configuration
POLYGON_INFURA_URL=wss://polygon-mainnet.infura.io/ws/v3/your-api-key
POLYGON_CUSTODY_CONTRACT_ADDRESS=0x490fb189DdE3a01B00be9BA5F41e3447FbC838b6
POLYGON_ADJUDICATOR_ADDRESS=0xcbbc03a873c11beeFA8D99477E830be48d8Ae6D7
POLYGON_BALANCE_CHECKER_ADDRESS=0x2352c63A83f9Fd126af8676146721Fa00924d7e4

# BASE_INFURA_URL=...
# BASE_CUSTODY_CONTRACT_ADDRESS=...
# BASE_ADJUDICATOR_ADDRESS=...
# BASE_BALANCE_CHECKER_ADDRESS=...
# ..

# ===================================================
#                    TOKEN SEEDING
# ===================================================
# --- Token 1 ---
TOKEN_1_ADDRESS=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
TOKEN_1_CHAIN_ID=137
TOKEN_1_SYMBOL=USDC
TOKEN_1_DECIMALS=6

# --- Token 2 ---
TOKEN_2_ADDRESS=0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
TOKEN_2_CHAIN_ID=137
TOKEN_2_SYMBOL=WETH
TOKEN_2_DECIMALS=18

# --- Token 3 ---
# ...

# ===================================================
#           POSTGRES DATABASE CONFIGURATION
# ===================================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
PGPASSWORD=${POSTGRES_PASSWORD}
CLEARNODE_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@database:5432/${POSTGRES_DB}?sslmode=disable
```

### 3. Start Services

Run the following command to start all services:

```bash
docker-compose up
```

### 4. Stop Services

To stop all services:

```bash
docker-compose down
```

## Environment Variables

### Supported Networks

Clearnode supports the following mainnet networks, which can be configured by adding the appropriate environment variables:

| Network          | Chain ID | Environment Variable Prefix |
| ---------------- | -------- | --------------------------- |
| ETH_MAINNET      | 1        | `ETH_MAINNET_`              |
| ROOTSTOCK        | 30       | `ROOTSTOCK_`                |
| POLYGON          | 137      | `POLYGON_`                  |
| WORLD_CHAIN      | 480      | `WORLD_CHAIN_`              |
| FLOW             | 747      | `FLOW_`                     |
| BASE             | 8453     | `BASE_`                     |
| CELO             | 42220    | `CELO_`                     |
| LINEA_MAINNET    | 59144    | `LINEA_MAINNET_`            |
| XRPL_EVM_MAINNET | 1440000  | `XRPL_EVM_MAINNET_`         |

And it supports the following testnet networks:

| Network          | Chain ID | Environment Variable Prefix |
| ---------------- | -------- | --------------------------- |
| LINEA_SEPOLIA    | 59141    | `LINEA_SEPOLIA_`            |
| POLYGON_AMOY     | 80002    | `POLYGON_AMOY_`             |
| BASE_SEPOLIA     | 84532    | `BASE_SEPOLIA_`             |
| XRPL_EVM_TESTNET | 1449000  | `XRPL_EVM_TESTNET_`         |
| ETH_SEPOLIA      | 11155111 | `ETH_SEPOLIA_`              |
| LOCALNET         | 1337     | `LOCALNET_`                 |
| ANVIL            | 31337    | `ANVIL_`                    |

For each network, you can configure:

- `{NETWORK}_INFURA_URL` or similar RPC endpoint
- `{NETWORK}_CUSTODY_CONTRACT_ADDRESS`
- `{NETWORK}_ADJUDICATOR_ADDRESS`
- `{NETWORK}_BALANCE_CHECKER_ADDRESS`

### Configuration Notes

- **BROKER_PRIVATE_KEY**: Default private key for local development (never use in production)
- **POLYGON_INFURA_URL**: Replace `your-api-key` with your actual Infura API key
- **Database Configuration**: Default PostgreSQL configuration for local development
- **Token Configuration**: Pre-configured with USDC and WETH tokens on Polygon

## Services

The Docker Compose setup typically includes:

- **Clearnode Service**: The main application
- **PostgreSQL Database**: For data persistence

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If you encounter port conflicts, check which services are running on the same ports and either stop them or modify the ports in docker-compose.yml

2. **Infura API Key**: Make sure to replace the placeholder Infura API key with a valid one

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

## Development

For development purposes, you may want to:

1. **Debug Mode**: Set `CLEARNODE_LOG_LEVEL=debug` for verbose logging
2. **Database Access**: Use a database client to connect to `localhost:5432` with the credentials from your `.env` file
