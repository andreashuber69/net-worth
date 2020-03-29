// https://github.com/andreashuber69/net-worth#--
import { SortBy } from "./SortBy.schema";

export interface ISort {
    /** Provides the name of the property by which the asset list is currently sorted. */
    readonly by: SortBy;

    /** Provides a value indicating whether the sort order is descending. */
    readonly descending: boolean;
}
