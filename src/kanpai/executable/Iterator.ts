import { Context } from "../../dom/Context";
import { KanpaiOptions } from "../../types";
import { KanpaiCollection } from "./Collection";
import { KanpaiElement } from "./Element";
import { executeExecutable, KanpaiExecutable } from "./Executable";
import { executeSelector, KanpaiSelector } from "./Selector";

export type KanpaiIterator = [KanpaiSelector, KanpaiCollection | KanpaiElement];

/**
 * Assure argument is an Iterator.
 * @param argument
 */
export const isKanpaiIterator = (argument: KanpaiExecutable): argument is KanpaiIterator => {
    return Array.isArray(argument) &&
        argument.length === 2 &&
        typeof argument[0] === 'string' &&
        typeof argument[1] === 'object';
};

export const executeIterator = (context: Context, mapper: KanpaiIterator, options: KanpaiOptions): any[] => {
    const [selector, object] = mapper;
    return executeSelector(context, selector).document.map(context => (
        executeExecutable(new Context(context), object, options)
    ));
};
