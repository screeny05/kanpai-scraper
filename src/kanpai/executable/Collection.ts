import mapObject from 'map-obj';
import { Context } from "../../dom/Context";
import { KanpaiOptions } from "../../types";
import { executeExecutable, KanpaiExecutable } from "./Executable";

export interface KanpaiCollection {
    [prop: string]: KanpaiExecutable;
}

/**
 * Assure argument is a Collection.
 * @param argument
 */
export const isKanpaiCollection = (argument: KanpaiExecutable): argument is KanpaiCollection => {
    return typeof argument === 'object' && !Array.isArray(argument);
};

export const executeCollection = (context: Context, object: KanpaiCollection, options: KanpaiOptions): any => {
    return mapObject(
        object,
        (key: string, value: KanpaiExecutable) => [key, executeExecutable(context, value, options)]
    );
};
