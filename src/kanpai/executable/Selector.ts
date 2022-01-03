import { Context } from "../../dom/Context";
import { Element } from 'parse5-htmlparser2-tree-adapter';

/**
 * A function, mapping a context to a new context.
 * This is useful, if you need a more complex way to select elements.
 */
export type KanpaiSelectorFunction = (context: Context) => Context | Element | Element[];

/**
 * A selector is either css-selector as a string or a KanpaiSelectorFunction
 * for more complex selectors.
 * @see KanpaiSelectorFunction
 */
export type KanpaiSelector = string | KanpaiSelectorFunction;

export const executeSelector = (context: Context, selector: KanpaiSelector): Context => {
    if(typeof selector === 'string'){
        return context.select(selector);
    }

    const selected = selector(context);
    if(selected instanceof Context){
        return selected;
    }
    return new Context(selected);
};
