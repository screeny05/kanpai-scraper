import mapObject from 'map-obj';
import { Context } from './context';
import { executeFilter } from './filter-registry';

export { registerFilter } from './filter-registry';
export { Context as KanpaiContext } from './context';
export { kanpaiHttp } from './http';

export type KanpaiSelectorFunction = (context: Context) => Context;
export type KanpaiSelector = string | KanpaiSelectorFunction;

export type KanpaiFilterFunction = (value: string) => any;
export type KanpaiFilter = string | KanpaiFilterFunction;

export type KanpaiIterator = [KanpaiSelector, KanpaiCollection | KanpaiElement];
export type KanpaiElement = KanpaiSelector | [KanpaiSelector, string] | [KanpaiSelector, string, KanpaiFilter];
export type KanpaiExecutable = KanpaiIterator | KanpaiCollection | KanpaiElement;

export interface KanpaiCollection {
    [prop: string]: KanpaiExecutable;
}

export interface KanpaiOptions {
    strict: boolean;
}

const ATTRIBUTE_REGEX = /^\[(.*)\]$/;

/**
 * Assure argument is an Iterator
 * @param argument
 */
const isKanpaiIterator = (argument: KanpaiExecutable): argument is KanpaiIterator => {
    return Array.isArray(argument) && argument.length === 2 && typeof argument[0] === 'string' && typeof argument[1] === 'object';
};

/**
 * Assure argument is an Element
 * @param argument
 */
const isKanpaiElement = (argument: KanpaiExecutable): argument is KanpaiElement => {
    if(Array.isArray(argument)){
        if(argument.length < 2){
            return false;
        }
        argument = argument[0];
    }
    return typeof argument === 'string' || typeof argument === 'function';
};

/**
 * Assure argument is a Collection
 * @param argument
 */
const isKanpaiCollection = (argument: KanpaiExecutable): argument is KanpaiCollection => {
    return typeof argument === 'object' && !Array.isArray(argument);
};

/**
 * Return the value the user wants to select
 * @param context
 * @param property
 */
const getPropertyValue = (context: Context, property: string = 'text'): string => {
    if(property === 'text'){
        return context.text();
    }

    const match = property.match(ATTRIBUTE_REGEX);
    if(match){
        return context.attr(match[1]);
    }

    throw new Error(`Selection property ${property} unknown.`);
};

const executeSelector = (context: Context, selector: KanpaiSelector): Context => {
    if(typeof selector === 'function'){
        return selector(context);
    }
    return context.select(selector);
};

const executeElement = (context: Context, selection: KanpaiElement, options: KanpaiOptions): any => {
    if(!Array.isArray(selection)){
        selection = [selection, 'text'];
    }
    const [selector, property, filter = null] = selection;

    // Allow user to pass $ for referencing the current context itself
    const element = selector === '$' ? context : executeSelector(context, selector);
    if(options.strict && element.isEmpty()){
        throw new Error(`Strict Error: Selector '${selector}' returned no elements`);
    }

    const value = getPropertyValue(element, property);
    if(filter){
        /**
         * Seems there is a typescript bug:
         * `filter` is reported as being `string | KanpaiSelectorFunction | KanpaiFilterFunction`
         * While it clearly has to be `KanpaiFilter`, as `selection` is of type
         * `[KanpaiSelector, string] | [KanpaiSelector, string, KanpaiFilter]`
         */
        return executeFilter(value, <KanpaiFilter>filter);
    }

    return value;
};

const executeIterator = (context: Context, mapper: KanpaiIterator, options: KanpaiOptions): any[] => {
    const [selector, object] = mapper;
    return executeSelector(context, selector).map(context => executeExecutable(context, object, options));
};

const executeCollection = (context: Context, object: KanpaiCollection, options: KanpaiOptions): any => {
    return mapObject(object, (key: string, value: KanpaiExecutable) => [key, executeExecutable(context, value, options)]);
};

const executeExecutable = (context: Context, argument: KanpaiExecutable, options: KanpaiOptions): any => {
    if(isKanpaiIterator(argument)){
        return executeIterator(context, argument, options);
    }
    if(isKanpaiElement(argument)){
        return executeElement(context, argument, options);
    }
    if(isKanpaiCollection(argument)){
        return executeCollection(context, argument, options);
    }

    throw new TypeError(`Given argument ${JSON.stringify(argument)} is not valid.`);
}

export function executeKanpai<T>(context: Context, config: KanpaiExecutable, options: Partial<KanpaiOptions> = {}): T {
    const _options: KanpaiOptions = {
        strict: true,
        ...options
    };

    return executeExecutable(context, config, _options);
};
