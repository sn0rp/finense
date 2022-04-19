import express from 'express'
import 'dotenv/config';
import * as resolve from './resolve.js';
import * as worth from './worth.js';

const PORT = process.env.PORT;

const app = express();

// Return all data (domain, addresses, amounts owned, fiat values, net worth)
app.get('/domain/:domain', async (req, res) => {
    let response = {};
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const avatar = await resolve.resolveAvatar(resolver);
    const coinTypes = await resolve.getCoinTypes(domain);
    if (!coinTypes) return res.status(502).send(
        'Server received an invalid response after querying the ENS Subgraph and is unable to determine address records for this domain.');

    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    if (!amounts) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    const net = await worth.netWorth(amounts);
    if (!net) return res.status(502).send(
        `Server received an invalid response after querying the Blockchain.com API and is unable to determine ${asset} value in USD.`);

    response["domain"] = domain;
    response["avatar"] = avatar;
    Object.assign(response, net);

    let assets = [];
    for (const [asset, addr] of addrs) {
        const name = { "name": asset};
        const address = { "address": addr };
        const amount = await worth.getSingleAmount(asset, addr);
        if (!amount) return res.status(502).send(
            `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

        const fiat = await worth.toFiat(asset, amount.balance);
        if (!fiat) return res.status(502).send(
            `Server received an invalid response after querying the Blockchain.com API and is unable to determine ${asset} value in USD.`);

        let assetFull = Object.assign({}, name, address, amount, fiat);
        assets.push(assetFull);
        //response[asset] = assetFull;
    }
    response["assets"] = assets;

    res.json(response);
});

// Return all supported address records for a given domain
app.get('/domain/:domain/address', async (req, res) => {
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const coinTypes = await resolve.getCoinTypes(domain);
    if (!coinTypes) return res.status(502).send(
        'Server received an invalid response after querying the ENS Subgraph and is unable to determine address records for this domain.');

    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    res.json(Object.fromEntries(addrs));
});

// Return amounts owned for all supported address records
app.get('/domain/:domain/amount', async (req, res) => {
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const coinTypes = await resolve.getCoinTypes(domain);
    if (!coinTypes) return res.status(502).send(
        'Server received an invalid response after querying the ENS Subgraph and is unable to determine address records for this domain.');

    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    if (!amounts) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    res.json(Object.fromEntries(amounts));
});

// Return only the avatar for a given domain
app.get('/domain/:domain/avatar', async (req, res) => {
    let response = {};
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const avatar = await resolve.resolveAvatar(resolver);
    response["avatar"] = avatar;
    res.json(response);
});

// Return sum of balances in local currency for all supported addresses
app.get('/domain/:domain/net', async (req, res) => {
    let domain = req.params.domain;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const coinTypes = await resolve.getCoinTypes(domain);
    if (!coinTypes) return res.status(502).send(
        'Server received an invalid response after querying the ENS Subgraph and is unable to determine address records for this domain.');

    const addrs = await resolve.resolveAddrs(coinTypes, resolver);
    const amounts = await worth.getAmounts(addrs);
    if (!amounts) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    const net = await worth.netWorth(amounts);
    if (!net) return res.status(502).send(
        `Server received an invalid response after querying the Blockchain.com API and is unable to determine ${asset} value in USD.`);

    res.json(net);
});

// Return a domain's address, amount owned, and fiat value for one asset
app.get('/domain/:domain/:asset', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const addr = await resolve.resolveSingleAddr(asset, resolver);
    if (!addr.address) return res.status(400).send(
        `Asset "${asset}" is not supported`);

    const amount = await worth.getSingleAmount(asset, addr.address);
    if (!amount) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    const fiat = await worth.toFiat(asset, amount.balance);
    if (!fiat) return res.status(502).send(
        `Server received an invalid response after querying the Blockchain.com API and is unable to determine ${asset} value in USD.`);

    const response = Object.assign({}, addr, amount, fiat);
    res.json(response);
});

// Return address of a specified asset for a given domain
app.get('/domain/:domain/:asset/address', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const addr = await resolve.resolveSingleAddr(asset, resolver);
    if (!addr.address) return res.status(400).send(
        `Asset "${asset}" is not supported`);

    res.json(addr);
});

// Return amount owned of a specified asset for a given domain
app.get('/domain/:domain/:asset/amount', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;

    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const addr = await resolve.resolveSingleAddr(asset, resolver);
    if (!addr.address) return res.status(400).send(
        `Asset "${asset}" is not supported`);

    const amount = await worth.getSingleAmount(asset, addr.address);
    if (!amount) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    res.json(amount);
});

// Return value in local currency of amount owned for one asset
app.get('/domain/:domain/:asset/fiat', async (req, res) => {
    let domain = req.params.domain;
    let asset = req.params.asset;
    const resolver = await resolve.init(domain);
    if (!resolver) return res.status(404).send(
        'ENS domain lookup returned null, indicating that this domain is unregistered.');

    const addr = await resolve.resolveSingleAddr(asset, resolver);
    if (!addr.address) return res.status(400).send(
        `Asset "${asset}" is not supported`);

    const amount = await worth.getSingleAmount(asset, addr.address);
    if (!amount) return res.status(502).send(
        `Server received an invalid response after querying the NOWNodes API and is unable to determine ${asset} balance`);

    const fiat = await worth.toFiat(asset, amount.balance);
    if (!fiat) return res.status(502).send(
        `Server received an invalid response after querying the Blockchain.com API and is unable to determine ${asset} value in USD.`);

    res.json(fiat);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));