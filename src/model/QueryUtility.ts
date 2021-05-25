// https://github.com/andreashuber69/net-worth#--
import { QueryError } from "./QueryError";

export class QueryUtility {
    public static async execute(query: () => Promise<number | undefined>) {
        try {
            return {
                result: await query(),
                status: "",
            };
        } catch (e: unknown) {
            if (e instanceof QueryError) {
                return {
                    result: Number.NaN,
                    status: e.message,
                };
            }

            throw e;
        }
    }
}
