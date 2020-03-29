// https://github.com/andreashuber69/net-worth#--
export const arrayOfAll = <T>() => <U extends readonly T[]>(
    ...array: U & (readonly T[] extends ReadonlyArray<U[number]> ? unknown : never)
): Readonly<typeof array> => array;
