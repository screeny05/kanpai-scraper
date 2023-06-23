import { KanpaiFilterFunction, KanpaiFilter } from './index';

interface KanpaiFilterMap {
    [key: string]: KanpaiFilterFunction;
}

const InternalFilterRegistry = {
    date: (value: string) => new Date(value),
    number: (value: string) => Number.parseFloat(value),
    trim: (value: string) => value.trim(),
    undefinedIfFalsy: (value: string) => value || undefined
} as const

export type BuiltinFilterKey = keyof typeof InternalFilterRegistry;
export const FilterRegistry: KanpaiFilterMap = InternalFilterRegistry;

export const registerFilter = (name: string, filter: KanpaiFilterFunction): void => {
    FilterRegistry[name] = filter;
};

export const executeFilter = (value: string, filter: KanpaiFilter) => {
    const filterFn = typeof filter === 'string' ? FilterRegistry[filter] : filter;

    if(!filterFn){
        throw new Error(`Kanpai Filter ${filter} not found.`);
    }

    return filterFn(value);
}

export const executeFilterChain = (value: string, filters: KanpaiFilter[]) => {
    return filters.reduce((value: string, filter) => executeFilter(value, filter), value);
}