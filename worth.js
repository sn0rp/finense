import fetch from 'node-fetch';
import 'dotenv/config';
import {
    AppError,
    AssetError,
    DomainError,
    throwProperly,
    UpstreamError
} from './errors.js';
import logger from './logger.cjs';

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
    try {
        if (!addresses) throw new ArgError();
        const amounts = new Map();
        logger.info("Getting amounts owned for all addresses...");
        for (const [key, val] of addresses) {
            if (BOOKS.has(key)) {
                const fullURL = `${BOOKS.get(key)}${NN_URL}${val}${NN_SUFFIX}`;
                const response = await fetch(fullURL, {
                    method: 'GET',
                    headers: {
                        'api-key': NOW_NODES,
                    },
                }).catch(e => {
                    throw new UpstreamError();
                });

                const responseBody = await response.json();
                try {
                    const parsedBalance = Number(responseBody.balance);
                    let formattedBalance = 0.0;

                    switch (key) {
                        case 'btc':
                            formattedBalance = parsedBalance / Math.pow(10, 8);
                            logger.info(`btc balance: ${formattedBalance}`);
                            break;
                        case 'ltc':
                            formattedBalance = parsedBalance / Math.pow(10, 8);
                            logger.info(`ltc balance: ${formattedBalance}`);
                            break;
                        case 'doge':
                            formattedBalance = parsedBalance / Math.pow(10, 8);
                            logger.info(`doge balance: ${formattedBalance}`);
                            break;
                        case 'eth':
                            formattedBalance = parsedBalance / Math.pow(10, 18);
                            logger.info(`eth balance: ${formattedBalance}`);
                            break;
                        default:
                            logger.info(`getAmounts: Asset ${key} is not supported`);
                            continue;
                    }

                    const balance = String(formattedBalance);
                    amounts.set(key, balance);
                } catch {
                    throw new UpstreamError();
                }
            }
        }
        if (amounts.size === 0) throw new AssetError(amounts.values().next().value);
        logger.info("Finished getting amounts owned");
        return amounts;
    } catch(e) { throwProperly(e) }
}

// Get amount owned by an address for a specified asset
export async function getSingleAmount(asset, address) {
    try {
        if (!asset || !address) throw new ArgError();
        let response = {};
        let amount = "";
        logger.info(`Getting amount of ${asset} owned by address ${address}`);
        if (BOOKS.has(asset)) {
            const fullURL = `${BOOKS.get(asset)}${NN_URL}${address}${NN_SUFFIX}`;
            const response = await fetch(fullURL, {
                method: 'GET',
                headers: {
                    'api-key': NOW_NODES,
                },
            }).catch(e => {
                throw new UpstreamError();
            });

            const responseBody = await response.json();
            try {
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
                        throw new AssetError(asset);
                }

                amount = String(formattedBalance);
            } catch {
                throw new UpstreamError();
            }
        } else throw new AssetError(asset);

        response["balance"] = amount;
        logger.info(`Found amount owned: ${amount}`);
        return response;
    } catch(e) { throwProperly(e) }
}

// Convert asset balance to USD
export async function toFiat(asset, balance) {
    try {
        if (!asset || !balance) throw new ArgError();
        let fiatAmount = {};
        const ast = asset.toUpperCase();
        let bal = Number(balance);
        
        const fullURL = `${BA_PREFIX}${ast}-USD`;
        logger.info(`Converting ${balance} ${asset} to usd...`);
        const response = await fetch(fullURL, {
            method: 'GET',
        }).catch(e => {
            throw new UpstreamError();
        });

        if (response.status === 400) throw new AssetError(asset);

        const responseBody = await response.json();
        try {
            const price = responseBody.last_trade_price;
            const fiatBalance = bal * price;

            fiatAmount["usd"] = String(fiatBalance);
            logger.info(`Converted to ${fiatBalance} usd`);
            return fiatAmount;
        } catch {
            throw new UpstreamError();
        }
    } catch(e) { throwProperly(e) }
}

// Return the sum of all retrieved amounts in USD
export async function netWorth(balances) {
    try {
        if (!balances) throw new ArgError();
        let response = {};
        let net = 0.0;

        logger.info("Calculating net worth from passed amounts...");
        for (const [asset, balance] of balances) {
            const fiat = await toFiat(asset, balance);
            if (!fiat) throw new UpstreamError();
            Object.values(fiat).forEach(value => {
                let num = Number(value);
                net += num;
            });
        }

        response["net"] = String(net);
        logger.info(`Net worth is ${net} usd`);
        return response;
    } catch(e) { throwProperly(e) }
}