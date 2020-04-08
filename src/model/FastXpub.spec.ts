// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-len */
import { HDNode, networks } from "@trezor/utxo-lib";
import { FastXpub } from "./FastXpub";

// cSpell: disable
const deriveAddressRangeFixtures = [
    {
        coin: "legacy BTC",
        network: networks.bitcoin,
        xpub: "xpub6CR3KoDQXWzSRJJvUq9Kr2rxGCHAfuwTeQAP3Q4p3687zxwiukfjRYZhgNxugYBjxk9iCAqy1mWR8Hb7oqqYUneYoZajA4CnzQyWhv52pHq",
        expectedAddresses: [
            "19WxeWSpHH3YKNqPia7BpfGgea4GKT9ENJ",
            "1FoJtisysDzJ92QMDSCtHoPSV7sN5sjeh7",
            "16xCaBhJSyQaniRnN3NqiW1ohgaxdoansU",
        ] as const,
    },
] as const;

describe(FastXpub.name, () => {
    // eslint-disable-next-line init-declarations
    let sut: FastXpub;
    beforeAll(async () => (sut = await FastXpub.create()));

    describe("deriveNode", () => {
        it("should derive the correct nodes", async () => {
            const node = HDNode.fromBase58("xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB");
            const m0 = await sut.deriveNode(node, 0);
            expect(m0).toEqual("xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH");
        });
    });

    deriveAddressRangeFixtures.forEach((f) => {
        describe("deriveAddressRange", () => {
            it(`should derive the correct addresses for a ${f.coin} wallet`, async () => {
                const parent = HDNode.fromBase58(f.xpub, f.network);
                const m0 = HDNode.fromBase58(await sut.deriveNode(parent, 0));
                expect(await sut.deriveAddressRange(m0, 0, undefined, 0, 2)).toEqual(f.expectedAddresses);
            });
        });
    });
});
