import express from 'express';
import helmet from 'helmet';
import { default as pinoHTTP } from 'pino-http';
import * as resolve from './resolve.js';
import * as worth from './worth.js';
import logger from './logger.cjs';
import { config } from './config.js';
import { show } from './errors.js';

const PORT = config.PORT;

export const app = express()

// Return all data (domain, addresses, amounts owned, fiat values, net worth)
app.get('/domain/:domain', async (req, res, next) => {
    try {
        let response = {};
        let domain = req.params.domain;

        const resolver = await resolve.init(domain);
        const avatar = await resolve.resolveAvatar(resolver);
        const coinTypes = await resolve.getCoinTypes(domain);
        const addrs = await resolve.resolveAddrs(coinTypes, resolver);
        const amounts = await worth.getAmounts(addrs);
        const net = await worth.netWorth(amounts);
        response["domain"] = domain;
        response["avatar"] = avatar;
        Object.assign(response, net);

        let assets = [];
        for (const [asset, addr] of addrs) {
            const name = { "name": asset };
            const address = { "address": addr };
            const amount = await worth.getSingleAmount(asset, addr);
            const fiat = await worth.toFiat(asset, amount.balance);
            let assetFull = Object.assign({}, name, address, amount, fiat);
            assets.push(assetFull);
        }
        response["assets"] = assets;

        return res.json(response);
    } catch(e) {
        next(e);
    }
});

// Return all supported address records for a given domain
app.get('/domain/:domain/address', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        const resolver = await resolve.init(domain);
        const coinTypes = await resolve.getCoinTypes(domain);
        const addrs = await resolve.resolveAddrs(coinTypes, resolver);
        return res.json(Object.fromEntries(addrs));
    } catch(e) {
        next(e);
    }
});

// Return amounts owned for all supported address records
app.get('/domain/:domain/amount', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        const resolver = await resolve.init(domain);
        const coinTypes = await resolve.getCoinTypes(domain);
        const addrs = await resolve.resolveAddrs(coinTypes, resolver);
        const amounts = await worth.getAmounts(addrs);
        return res.json(Object.fromEntries(amounts));
    } catch(e) {
        next(e);
    }
});

// Return only the avatar for a given domain
app.get('/domain/:domain/avatar', async (req, res, next) => {
    try {
        let response = {};
        let domain = req.params.domain;
        const resolver = await resolve.init(domain);
        const avatar = await resolve.resolveAvatar(resolver);
        response["avatar"] = avatar;
        return res.json(response);
    } catch(e) {
        next(e);
    }
});

// Return sum of balances in local currency for all supported addresses
app.get('/domain/:domain/net', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        const resolver = await resolve.init(domain);
        const coinTypes = await resolve.getCoinTypes(domain);
        const addrs = await resolve.resolveAddrs(coinTypes, resolver);
        const amounts = await worth.getAmounts(addrs);
        const net = await worth.netWorth(amounts);
        return res.json(net);
    } catch(e) {
        next(e);
    }
});

// Return a domain's address, amount owned, and fiat value for one asset
app.get('/domain/:domain/:asset', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        let asset = req.params.asset;
        const resolver = await resolve.init(domain);
        const addr = await resolve.resolveSingleAddr(asset, resolver);
        const amount = await worth.getSingleAmount(asset, addr.address);
        const fiat = await worth.toFiat(asset, amount.balance);
        const response = Object.assign({}, addr, amount, fiat);
        return res.json(response);
    } catch(e) {
        next(e);
    }
});

// Return address of a specified asset for a given domain
app.get('/domain/:domain/:asset/address', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        let asset = req.params.asset;
        const resolver = await resolve.init(domain);
        const addr = await resolve.resolveSingleAddr(asset, resolver);
        return res.json(addr);
    } catch(e) {
        next(e);
    }
});

// Return amount owned of a specified asset for a given domain
app.get('/domain/:domain/:asset/amount', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        let asset = req.params.asset;
        const resolver = await resolve.init(domain);
        const addr = await resolve.resolveSingleAddr(asset, resolver);
        const amount = await worth.getSingleAmount(asset, addr.address);
        return res.json(amount);
    } catch(e) {
        next(e);
    }
});

// Return value in local currency of amount owned for one asset
app.get('/domain/:domain/:asset/fiat', async (req, res, next) => {
    try {
        let domain = req.params.domain;
        let asset = req.params.asset;
        const resolver = await resolve.init(domain);
        const addr = await resolve.resolveSingleAddr(asset, resolver);
        const amount = await worth.getSingleAmount(asset, addr.address);
        const fiat = await worth.toFiat(asset, amount.balance);
        return res.json(fiat);
    } catch(e) {
        next(e);
    }
});

app.get('*', (req, res) => {
    res.status(400).send("Route not allowed");
});

app.use(pinoHTTP());;
app.use(helmet());
app.use(show);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));