import request from 'supertest';
import { app } from '../index.js';

describe('index', () => {
    describe('success', () => {
        it("should return all available data for 'snorp.eth'", async () => {
            const expectedDomain = "snorp.eth";
            const expectedAvatar = "https://gateway.ipfs.io/ipfs/Qmbkc7q1MASig2BpizCXwR4tUUq4GG7ubQ15VucAf1B5pq/493.png";
            const expectedAddrs = {
                "eth": "0x0FA6273Ce887D26622698eAbc9311597fC66a351",
                "btc": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06",
                "ltc": "ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp",
                "doge": "D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9"
            }
            const res = await request(app)
                .get('/domain/snorp.eth');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                domain: expectedDomain,
                avatar: expectedAvatar,
                net: expect.any(String),
                assets: [
                    {
                        name: "eth",
                        address: expectedAddrs["eth"],
                        balance: expect.any(String),
                        usd: expect.any(String)
                    },
                    {
                        name: "btc",
                        address: expectedAddrs["btc"],
                        balance: expect.any(String),
                        usd: expect.any(String)
                    },
                    {
                        name: "ltc",
                        address: expectedAddrs["ltc"],
                        balance: expect.any(String),
                        usd: expect.any(String)
                    },
                    {
                        name: "doge",
                        address: expectedAddrs["doge"],
                        balance: expect.any(String),
                        usd: expect.any(String)
                    }
                ]
            }));
        }, 60000);

        it("should return all asset addresses for 'snorp.eth'", async () => {
            const expected = {
                "eth": "0x0FA6273Ce887D26622698eAbc9311597fC66a351",
                "btc": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06",
                "ltc": "ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp",
                "doge": "D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9"
            }
            const res = await request(app)
                .get('/domain/snorp.eth/address');
            const addrs = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(addrs).toEqual(expected);
        }, 60000);

        it("should return all asset balances for 'snorp.eth'", async () => {
            const res = await request(app)
                .get('/domain/snorp.eth/amount');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                eth: expect.any(String),
                btc: expect.any(String),
                ltc: expect.any(String),
                doge: expect.any(String)
            }));
        }, 60000);

        it("should return the avatar record for 'snorp.eth'", async () => {
            const expected = "https://gateway.ipfs.io/ipfs/Qmbkc7q1MASig2BpizCXwR4tUUq4GG7ubQ15VucAf1B5pq/493.png";
            const res = await request(app)
                .get('/domain/snorp.eth/avatar');
            const url = await res.body.avatar;
            await expect(res.statusCode).toEqual(200);
            await expect(url).toBe(expected);
        }, 60000);

        it("should return the net worth of 'snorp.eth'", async () => {
            const res = await request(app)
                .get('/domain/snorp.eth/net');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                net: expect.any(String)
            }));
        }, 60000);

        it("should return all 'btc' data for 'snorp.eth'", async () => {
            const expected = "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06";
            const res = await request(app)
                .get('/domain/snorp.eth/btc');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                address: expected,
                balance: expect.any(String),
                usd: expect.any(String)
            }));
        }, 60000);

        it("should return 'btc' address for 'snorp.eth'", async () => {
            const expected = { "address": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06" }
            const res = await request(app)
                .get('/domain/snorp.eth/btc/address');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expected);
        }, 60000);

        it("should return 'btc' balance for 'snorp.eth'", async () => {
            const res = await request(app)
                .get('/domain/snorp.eth/btc/amount');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                balance: expect.any(String)
            }));
        }, 60000);

        it("should return 'btc' balance for 'snorp.eth' in USD", async () => {
            const res = await request(app)
                .get('/domain/snorp.eth/btc/fiat');
            const body = await res.body;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual(expect.objectContaining({
                usd: expect.any(String)
            }));
        }, 60000);

        it("should return 'Coming soon!' for '/'", async () => {
            const res = await request(app).get('/');
            const body = await res.text;
            await expect(res.statusCode).toEqual(200);
            await expect(body).toEqual("Coming soon!");
        }, 60000)
    })

    describe('failure', () => {
        it("should return 'Route not allowed' for invalid routes", async () => {
            const routes = [
                '/domain',
                '/doman'
            ];
            for (const route of routes) {
                const res = await request(app).get(route);
                const body = await res.text;
                await expect(res.statusCode).toEqual(400);
                await expect(body).toEqual("Route not allowed");
            }
        }, 60000);

        it("should return DomainError given invalid domain for relevant routes", async () => {
            const DomainErrorBody = `DomainError: Domain "snorp" not found or missing address records`
            const routes = [
                '/domain/snorp',
                '/domain/snorp/address',
                '/domain/snorp/amount',
                '/domain/snorp/avatar',
                '/domain/snorp/net',
                '/domain/snorp/unsupported',
                '/domain/snorp/unsupported/address',
                '/domain/snorp/unsupported/amount',
                '/domain/snorp/unsupported/fiat',
            ];
            for (const route of routes) {
                const res = await request(app).get(route);
                const body = await res.text;
                await expect(res.statusCode).toEqual(404);
                await expect(body).toEqual(DomainErrorBody);
            }
        }, 60000);

        it("should return AssetError given invalid asset for relevant routes", async () => {
            const AssetErrorBody = `AssetError: Asset "unsupported" is not supported`
            const routes = [
                '/domain/snorp.eth/unsupported',
                '/domain/snorp.eth/unsupported/address',
                '/domain/snorp.eth/unsupported/amount',
                '/domain/snorp.eth/unsupported/fiat'
            ];
            for (const route of routes) {
                const res = await request(app).get(route);
                const body = await res.text;
                await expect(res.statusCode).toEqual(400);
                await expect(body).toEqual(AssetErrorBody);
            }
        }, 60000);
    });
});