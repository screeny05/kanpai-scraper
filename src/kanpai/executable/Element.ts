import { Context } from "../../dom/Context";
import { KanpaiOptions } from "../../types";
import { KanpaiExecutable } from "./Executable";
import { executeFilter, KanpaiFilter } from "./Filter";
import { executeSelector, KanpaiSelector } from "./Selector";

export type KanpaiElement = KanpaiSelector | [KanpaiSelector, string] | [KanpaiSelector, string, KanpaiFilter];

/**
 * Assure argument is an Element.
 * @param argument
 */
export const isKanpaiElement = (argument: KanpaiExecutable): argument is KanpaiElement => {
    if(Array.isArray(argument)){
        if(argument.length < 2){
            return false;
        }
        argument = argument[0];
    }
    return typeof argument === 'string' || typeof argument === 'function';
};

const ATTRIBUTE_REGEX = /^\[(.*)\]$/;

/**
 * Return the value the user wants to select.
 * Currently supported is the text-value or an attribute-value.
 * @param context
 * @param property
 */
const getPropertyValue = (context: Context, property: string = 'text'): string => {
    if(property === 'text'){
        return context.text();
    }

    const match = property.match(ATTRIBUTE_REGEX);
    if(match){
        return context.attr(match[1]) ?? '';
    }

    throw new Error(`Selection property ${property} unknown.`);
};

export const executeElement = (context: Context, selection: KanpaiElement, options: KanpaiOptions): any => {
    if(!Array.isArray(selection)){
        selection = [selection, 'text'];
    }
    const [selector, property, filter = null] = selection;

    // Allow user to pass $ for referencing the current context itself
    const element = selector === '$' ? context : executeSelector(context, selector);
    if(options.strict && element.isEmpty()){
        throw new Error(`KanpaiElement [Strict]: Selector '${selector}' returned no elements`);
    }

    const value = getPropertyValue(element, property);
    if(filter){
        return executeFilter(value, filter);
    }

    return value;
};
