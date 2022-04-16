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

// Resolve all supported coin types to their addresses
// Unsupported coin types are addressed by the default case
export async function resolveAddrs(coinTypes, resolver) {
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
                console.log(`Coin Type "${thisCoin}" is not yet supported.`)
        }
    }
    return allAddrs;
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
    });

    const responseBody = await response.json();
    const coinTypes = responseBody.data.domains[0].resolver.coinTypes;
    return coinTypes;
}

// testing coin types retrieval
//const coinTypes = await getCoinTypes("vitalik.eth");
//console.log(coinTypes);

// Testing address retrieval
//const resolver = await init("vitalik.eth");
//const addresses = await resolveAddrs(coinTypes);
//console.log(addresses);