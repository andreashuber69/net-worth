// https://github.com/andreashuber69/net-worth#--
import { AssetPropertyName } from "./AssetInterfaces";

/** Defines an auxiliary property of type `T` for each of the properties of every asset. */
export type IAuxProperties<T> = { [K in AssetPropertyName]: T };
