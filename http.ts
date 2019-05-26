import { executeKanpai, KanpaiExecutable } from ".";
import { Context } from "./context";

export const kanpaiHttp = async function<T>(url: string, executable: KanpaiExecutable, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    const text = await response.text();
    const context = new Context(text);
    return executeKanpai<T>(context, executable);
};
