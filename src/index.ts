import { Context } from './dom/Context';
import { executeExecutable, KanpaiExecutable } from './kanpai/executable/Executable';
import { KanpaiOptions } from './types';

export { registerFilter } from './kanpai/filter-registry';
export { Context as KanpaiContext } from './dom/Context';
export { kanpaiHttp } from './http';

const defaultOptions: KanpaiOptions = {
    strict: true,
};

export function kanpaiWithContext<T>(context: Context, config: KanpaiExecutable, options: Partial<KanpaiOptions> = {}): T {
    return executeExecutable(context, config, {
        ...defaultOptions,
        ...options,
    });
};

export default function kanpai<T>(html: string, config: KanpaiExecutable, options: Partial<KanpaiOptions> = {}): T {
    const context = new Context(html);
    return kanpaiWithContext(context, config, options);
};
