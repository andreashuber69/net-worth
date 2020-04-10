// https://github.com/andreashuber69/net-worth#--
// eslint-disable-next-line import/unambiguous
declare module "bs58check" {
    export function decode(str: string): Buffer;
    export function encode(buffer: Buffer): string;
}
