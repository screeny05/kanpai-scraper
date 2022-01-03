# kanpai-scraper
A currently undocumented and untested library for modern, fast & declarative web-scraping.

This library uses [parse5](https://github.com/inikulin/parse5) and [Typescript](https://www.typescriptlang.org/).

## Installation
```
npm install kanpai-scraper
```

## Getting started
```javascript
import { executeKanpai } from 'kanpai-scraper';

executeKanpai(html, {
    name: '.category-name',
    products: ['.product-box', {
        name: '.product-box--name',
        price: ['$', '[data-price]', 'number'],
    }]
});
```

Or using the Kanpai-DSL
```
name: .category-name;
products[]: .product-box {
    name: .product-box--name;
    price: $ | [data-price] | number;
}
```
