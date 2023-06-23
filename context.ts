import { parse } from 'parse5';
import { Element, Node } from 'parse5-htmlparser2-tree-adapter';
import * as htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter';
import { isTag } from 'domelementtype';
import { compile as compileQuery, is as matchesSelector } from 'css-select';
import {select as cheerioSelectAll} from 'cheerio-select'
import { getText } from './get-text';

export class Context {
    document: Element | Element[];

    constructor(html: string | Element | Element[]){
        if(typeof html === 'string'){
            this.document = parse(html, { treeAdapter: htmlparser2Adapter }) as Element;
        } else {
            this.document = html;
        }
    }

    isEmpty(): boolean {
        return !this.document || (Array.isArray(this.document) && this.document.length === 0);
    }

    select(selector: string){
        return new Context(cheerioSelectAll(selector, this.document as any) as Element[]);
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

    filter(fn: (element: Element) => boolean): Context {
        if(!Array.isArray(this.document)){
            return fn(this.document) ? this : new Context([]);
        }
        return new Context(this.document.filter(fn));
    }

    index(): number {
        const el = this.eq(0);
        return el.parent.children.filter(node => isTag(node)).indexOf(el);
    }

    text(linebreakBetweenNodes = false): string {
        return getText(this.document, linebreakBetweenNodes);
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
