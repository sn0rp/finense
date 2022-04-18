import fetch from 'node-fetch';
import 'dotenv/config';

const NOW_NODES = process.env.NOW_NODES;
const NN_URL = ".nownodes.io/api/v2/address/";
const NN_SUFFIX = "?details=basic";

const BOOKS = new Map([
    ["btc", "https://btcbook"],
    ["ltc", "https://ltcbook"],
    ["doge", "https://dogebook"],
    ["eth", "https://eth-blockbook"]
]);

const BA_PREFIX = "https://api.blockchain.com/v3/exchange/tickers/";


// Iterate over address map to find amounts owned
export async function getAmounts(addresses) {
    const amounts = new Map();
    for (const [key, val] of addresses) {
        if (BOOKS.has(key)) {
            const fullURL = `${BOOKS.get(key)}${NN_URL}${val}${NN_SUFFIX}`;
            const response = await fetch(fullURL, {
                method: 'GET',
                headers: {
                    'api-key': NOW_NODES,
                },
            });

            const responseBody = await response.json();
            const parsedBalance = Number(responseBody.balance);
            let formattedBalance = 0.0;

            switch(key) {
                case 'btc':
                    formattedBalance = parsedBalance / Math.pow(10, 8);
                    break;
                case 'ltc':
                    formattedBalance = parsedBalance / Math.pow(10, 8);
                    break;
                case 'doge':
                    formattedBalance = parsedBalance / Math.pow(10, 8);
                    break;
                case 'eth':
                    formattedBalance = parsedBalance / Math.pow(10,18);
                    break;
                default:
                    console.log(`Could not parse ${key} balance, skipping`);
                    continue;
            }

            const balance = String(formattedBalance);
            amounts.set(key, balance);
        }
    }

    return amounts;
}

// Get amount owned by an address for a specified asset
export async function getSingleAmount(asset, address) {
    let response = {};
    let amount = "";

    if (BOOKS.has(asset)) {
        const fullURL = `${BOOKS.get(asset)}${NN_URL}${address}${NN_SUFFIX}`;
        const response = await fetch(fullURL, {
            method: 'GET',
            headers: {
                'api-key': NOW_NODES,
            },
        });

        const responseBody = await response.json();
        const parsedBalance = Number(responseBody.balance);
        let formattedBalance = 0.0;

        switch (asset) {
            case 'btc':
                formattedBalance = parsedBalance / Math.pow(10, 8);
                break;
            case 'ltc':
                formattedBalance = parsedBalance / Math.pow(10, 8);
                break;
            case 'doge':
                formattedBalance = parsedBalance / Math.pow(10, 8);
                break;
            case 'eth':
                formattedBalance = parsedBalance / Math.pow(10, 18);
                break;
            default:
                console.log(`Could not parse ${asset} balance, skipping`);
        }

        amount = String(formattedBalance);
    }

    response["balance"] = amount;
    return response;
}

// Convert asset balance to USD
export async function toFiat(asset, balance) {
    let fiatAmount = {};
    const ast = asset.toUpperCase();
    let bal = Number(balance);

    const fullURL = `${BA_PREFIX}${ast}-USD`;
    const response = await fetch(fullURL, {
        method: 'GET',
    });

    const responseBody = await response.json();
    const price = responseBody.last_trade_price;
    const fiatBalance = bal * price;

    fiatAmount["usd"] = String(fiatBalance);
    return fiatAmount;
}


// Return the sum of all retrieved amounts in USD
export async function netWorth(balances) {
    let response = {};
    let net = 0.0;

    for (const [asset, balance] of balances) {
        const fiat = await toFiat(asset, balance);
        Object.values(fiat).forEach(value => {
            let num = Number(value);
            net += num;
        });
    }

    response["net"] = String(net);
    return response;
}