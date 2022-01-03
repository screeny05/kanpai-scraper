import { Element, Node, TextNode } from 'parse5-htmlparser2-tree-adapter';
import { Text, CDATA, isTag } from 'domelementtype';

/**
 * Determine whether the given element is a TextNode.
 * @param el
 */
const isTextNode = (el: Node): el is TextNode => el.type === Text;

/**
 * Determine whether the given element is a CDATA node.
 * @param el
 */
const isCdata = (el: Node): el is Element => el.type === CDATA;

export default {
    isTextNode,
    isCdata,
    isTag
}
