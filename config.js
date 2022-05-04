import 'dotenv/config';

export const config = {
    "PORT": process.env.PORT, // Port on which we run the server
    "INFURA_ID": process.env.INFURA_ID, // Project ID from Infura
    "INFURA_SECRET": process.env.INFURA_SECRET, // Project Secret from Infura
    "NOW_NODES": process.env.NOW_NODES, // NOWNodes API key
    "NN_URL": ".nownodes.io/api/v2/address/", // Common static component of NOWNodes endpoints
    "NN_SUFFIX": "?details=basic", // Common static component of NOWNodes endpoints
    "BA_PREFIX": "https://api.blockchain.com/v3/exchange/tickers/", // Common static component of Blockchain.com endpoints
    "BOOKS": { // Dynamic components of NOWNodes endpoints
        "btc": "https://btcbook",
        "ltc": "https://ltcbook",
        "doge": "https://dogebook",
        "eth": "https://eth-blockbook"
    },
    "error_list": [ // Objects from './errors.js' for error checking
        "ArgError",
        "AssetError",
        "DomainError",
        "UpstreamError"
    ],
    "coin_types": [ // SLIP-0044 coin types for supported assets
        "0",
        "2",
        "3",
        "60"
    ],
    "coin_names": [ // Ordered ticker symbols corresponding to coin_types
        "btc",
        "ltc",
        "doge",
        "eth"
    ]
}