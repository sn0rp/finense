import * as resolve from '../resolve.js';

describe('resolve', () => {
    describe('resolve.init', () => {
        it("should return a resolver for 'snorp.eth'", async () => {
            await expect(resolve.init("snorp.eth")).toBeTruthy;
        });

        it("should throw AppError: DomainError for 'snorp'", async () => {
            await expect(resolve.init("snorp")).rejects.toThrow("DomainError");
        });

        it("should throw AppError: DomainError for missing argument", async () => {
            await expect(resolve.init()).rejects.toThrow("DomainError");
        });
    });

    describe('resolve.resolveAvatar', () => {
        it("should return the avatar url for 'snorp.eth'", async () => {
            const resolver = await resolve.init("snorp.eth");
            const avatar = await resolve.resolveAvatar(resolver);
            const expected = "https://gateway.ipfs.io/ipfs/Qmbkc7q1MASig2BpizCXwR4tUUq4GG7ubQ15VucAf1B5pq/493.png";
            await expect(avatar).toBe(expected);
        });

        it("should return null for 'superman.eth'", async () => {
            const resolver = await resolve.init("superman.eth");
            const avatar = await resolve.resolveAvatar(resolver);
            await expect(avatar).toBeNull();
        });

        it("should return null for missing argument", async () => {
            const avatar = await resolve.resolveAvatar();
            await expect(avatar).toBeNull();
        });
    });

    /*
    We are unable to test for a domain with only unsupported address records
    because this software runs on Mainnet and I am unaware of any such registered
    domains. Additionally, Testnet domains are impermanent.
    */
    describe('resolve.resolveAddrs', () => {
        it("should return map of supported addresses for 'snorp.eth'", async () => {
            const expectedCoins = ['60', '0', '2', '3', '5', '148', '128'];
            const expectedAddrs = new Map([
                ['eth', '0x0FA6273Ce887D26622698eAbc9311597fC66a351'],
                ['btc', 'bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06'],
                ['ltc', 'ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp'],
                ['doge', 'D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9']
            ]);

            const resolver = await resolve.init("snorp.eth");
            const addrs = await resolve.resolveAddrs(expectedCoins, resolver);
            await expect(addrs).toEqual(expectedAddrs);
        });

        it("should throw AppError: UpstreamError for missing arguments", async () => {
            await expect(resolve.resolveAddrs()).rejects.toThrow("UpstreamError");
        });
    });

    describe('resolve.resolveSingleAddr', () => {
        it("should return object with address for supported asset", async () => {
            const expected = { "address": "bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06" }
            const resolver = await resolve.init("snorp.eth");
            const btc = await resolve.resolveSingleAddr("btc", resolver);
            await expect(btc).toEqual(expected);
        });

        it("should throw AppError: AssetError for unsupported asset", async () => {
            const resolver = await resolve.init("snorp.eth");
            await expect(resolve.resolveSingleAddr("unsupported", resolver))
                .rejects.toThrow("AssetError");
        });

        it("should throw AppError: UpstreamError for missing arguments", async () => {
            const resolver = await resolve.init("snorp.eth");
            await expect(resolve.resolveSingleAddr()).rejects.toThrow("UpstreamError");
        });
    });

    describe('resolve.getCoinTypes', () => {
        it("Should return array of coinTypes for address records of 'snorp.eth'", async () => {
            const expected = ['60', '0', '2', '3', '5', '148', '128'];
            const coinTypes = await resolve.getCoinTypes("snorp.eth");
            await expect(coinTypes).toEqual(expected);
        });

        it("should throw AppError: DomainError for 'snorp'", async () => {
            await expect(resolve.getCoinTypes("snorp")).rejects.toThrow("DomainError");
        });

        it("should throw AppError: UpstreamError for missing argument", async () => {
            await expect(resolve.getCoinTypes()).rejects.toThrow("UpstreamError");
        });
    });
});