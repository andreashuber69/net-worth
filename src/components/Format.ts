// https://github.com/andreashuber69/net-worth#--
export class Format {
    /** @internal */
    public static value(num: number | undefined, maximumFractionDigits: number, minimumFractionDigits?: number) {
        if (num === undefined) {
            return "";
        } else if (Number.isNaN(num)) {
            return "Error";
        }

        return Format.format(num, maximumFractionDigits, minimumFractionDigits);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private static format(num: number, maximumFractionDigits: number, minimumFractionDigits?: number) {
        return num.toLocaleString(
            undefined,
            { maximumFractionDigits, minimumFractionDigits, useGrouping: true },
        );
    }
}
