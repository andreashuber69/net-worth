// https://github.com/andreashuber69/net-worth#--
export class FastXpub {
    private static readonly worker = new Worker("fastxpub.js");
    private static readonly wasmFile = FastXpub.getWasmFile();

    private static async getWasmFile() {
        const response = await window.fetch("fastxpub.wasm");

        if (!response.ok) {
            throw new Error(`Can't fetch: ${response.statusText}`);
        }

        return response.arrayBuffer();
    }
}
