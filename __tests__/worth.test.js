import * as worth from '../worth.js';

describe('worth', () => {
    describe('worth.getAmounts', () => {
        it("should return a map of amounts owned for a map of addresses", async () => {
            const addrs = new Map([
                ['eth', '0x0FA6273Ce887D26622698eAbc9311597fC66a351'],
                ['btc', 'bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06'],
                ['ltc', 'ltc1qlf0s82v7ywvnf52c0jk9ejx6qfsragk58pgvmp'],
                ['doge', 'D6LVbmQM3UQmvwFnWX8VKECJH7ySNnYzX9']
            ]);
            const amounts = await worth.getAmounts(addrs);
            await expect(amounts).toBeInstanceOf(Map);
        });

        it("should throw AppError: UpstreamError for missing argument", async () => {
            await expect(worth.getAmounts()).rejects.toThrow("UpstreamError");
        });
    });

    describe('worth.getSingleAmount', () => {
        it("should return an object with amount owned of an asset by address", async () => {
            const addr = 'bc1q9x8660cp73x2v3lyvm6ua9gqwz6fy8gqhrsv06';
            const amount = await worth.getSingleAmount('btc', addr);
            await expect(amount).toEqual(expect.objectContaining({
                balance: expect.any(String)
            }));
        });

        it("should throw AppError: AssetError for unsupported asset", async () => {
            await expect(worth.getSingleAmount("unsupported", "whatever"))
                .rejects.toThrow("AssetError");
        });

        it("should throw AppError: UpstreamError for missing arguments", async () => {
            await expect(worth.getSingleAmount()).rejects.toThrow("UpstreamError");
        });
    });

    describe('worth.toFiat', () => {
        it("should return an object with USD value of asset balance", async () => {
            const fiat = await worth.toFiat("btc", "1");
            await expect(fiat).toEqual(expect.objectContaining({
                usd: expect.any(String)
            }));
        });

        it("should throw AppError: AssetError for unsupported asset", async () => {
            await expect(worth.toFiat("unsupported", "1")).rejects.toThrow("AssetError");
        });

        it("should throw AppError: UpstreamError for missing arguments", async () => {
            await expect(worth.toFiat()).rejects.toThrow("UpstreamError");
        });
    });

    describe('worth.netWorth', () => {
        it("should return an object with the net worth of a list of amounts", async () => {
            const balances = new Map([
                ['eth', '1'],
                ['btc', '1'],
                ['ltc', '1'],
                ['doge', '1']
            ]);
            const net = await worth.netWorth(balances);
            await expect(net).toEqual(expect.objectContaining({
                net: expect.any(String)
            }));
        });

        it("should throw AppError: UpstreamError for missing argument", async () => {
            await expect(worth.netWorth()).rejects.toThrow("UpstreamError");
        });
    });
});