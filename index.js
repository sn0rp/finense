import express from 'express'
import 'dotenv/config';
import * as resolve from './resolve.js';
import * as worth from './worth.js';

const PORT = process.env.PORT;

const app = express();

// Return all supported address records for a given domain
app.get('/domain/:domain/address', async (req, res) => {
    let domain = req.params.domain;
    const resolver = await resolve.init(domain);
    const coinTypes = await resolve.getCoinTypes(domain);
    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    res.json(Object.fromEntries(addrs));
});

// Return amounts owned for all supported address records
app.get('/domain/:domain/amount', async (req, res) => {
    let domain = req.params.domain;
    const resolver = await resolve.init(domain);
    const coinTypes = await resolve.getCoinTypes(domain);
    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    res.json(Object.fromEntries(amounts));
});

// Return all data (domain, addresses, amounts owned, fiat values, net worth)
app.get('/domain/:domain', async (req, res) => {
    let response = {};
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    const coinTypes = await resolve.getCoinTypes(domain);
    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    const net = await worth.netWorth(amounts);

    response["domain"] = domain;
    Object.assign(response, net);

    for (const [asset, addr] of addrs) {
        const address = { "address": addr};
        const amount = await worth.getSingleAmount(asset, addr);
        const fiat = await worth.toFiat(asset, amount.balance);
        let assetFull = Object.assign({}, address, amount, fiat);
        response[asset] = assetFull;
    }

    res.json(response);
});

// Return sum of balances in local currency for all supported addresses
app.get('/domain/:domain/net', async (req, res) => {
    let domain = req.params.domain;
    const resolver = await resolve.init(domain);
    const coinTypes = await resolve.getCoinTypes(domain);
    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    const net = await worth.netWorth(amounts);
    res.json(net);
});

// Return a domain's address, amount owned, and fiat value for one asset
app.get('/domain/:domain/:asset', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;
    const resolver = await resolve.init(domain);
    const addr = await resolve.resolveSingleAddr(asset, resolver);
    const amount = await worth.getSingleAmount(asset, addr.address);
    const fiat = await worth.toFiat(asset, amount.balance);
    const response = Object.assign({}, addr, amount, fiat);
    res.json(response);
});

// Return address of a specified asset for a given domain
app.get('/domain/:domain/:asset/address', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;
    const resolver = await resolve.init(domain);
    const addr = await resolve.resolveSingleAddr(asset, resolver);
    res.json(addr);
});

// Return amount owned of a specified asset for a given domain
app.get('/domain/:domain/:asset/amount', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;
    const resolver = await resolve.init(domain);
    const addr = await resolve.resolveSingleAddr(asset, resolver);
    const amount = await worth.getSingleAmount(asset, addr.address);
    res.json(amount);
});

// Return value in local currency of amount owned for one asset
app.get('/domain/:domain/:asset/fiat', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;
    const resolver = await resolve.init(domain);
    const addr = await resolve.resolveSingleAddr(asset, resolver);
    const amount = await worth.getSingleAmount(asset, addr.address);
    const fiat = await worth.toFiat(asset, amount.balance);
    res.json(fiat);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));