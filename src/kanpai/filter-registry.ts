import { KanpaiFilterFunction } from "./executable/Filter";

/**
 * Object containing multiple filters, mapped by their name.
 */
interface KanpaiFilterCollection {
    [key: string]: KanpaiFilterFunction;
}

/**
 * Static object containing a collection of registered KanpaiFilterFunctions.
 * @see KanpaiFilterFunction
 */
export const FilterRegistry: KanpaiFilterCollection = {
    date: (value: string) => new Date(value),
    number: (value: string) => Number.parseFloat(value)
}

/**
 * Add a new KanpaiFilterFunction to the registry.
 * After registering, you can use it by referencing its name.
 * @param name
 * @param filter
 */
export const registerFilter = (name: string, filter: KanpaiFilterFunction): void => {
    FilterRegistry[name] = filter;
};
