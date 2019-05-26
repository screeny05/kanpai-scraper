import { KanpaiFilterFunction, KanpaiFilter } from './index';

interface KanpaiFilterMap {
    [key: string]: KanpaiFilterFunction;
}

export const FilterRegistry: KanpaiFilterMap = {
    date: (value: string) => new Date(value),
    number: (value: string) => Number.parseFloat(value)
}

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
