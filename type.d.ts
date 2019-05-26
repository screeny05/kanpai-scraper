type Htmlparser2Element = import("parse5-htmlparser2-tree-adapter").Element;
type Htmlparser2Node = import("parse5-htmlparser2-tree-adapter").Node;

declare module 'domelementtype' {
    export const Text: string;
    export const Directive: string;
    export const Comment: string;
    export const Script: string;
    export const Style: string;
    export const Tag: string;
    export const CDATA: string;
    export const Doctype: string;
    export const isTag: (elem: Htmlparser2Element | Htmlparser2Node) => elem is Htmlparser2Element;
}

declare module 'map-obj';
