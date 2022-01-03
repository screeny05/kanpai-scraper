import { FilterRegistry } from "../filter-registry";

export type KanpaiFilterFunction = (value: string) => any;
export type KanpaiFilter = string | KanpaiFilterFunction;

export const executeFilter = (value: string, filter: KanpaiFilter) => {
    const filterFn = typeof filter === 'string' ? FilterRegistry[filter] : filter;

    if(!filterFn){
        throw new Error(`Kanpai Filter ${filter} not found.`);
    }

    return filterFn(value);
}
