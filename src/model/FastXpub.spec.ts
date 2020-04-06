// https://github.com/andreashuber69/net-worth#--
/* eslint-disable max-len */
import { HDNode, networks } from "bitcoinjs-lib";
import { FastXpub } from "./FastXpub";


describe(FastXpub.name, () => {
    describe("deriveNode", () => {
        fit("should derive the correct nodes", async () => {
            const sut = await FastXpub.create();
            const node = HDNode.fromBase58("xpub661MyMwAqRbcFW31YEwpkMuc5THy2PSt5bDMsktWQcFF8syAmRUapSCGu8ED9W6oDMSgv6Zz8idoc4a6mr8BDzTJY47LJhkJ8UB7WEGuduB", networks.bitcoin);
            const m0 = await sut.deriveNode(node, 0);
            expect(m0).toEqual("xpub69H7F5d8KSRgmmdJg2KhpAK8SR3DjMwAdkxj3ZuxV27CprR9LgpeyGmXUbC6wb7ERfvrnKZjXoUmmDznezpbZb7ap6r1D3tgFxHmwMkQTPH");
        });
    });
    describe("deriveAddressRange", () => {
        fit("should derive the correct addresses", async () => {
            const sut = await FastXpub.create();
            const node = HDNode.fromBase58("xpub6EikzRzgQiSsjiL3nz2SUZTi964wvqa1Je1WtRr5cXEwFEbMJvhas6BauDXoAVRhShfrJVTF1CKoq8zFmA9x72KocKxmRPBy4DizNPxLw9g", networks.bitcoin);
            const addresses = await sut.deriveAddressRange(node, 0, undefined, 0, 8);
            expect(addresses).toEqual([
                // cSpell: disable
                "1LDB6EomUoB4uXaqutFes9uduQ9Mz7PgHh",
                "1CfZgDBKAy9W6o4wJiGjCeMe4HPb3sibsY",
                "1L5CaYTqgyimJwT8RY2WBBtMuVxzPdH2X3",
                "1AkdX6HckmWsq2j1RCWqM46n4ZEbgvbRdk",
                "1PTCkaUS7jVVvQ7VwDGNK4nNNdt6XVqLbE",
                "1CPWrifcbSNR3VjuqYZeSxWqqbCsiD8Mvk",
                "16ir5E3NZbqKhYaUZVp33NvX2iJijxN6GL",
                "1BgeRDg7rfzwP4nWWEGPAzMheQJgQnC8Yk",
                "1F98cQLJsErpztRiB46qxcoKUToQcpCneY",
            ]);
        });
    });
});
