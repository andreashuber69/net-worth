// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-len */
import { HDNode, networks } from "bitcoinjs-lib";
import { FastXpub } from "./FastXpub";

// cSpell: disable
describe(FastXpub.name, () => {
    describe("deriveNode", () => {
        it("should derive the correct nodes", async () => {
            const sut = await FastXpub.create();
            const node = HDNode.fromBase58("xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB", networks.bitcoin);
            const m0 = await sut.deriveNode(node, 0);
            expect(m0).toEqual("xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH");
        });
    });
    describe("deriveAddressRange", () => {
        it("should derive the correct addresses", async () => {
            const sut = await FastXpub.create();
            const node = HDNode.fromBase58("xpub6EikzRzgQiSsjiL3nz2SUZTi964wvqa1Je1WtRr5cXEwFEbMJvhas6BauDXoAVRhShfrJVTF1CKoq8zFmA9x72KocKxmRPBy4DizNPxLw9g", networks.bitcoin);
            const addresses = await sut.deriveAddressRange(node, 0, undefined, 0, 2);
            expect(addresses).toEqual(["1LDB6EomUoB4uXaqutFes9uduQ9Mz7PgHh", "1CfZgDBKAy9W6o4wJiGjCeMe4HPb3sibsY", "1L5CaYTqgyimJwT8RY2WBBtMuVxzPdH2X3"]);
        });
    });
    describe("deriveAddressRange", () => {
        it("should derive the correct addresses for a legacy BTC wallet", async () => {
            const sut = await FastXpub.create();
            const parent = HDNode.fromBase58("xpub6CR3KoDQXWzSRJJvUq9Kr2rxGCHAfuwTeQAP3Q4p3687zxwiukfjRYZhgNxugYBjxk9iCAqy1mWR8Hb7oqqYUneYoZajA4CnzQyWhv52pHq", networks.bitcoin);
            const m0 = HDNode.fromBase58(await sut.deriveNode(parent, 0));
            const addresses = await sut.deriveAddressRange(m0, 0, undefined, 0, 2);
            expect(addresses).toEqual(["19WxeWSpHH3YKNqPia7BpfGgea4GKT9ENJ", "1FoJtisysDzJ92QMDSCtHoPSV7sN5sjeh7", "16xCaBhJSyQaniRnN3NqiW1ohgaxdoansU"]);
        });
    });
});
