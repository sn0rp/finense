import ethers from 'ethers';
import fetch from 'node-fetch';
import logger from './logger.cjs';
import { config } from './config.js';
import {
    ArgError,
    AssetError,
    DomainError,
    UpstreamError,
    throwProperly
} from './errors.js';

const INFURA_ID = config.INFURA_ID;
const INFURA_SECRET = config.INFURA_SECRET;

// Connect to Ethereum Mainnet using Infura
const provider = new ethers.providers.InfuraProvider("homestead", {
    projectId: INFURA_ID,
    projectSecret: INFURA_SECRET
});

// Establish resolver for a domain, should be called as early as possible
export async function init(domain){
    try {
        if (!domain) throw new ArgError;
        const resolver = await provider.getResolver(domain);
        if (resolver) {
            logger.info(`Established resolver for ${domain}`);
            return resolver;
        } else throw new DomainError(domain);
    } catch(e) { throwProperly(e) }
}

// Resolve domain to avatar record, if applicable
// Otherwise returns null (intended behavior)
export async function resolveAvatar(resolver) {
    if (!resolver) return null;
    const avatar = await resolver.getAvatar();
    try {
        let url = avatar.url;
        logger.info(`Resolved avatar url: ${url}`);
        return url;
    } catch {
        logger.info("No avatar found for this domain");
        return null;
    }
}

// Resolve all supported coin types to their addresses
// Unsupported coin types are addressed by the default case
export async function resolveAddrs(coinTypes, resolver) {
    try {
        if (!resolver || !coinTypes) throw new ArgError();
        const allAddrs = new Map();
        logger.info("Resolving address records...");
        for (let index = 0; index < coinTypes.length; ++index) {
            const thisCoin = coinTypes[index];
            switch (thisCoin) {
                case '0':
                    let btcAddr = await resolver.getAddress(thisCoin);
                    allAddrs.set("btc", btcAddr);
                    logger.info(`Resolved btc address: ${btcAddr}`);
                    break;
                case '2':
                    let ltcAddr = await resolver.getAddress(thisCoin);
                    allAddrs.set("ltc", ltcAddr);
                    logger.info(`Resolved ltc address: ${ltcAddr}`);
                    break;
                case '3':
                    let dogeAddr = await resolver.getAddress(thisCoin);
                    allAddrs.set("doge", dogeAddr);
                    logger.info(`Resolved doge address: ${dogeAddr}`);
                    break;
                case '60':
                    let ethAddr = await resolver.getAddress(thisCoin);
                    allAddrs.set("eth", ethAddr);
                    logger.info(`Resolved eth address: ${ethAddr}`);
                    break;
                default:
                    logger.info(`Coin Type "${thisCoin}" is not supported`);
            }
        }
        if (allAddrs.size === 0 && coinTypes.length !== 0) throw new AssetError(allAddrs.values().next().value);
        logger.info("Finished resolving address records");
        return allAddrs;
    } catch(e) { throwProperly(e) }
}

// Resolve domain to a specified address type
export async function resolveSingleAddr(asset, resolver) {
    try {
        if (!asset || !resolver) throw new ArgError();
        let response = {};
        let addr = "";
        logger.info(`Resolving ${asset} address record...`);
        switch (asset) {
            case 'btc':
                addr = await resolver.getAddress(0);
                logger.info(`Resolved ${asset} address: ${addr}`);
                break;
            case 'ltc':
                addr = await resolver.getAddress(2);
                logger.info(`Resolved ${asset} address: ${addr}`);
                break;
            case 'doge':
                addr = await resolver.getAddress(3);
                logger.info(`Resolved ${asset} address: ${addr}`);
                break;
            case 'eth':
                addr = await resolver.getAddress(60);
                logger.info(`Resolved ${asset} address: ${addr}`);
                break;
            default:
                throw new AssetError(asset);
        }
        response['address'] = addr;
        return response;
    } catch(e) { throwProperly(e) }
}

// Return a list of all coin types for which the domain has address records
export async function getCoinTypes(domain) {
    try {
        if (!domain) throw new ArgError();
        logger.info(`Fetching coinTypes for ${domain}...`);
        const response = await fetch("https://api.thegraph.com/subgraphs/name/ensdomains/ens", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                query {
                    domains(where:{name:"${domain}"}) {
                        resolver {
                            coinTypes
                        }
                    }
                }
            `,
            }),
        }).catch(e => {
            throw new UpstreamError();
        });

        const responseBody = await response.json();
        try {
            const coinTypes = responseBody.data.domains[0].resolver.coinTypes;
            logger.info(`Fetched coinTypes for ${domain}: ${coinTypes}`);
            return coinTypes;
        } catch(e) {
            throw new DomainError(domain);
        }
    } catch(e) { throwProperly(e) }
}