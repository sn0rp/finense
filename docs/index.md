# Finense Documentation

## Table of Contents
- [About](#about)
- [Configuration](#configuration)
- <details>
    <summary><a href=#endpoints>Endpoints</a></summary>
    - <a href=#dd>/domain/{domain}</a><br>
    - <a href=#dd-address>/domain/{domain}/address</a><br>
    - <a href=#dd-amount>/domain/{domain}/amount</a><br>
    - <a href=#dd-avatar>/domain/{domain}/avatar</a><br>
    - <a href=#dd-net>/domain/{domain}/net</a><br>
    - <a href=#dda>/domain/{domain}/{asset}</a><br>
    - <a href=#dda-address>/domain/{domain}/{asset}/address</a><br>
    - <a href=#dda-amount>/domain/{domain}/{asset}/amount</a><br>
    - <a href=#dda-fiat>/domain/{domain}/{asset}/fiat</a>
  </details>
- <details>
    <summary><a href=#errors>Errors</a></summary>
    - <a href=#arg-error>ArgError</a><br>
    - <a href=#asset-error>AssetError</a><br>
    - <a href=#domain-error>DomainError</a><br>
    - <a href=#unexpected-error>Unexpected API Error</a><br>
    - <a href=#upstream-error>UpstreamError</a>
  </details>

## About
*Finense* is an API which simplifies the process of evaluating one's cryptocurrency portfolio for ENS domain registrants. The API currently supports Bitcoin, Litecoin, Dogecoin, and Ethereum.

This software is *not* built to allow any modification of ENS or other blockchain data and only `GET` requests are supported.

All request parameters are required unless otherwise stated.

## Configuration
Environment variables, constants, and supported assets are managed in `config.js` which is self-documenting:
```json
{
    "PORT": process.env.PORT, // Port on which we run the server
    "INFURA_ID": process.env.INFURA_ID, // Project ID from Infura
    "INFURA_SECRET": process.env.INFURA_SECRET, // Project Secret from Infura
    "NOW_NODES": process.env.NOW_NODES, // NOWNodes API key
    "NN_URL": ".nownodes.io/api/v2/address/", // Common static component of NOWNodes endpoints
    "NN_SUFFIX": "?details=basic", // Common static component of NOWNodes endpoints
    "BA_PREFIX": "https://api.blockchain.com/v3/exchange/tickers/", // Common static component of Blockchain.com endpoints
    "BOOKS": { // (Ordered) Dynamic components of NOWNodes endpoints
        "btc": "https://btcbook",
        "ltc": "https://ltcbook",
        "doge": "https://dogebook",
        "eth": "https://eth-blockbook"
    },
    "ERROR_LIST": [ // Objects from './errors.js' for error checking
        "ArgError",
        "AssetError",
        "DomainError",
        "UpstreamError"
    ],
    "COIN_TYPES": [ // (Ordered) SLIP-0044 coin types for supported assets
        "0",
        "2",
        "3",
        "60"
    ],
    "COIN_NAMES": [ // (Ordered) ticker symbols corresponding to coin_types
        "btc",
        "ltc",
        "doge",
        "eth"
    ],
    "SCALE": { // (Ordered) We divide raw balance by this number to get native balance
        "btc": 8,
        "ltc": 8,
        "doge": 8,
        "eth": 18
    }
}
```

## Endpoints
<h3 id="dd"><code>/domain/{domain}</code></h3>

Return all data supported by this API, including:
- Domain name
- Avatar URL (null if none)
- Net Worth (Sum of asset balances in USD)
- Assets (list of objects with name, address, balance, usd value)

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**:
```bash
# GET /domain/snorp.eth
curl --location --request GET 'localhost:5000/domain/snorp.eth'
```
**Sample Response**:
```json
{
    "domain": "snorp.eth",
    "avatar": "https://gateway.ipfs.io/ipfs/Qmbkc7q1MASig2BpizCXwR4tUUq4GG7ubQ15VucAf1B5pq/493.png",
    "net": "4726.272173353719",
    "assets": [
        {
            "name": "eth",
            "address": "0x0FA6273Ce887D26622698eAbc9311597fC66a351",
            "balance": "0.8440922705248084",
            "usd": "2338.1355893537193"
        },
        {
            "name": "btc",
            "address": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06",
            "balance": "0.06419722",
            "usd": "2388.136584"
        },
        {
            "name": "ltc",
            "address": "ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp",
            "balance": "0",
            "usd": "0"
        },
        {
            "name": "doge",
            "address": "D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9",
            "balance": "0",
            "usd": "0"
        }
    ]
}
```
---

<h3 id="dd-address"><code>/domain/{domain}/address</code></h3>

Return all supported address records for a given domain.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/address
curl --location --request GET 'localhost:5000/domain/snorp.eth/address'
```
**Sample Response**
```json
{
    "eth": "0x0FA6273Ce887D26622698eAbc9311597fC66a351",
    "btc": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06",
    "ltc": "ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp",
    "doge": "D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9"
}
```
---

<h3 id="dd-amount"><code>/domain/{domain}/amount</code></h3>

Return all supported address balances for a given domain.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/amount
curl --location --request GET 'localhost:5000/domain/snorp.eth/amount'
```
**Sample Response**
```json
{
    "eth": "0.8440922705248084",
    "btc": "0.06419722",
    "ltc": "0",
    "doge": "0"
}
```
---

<h3 id="dd-avatar"><code>/domain/{domain}/avatar</code></h3>

Return avatar url (null if not applicable).

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.

**Responses**
- `200`: OK
- `404`: DomainError

**Sample Request**
```bash
# GET /domain/snorp.eth/avatar
curl --location --request GET 'localhost:5000/domain/snorp.eth/avatar'
```
**Sample Response**
```json
{
    "avatar": "https://gateway.ipfs.io/ipfs/Qmbkc7q1MASig2BpizCXwR4tUUq4GG7ubQ15VucAf1B5pq/493.png"
}
```
---

<h3 id="dd-net"><code>/domain/{domain}/net</code></h3>

Return net worth of supported address balances in USD.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET  /domain/snorp.eth/net
curl --location --request GET 'localhost:5000/domain/snorp.eth/net'
```
**Sample Response**
```json
{
    "net": "4690.807095396953"
}
```
---

<h3 id="dda"><code>/domain/{domain}/{asset}</code></h3>
Return address, balance, and USD value for a specific asset.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.
- `asset`: a supported ticker symbol, one of ( 'btc' 'ltc' 'doge' 'eth' ).

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/btc
curl --location --request GET 'localhost:5000/domain/snorp.eth/btc'
```
**Sample Response**
```json
{
    "address": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06",
    "balance": "0.06419722",
    "usd": "2366.2883441174"
}
```
---

<h3 id="dda-address"><code>/domain/{domain}/{asset}/address</code></h3>

Return address for a specific asset.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.
- `asset`: a supported ticker symbol, one of ( 'btc' 'ltc' 'doge' 'eth' ).

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/btc/address
curl --location --request GET 'localhost:5000/domain/snorp.eth/btc/address'
```
**Sample Response**
```json
{
    "address": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06"
}
```
---

<h3 id="dda-amount"><code>/domain/{domain}/{asset}/amount</code></h3>

Return balance for a specific asset.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.
- `asset`: a supported ticker symbol, one of ( 'btc' 'ltc' 'doge' 'eth' ).

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/btc/amount
curl --location --request GET 'localhost:5000/domain/snorp.eth/btc/amount'
```
**Sample Response**
```json
{
    "balance": "0.06419722"
}
```
---

<h3 id="dda-fiat"><code>/domain/{domain}/{asset}/fiat</code></h3>

Return USD value of balance for a specific asset.

**Parameters**
- `domain`: a registered ENS domain with a valid resolver record and supported address records.
- `asset`: a supported ticker symbol, one of ( 'btc' 'ltc' 'doge' 'eth' ).

**Responses**
- `200`: OK
- `400`: AssetError
- `404`: DomainError
- `502`: UpstreamError

**Sample Request**
```bash
# GET /domain/snorp.eth/btc/fiat
curl --location --request GET 'localhost:5000/domain/snorp.eth/btc/fiat'
```
**Sample Response**
```json
{
    "usd": "2369.0828491039997"
}
```
## Errors
<h3 id="arg-error"><code>400 ArgError</code></h3>

This is an internal error which should never be presented to the end user. It signified that an underlying function was called without the proper arguments. An example would be attempting to resolve a domain without providing one.

**Sample Response**
```
ArgError: Expected parameter not found
```
---

<h3 id="asset-error"><code>400 AssetError</code></h3>

This error signifies an attempt to resolve an asset which is not described in `config.js` and can occur whether or not an asset is specified. If  multiple unsupported address records are requested, the response will be an AssetError referencing the first asset type found. If an unsupported asset is specified, it will be mentioned in the response.

**Sample Response**
```
AssetError: Asset "snorp" is not supported
```
---

<h3 id="domain-error"><code>404 DomainError</code></h3>

This error signifies that the API could not establish a resolver, or could not find any address records, for the given domain, which can occur for three reasons:
1. The domain is unregistered.
2. The domain is registered, but does not have a resolver record.
3. The domain is registered with a resolver record, but has no address records.

Without a resolver record, there is no data available to access.

**Sample Response**
```
DomainError: Domain "snorp" not found or missing address records
```
---

<h3 id="unexpected-error"><code>500 Unexpected API Error</code></h3>

This error is thrown if an unanticipated error occurs, with that error as the body. It is entirely possible that any software could fail to anticipate all possible errors, so this error type was created in order to handle such a situation.

If you experience this error, please open an issue [here](https://github.com/Snorper/finense/issues) with the full error.

---

<h3 id="upstream-error"><code>502 UpstreamError</code></h3>

This error is thrown if an upstream API fails to function as expected. It is likely to be transient, but users are encouraged to open an issue [here](https://github.com/Snorper/finense/issues) if issues persist. A deeper problem may require refactoring the software.

**Sample Response**
```
UpstreamError: Upstream API returned an unexpected response
```