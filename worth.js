// UNDER DEVELOPMENT

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


// Iterate over address map to find amounts owned
export async function getAmounts(addresses) {
    const amounts = new Map();
    for (const [key, val] of addresses) {
        if (BOOKS.has(key)) {
            const fullURL = `${BOOKS.get(key)}${NN_URL}${val}${NN_SUFFIX}`
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

// Convert retrieved amounts to local currency (just USD as of now)
async function toFiat(amounts) {
    const fiatAmounts = new Map();
    
    amounts.forEach(function(key,val) {
        switch(key) {
            case 'btc':
                break;
            case 'ltc':
                break;
            case 'doge':
                break;
            case 'eth':
                break;
            default:
        }
    })

    return fiatAmounts;
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
