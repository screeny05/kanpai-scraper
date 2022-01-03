import kanpai from "./index";
import { KanpaiExecutable } from "./kanpai/executable/Executable";

export const kanpaiHttp = async function<T>(url: string, executable: KanpaiExecutable, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    const html = await response.text();
    return kanpai<T>(html, executable);
};
