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

// Convert asset balance to local currency
async function toFiat(asset, balance, currency) {
    let fiatAmount = {};
    const ast = asset.toUpperCase();
    let bal = Number(balance);
    let cur = "";
    let cur_low = "";

    if (currency === undefined) {
        cur = "USD";
        cur_low = "usd";
    } else {
        cur = currency.toUpperCase();
        cur_low = currency.toLowerCase();
    }

    const fullURL = `${BA_PREFIX}${ast}-${cur}`;
    const response = await fetch(fullURL, {
        method: 'GET',
    });

    const responseBody = await response.json();
    const price = responseBody.last_trade_price;
    const fiatBalance = bal * price;

    fiatAmount[cur_low] = String(fiatBalance);
    return fiatAmount;
}


// Return the sum of all retrieved amounts in local currency
function netWorth(fiatAmounts) {
    let net = 0;

    fiatAmounts.forEach(function(key,val) {
        // 1. Convert to int
        // 2. add val to net
    })

    // 3. Convert net to string
    // 4. Return net
}