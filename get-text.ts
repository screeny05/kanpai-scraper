import { Element, Node, TextNode } from 'parse5-htmlparser2-tree-adapter';
import { Text, CDATA, isTag } from 'domelementtype';

const isTextNode = (el: Node): el is TextNode => el.type === Text;
const isCdata = (el: Node): el is Element => el.type === CDATA;

export const getText = (el: Element | Node | Node[], linebreakBetweenNodes = false): string => {
    if(Array.isArray(el)){
        return el.map(el => getText(el, linebreakBetweenNodes)).join(linebreakBetweenNodes ? '\n' : '');
    }
    if(isTag(el)){
        return el.name === 'br' ? '\n' : getText(el.children);
    }
    if(isTextNode(el)){
        return el.data;
    }
    if(isCdata(el)){
        return getText(el.children);
    }
    return '';
}