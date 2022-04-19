import { ethers } from 'ethers';
import fetch from 'node-fetch';
import 'dotenv/config';

const INFURA_ID = process.env.INFURA_ID;
const INFURA_SECRET = process.env.INFURA_SECRET;

// Connect to Ethereum Mainnet using Infura
const provider = new ethers.providers.InfuraProvider("homestead", {
    projectId: INFURA_ID,
    projectSecret: INFURA_SECRET
});

// Establish resolver for a domain, should be called as early as possible
export async function init(domain){
    const resolver = await provider.getResolver(domain);
    return resolver;
}

// Resolve domain to avatar record, if applicable
export async function resolveAvatar(resolver) {
    if (!resolver) return null;
    const avatar = await resolver.getAvatar();
    let url = avatar.url;
    return url;
}

// Resolve all supported coin types to their addresses
// Unsupported coin types are addressed by the default case
export async function resolveAddrs(coinTypes, resolver) {
    if (!resolver) return null;
    const allAddrs = new Map();
    for (let index = 0; index < coinTypes.length; ++index) {
        const thisCoin = coinTypes[index];
        switch (thisCoin) {
            case '0':
                let btcAddr = await resolver.getAddress(thisCoin);
                allAddrs.set("btc", btcAddr);
                break;
            case '2':
                let ltcAddr = await resolver.getAddress(thisCoin);
                allAddrs.set("ltc", ltcAddr);
                break;
            case '3':
                let dogeAddr = await resolver.getAddress(thisCoin);
                allAddrs.set("doge", dogeAddr);
                break;
            case '60':
                let ethAddr = await resolver.getAddress(thisCoin);
                allAddrs.set("eth", ethAddr);
                break;
            default:
                console.log(`Coin Type "${thisCoin}" is not yet supported.`);
        }
    }
    return allAddrs;
}

// Resolve domain to a specified address type
export async function resolveSingleAddr(asset, resolver) {
    if (!resolver) return null;
    let response = {};
    let addr = "";
    switch (asset) {
        case 'btc':
            addr = await resolver.getAddress(0);
            break;
        case 'ltc':
            addr = await resolver.getAddress(2);
            break;
        case 'doge':
            addr = await resolver.getAddress(3);
            break;
        case 'eth':
            addr = await resolver.getAddress(60);
            break;
        default:
            addr = null;
            console.log(`Asset "${asset}" is not supported.`);
    }
    response['address'] = addr;
    return response;
}

// Return a list of all coin types for which the domain has address records
export async function getCoinTypes(domain) {
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
    }).catch(err => {
        console.log(err);
        return null;
    });

    const responseBody = await response.json();
    const coinTypes = responseBody.data.domains[0].resolver.coinTypes;
    return coinTypes;
}