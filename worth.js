// UNDER DEVELOPMENT

import fetch from 'node-fetch';
import 'dotenv/config';

const NOW_NODES = process.env.NOW_NODES;


// Iterate over address map to find amounts owned
async function getAmounts(addresses) {
    const amounts = new Map();
    addresses.forEach(function(key, val) {
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

    });

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