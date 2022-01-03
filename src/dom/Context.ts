import { parse } from 'parse5';
import { Element, Node } from 'parse5-htmlparser2-tree-adapter';
import * as htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter';
import { selectAll, compile as compileQuery, is as matchesSelector } from 'css-select';
import NodeTypechecker from './NodeTypechecker';

/**
 * A Context represents an abstraction over a single or multiple dom-elements.
 * It acts similar to jQuery, insofar as it's a wrapper and provides multiple
 * convenience-functions to interact with the element. E.g. read data.
 */
export class Context {
    /**
     * The dom-element this context refers to.
     */
    document: Element[];

    constructor(html: string | Element | Element[]){
        if(Array.isArray(html)){
            this.document = html;
        } else if(typeof html === 'string'){
            this.document = [
                <Element>parse(html, {
                    treeAdapter: htmlparser2Adapter,
                })
            ];
        } else {
            this.document = [html];
        }
    }

    /**
     * Determine whether the context contains elements.
     */
    isEmpty(): boolean {
        return !this.document || this.document.length === 0;
    }

    /**
     * Retrieve a sub-context by a css-selector.
     * @param selector
     */
    select(selector: string){
        return new Context(selectAll(selector, this.document));
    }

    /**
     * Return the nth element as raw dom-element
     * @param index
     */
    eq(index: number): Element {
        return this.document[index];
    }

    /**
     * Retrieve a new context, wrapping all the current element(s) parent-elements.
     */
    parent(): Context {
        // TODO: parents should be de-duplicated to prevent a context with equal elements
        return new Context(this.document.map(element => <Element>element.parent));
    }

    /**
     * Retrieve a new context, wrapping all the child-elements of the current element(s).
     * Discards any element, which is not a dom-element. E.g. text, comments, etc.
     */
    children(): Context {
        const childElements: Element[] = [];
        this.document.forEach(element => element.children.forEach(node => {
            if(!NodeTypechecker.isTag(node)){
                return;
            }
            childElements.push(node);
        }));
        return new Context(childElements);
    }

    /**
     * Retrieve a new context, wrapping all the sibling-elements of the current element(s).
     */
    siblings(): Context {
        // Get all elements in this current tree-node, then filter out the current ones
        const siblings = this.parent().children().document.filter(element => {
            return !this.document.includes(element);
        });
        return new Context(siblings);
    }

    /**
     * Retrieve a new context, wrapping all following siblings of each element up to but
     * not including the element matched by the selector.
     * @param selector
     */
    nextUntil(selector: string): Context {
        const nextElements: Element[] = [];
        const compiledSelector = compileQuery(selector);

        this.document.forEach((element: Node | Element) => {
            let matched = false;
            while(!matched && element.nextSibling){
                element = element.nextSibling;

                // skip non-elements
                if(!NodeTypechecker.isTag(element)){
                    continue;
                }

                if(matchesSelector(element, compiledSelector)){
                    matched = true;
                    continue;
                }

                nextElements.push(element);
            }
        });
        return new Context(nextElements);
    }

    /**
     * Retrieve the index of the current element among its siblings
     */
    index(): number {
        const el = this.eq(0);

        // We have to filter out any node, that's not a real element, as they do not count towards the index.
        return el.parent.children.filter(node => NodeTypechecker.isTag(node)).indexOf(el);
    }

    /**
     * Retrieve the full text-content of the current element(s) and all its children.
     */
    text(): string {
        const getText = (el: Element | Node | Node[]): string => {
            if(Array.isArray(el)){
                return el.map(getText).join('');
            }
            if(NodeTypechecker.isTag(el)){
                return el.name === 'br' ? '\n' : getText(el.children);
            }
            if(NodeTypechecker.isTextNode(el)){
                return el.data;
            }
            if(NodeTypechecker.isCdata(el)){
                return getText(el.children);
            }
            return '';
        }
        return getText(this.document);
    }

    /**
     * Retrieve the attribute-value of the current element(s).
     * @param attrName
     */
    attr(attrName: string): string | undefined {
        if(this.document.length === 0){
            return '';
        }

        return this.document[0].attribs[attrName];
    }
}
