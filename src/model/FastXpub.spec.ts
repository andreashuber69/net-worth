// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-len */
import { networks } from "@trezor/utxo-lib";
import { FastXpub } from "./FastXpub";

// cSpell: disable
const deriveAddressRangeFixtures = [
    {
        coin: "BTC",
        network: networks.bitcoin,
        xpub: "ypub6XULFemHRxUx8r525Ug7o8tFgBqH9tYaVBJMnsnqnKdHGJu9iWqtGeGiezBG1fHy66ZY7shsCo48m99dcsDaddzkTs6P7voAd3z2kpRppuh",
        expectedAddresses: [
            "3H4oX72eeWEmLdmUYXk4mtsYp4PdX3hmjj",
            "33HEs7w1btgCmUERLyjxthK9Z5zjE7mpAC",
            "3Pf3y3fXBTwvfHN9ywEJsPDFXnmJFBXbYX",
        ] as const,
    } as const,
    {
        coin: "legacy BTC",
        network: networks.bitcoin,
        xpub: "xpub6CR3KoDQXWzSRJJvUq9Kr2rxGCHAfuwTeQAP3Q4p3687zxwiukfjRYZhgNxugYBjxk9iCAqy1mWR8Hb7oqqYUneYoZajA4CnzQyWhv52pHq",
        expectedAddresses: [
            "19WxeWSpHH3YKNqPia7BpfGgea4GKT9ENJ",
            "1FoJtisysDzJ92QMDSCtHoPSV7sN5sjeh7",
            "16xCaBhJSyQaniRnN3NqiW1ohgaxdoansU",
        ] as const,
    } as const,
    {
        coin: "BCH",
        network: networks.bitcoincash,
        xpub: "xpub6CcGciyc8DdXXpaYFXd72hEHCCxeBeWMSfZ66ivpuPg169BYj8SydWBwipjuckuxRAyVByyrHrnJNNSoV3Q6p3Uh1HTtwSiHn4o5vhy3bDy",
        expectedAddresses: [
            "1FCt5ovrFbEXj8bcpf2dDYAb8NzPk9VUx7",
            "1BM5QcoLVKrtnDxEJaJXUURiz5q6jTuKcn",
            "1EW39ydkc8jotiyKohuqSdkmdp9U7GQGRh",
        ] as const,
    } as const,
    {
        coin: "BTG",
        network: networks.bitcoingold,
        xpub: "ypub6XbvqZDtAgAHmEMVPh3Y3BUPJNuCL7TpCHntHMytbYq7STRu8ywFY6B3Ee1SnAjiAJcXn7P7Y79Tfdh4D3jqzcBhzLoAcnPQhy4xLbB1iUb",
        expectedAddresses: [
            "AGU8a1EJKaBVDJ59THN6XRqt8GMx37ghYA",
            "AeogqQ3oCfMVfHVtJ7hgFmvxtYiUDShDFc",
            "AHLYLAtCcGGUZ2KukUhof1D4c1XAqdUqZF",
        ] as const,
    } as const,
    {
        coin: "legacy BTG",
        network: networks.bitcoingold,
        xpub: "xpub6DW4G75Y5pPqLhzAtRbxZhTpHZAaNqp8iKPm6JmP3ieMGHTjnoHorwcU7cdHtEJujdkenhpQNJkbx6ExWsQwxrhhN9QKqkwA9DDE4ody3Pa",
        expectedAddresses: [
            "GWxkpFsBnFonA3k2GQLyfGjBBh2Cc9SbLK",
            "GYSa9LkPyvK1fARzCPkCsxyGKQHGjWHcBz",
            "GcA94T2BYYHWk61Qkdxt5tZdJMw4XBXVgf",
        ] as const,
    } as const,
    {
        coin: "DASH",
        network: networks.dash,
        xpub: "drkpRzboK3oVTJvACBqgitGRyoNVXg1HRzaFUSjUpDf3w2mC4SFosAB58hBDNueqHQeN8ZymKdUZa9CUHhnapQKM1gbzx8Ypt3Wv3hrVs6h8ZWT",
        expectedAddresses: [
            "XkqyKihuxirhrAWLBmuiCFRwC2STWQ7ku1",
            "Xk2AFmi7EXL4xYoyvtyG3Myei6MN3zp731",
            "XrXyQFjEvwiHHbrR5rziNPHdSi19SThAx6",
        ] as const,
    } as const,
    {
        coin: "LTC",
        network: networks.litecoin,
        xpub: "Mtub2s2ywizEPokT7Byp6i5ztr7X9mHWLF2Zskixrf4WZkF6eW6yUwkoVRp2SuGgaNw4FdKfM3fwJPEjF5AK2Nt7TsCEkhnLJrRzBdb2v8gnsjC",
        expectedAddresses: [
            "MRMcXf2e6TRKY1EjgJXciE3WTk9k9CQUbm",
            "MGQYB2DVEoAT2MBM9asRSdkf7ZWAKnwhmA",
            "MBms7K1kmgbnmkeMpeJ9foC15Wbbw9N8gG",
        ] as const,
    } as const,
    {
        coin: "legacy LTC",
        network: networks.litecoin,
        xpub: "Ltub2YmmNemmgpHLEWN4icd5kx6Roy4sYd2ewUR1hJRDNefEgHNXLektp5p9xyakTVodcgbab9j2GdSjXhseBBwPuGoJdtRE3VVi5h9fRYeaRbZ",
        expectedAddresses: [
            "LVPbH7szxpFCsqcWbkT4r7thv9eDWL62WK",
            "LeUWJbajpZtxqwkpSmze9d5R8DTZoa33JQ",
            "LYdzh3PAKqumN3M3jQcJWF7iCv8o8C7Jkg",
        ] as const,
    } as const,
    {
        coin: "ZEC",
        network: networks.zcash,
        xpub: "xpub6CLSnhkLotnHLGsYFYp1GBCHErdpntoGZ98r1hZaTzseALCfD74kJKcM18b6CGqu6Bq8heJcffepb1QN4y7u2458NDNobgnnTVgjZreoXpA",
        expectedAddresses: [
            "t1YaYmr4T8JmuLHPGcY7ydQGj88tomfc76E",
            "t1h8cvgy1B3FvMLn92JohgPkUwRMu4zpyE7",
            "t1aUvHzcKTiZ4bozzuKXCsmcTGwSiXzzvqK",
        ] as const,
    } as const,
] as const;

describe(FastXpub.name, () => {
    describe("deriveNode", () => {
        it("should derive the correct nodes", async () => {
            const sut = new FastXpub(networks.bitcoin);
            const m0 = await sut.deriveNode("xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB", 0);
            expect(m0).toEqual("xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH");
        });
    });

    describe("deriveAddressRange", () => {
        deriveAddressRangeFixtures.forEach((f) => {
            it(`should derive the correct addresses for a ${f.coin} wallet`, async () => {
                const sut = new FastXpub(f.network);
                const m0 = await sut.deriveNode(f.xpub, 0);
                expect(await sut.deriveAddressRange(m0, 0, 2)).toEqual(f.expectedAddresses);
            });
        });
    });
});
