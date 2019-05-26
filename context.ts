import { parse } from 'parse5';
import { Element, Node, TextNode } from 'parse5-htmlparser2-tree-adapter';
import * as htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter';
import { Text, CDATA, isTag } from 'domelementtype';
import { selectAll, compile as compileQuery, is as matchesSelector } from 'css-select';

const isTextNode = (el: Node): el is TextNode => el.type === Text;
const isCdata = (el: Node): el is Element => el.type === CDATA;

export class Context {
    document: Element | Element[];

    constructor(html: string | Element | Element[]){
        if(typeof html === 'string'){
            this.document = <Element>parse(html, { treeAdapter: htmlparser2Adapter });
        } else {
            this.document = html;
        }
    }

    isEmpty(): boolean {
        return !this.document || (Array.isArray(this.document) && this.document.length === 0);
    }

    select(selector: string){
        return new Context(selectAll(selector, this.document));
    }

    eq(index: number): Element {
        if(Array.isArray(this.document)){
            return this.document[index];
        }
        if(index !== 0){
            throw new Error('Context only has one element.');
        }
        return this.document;
    }

    parent(): Context {
        return new Context(this.map(ctx => <Element>ctx.eq(0).parent));
    }

    children(): Context {
        const childElements: Element[] = [];
        this.each(element => element.children.forEach(node => {
            if(!isTag(node)){
                return;
            }
            childElements.push(node);
        }));
        return new Context(childElements);
    }

    siblings(): Context {
        const siblings: Element[] = [];
        this.parent().children().each(element => {
            if(Array.isArray(this.document) ? this.document.indexOf(element) === -1 : element !== this.document){
                siblings.push(element);
            }
        });
        return new Context(siblings);
    }

    nextUntil(selector: string): Context {
        const nextElements: Element[] = [];
        const compiledSelector = compileQuery(selector);

        this.each((element: Node | Element) => {

            let matched = false;
            while(!matched && element.nextSibling){
                element = element.nextSibling;

                // skip non-elements
                if(!isTag(element)){
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

    map<T>(fn: (context: Context) => T): T[] {
        if(!Array.isArray(this.document)){
            return [fn(this)];
        }

        return this.document.map(element => fn(new Context(element)));
    }

    each(fn: (element: Element) => void): void {
        if(!Array.isArray(this.document)){
            fn(this.document);
            return
        }

        this.document.forEach(element => fn(element));
    }

    index(): number {
        const el = this.eq(0);
        return el.parent.children.filter(node => isTag(node)).indexOf(el);
    }

    text(){
        const getText = (el: Element | Node | Node[]): string => {
            if(Array.isArray(el)){
                return el.map(getText).join('');
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
        return getText(this.document);
    }

    attr(name: string){
        let el = this.document;

        if(Array.isArray(el)){
            el = el[0];
        }

        if(!el){
            return '';
        }

        return el.attribs[name];
    }
}
