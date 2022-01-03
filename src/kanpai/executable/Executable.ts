import { Context } from "../../dom/Context";
import { KanpaiOptions } from "../../types";
import { KanpaiElement, isKanpaiElement, executeElement } from "./Element";
import { KanpaiIterator, isKanpaiIterator, executeIterator } from "./Iterator";
import { KanpaiCollection, isKanpaiCollection, executeCollection } from "./Collection";

export type KanpaiExecutable = KanpaiIterator | KanpaiCollection | KanpaiElement;

export const executeExecutable = (context: Context, argument: KanpaiExecutable, options: KanpaiOptions): any => {
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
