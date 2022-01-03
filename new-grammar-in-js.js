const extractRating = $ => $
	|> attr('class')
	|> lowercase
	|> extract('/(one|two|three|four|five)/')
	|> match({ one: 1, two: 2, three: 3, four: 4, five: 5 });

const detail = $ => ({
	title: css($)`.product_main h1` |> innerText,
	categoryPath: $ |> breadcrumb,
	price: css($, '.product_main .price_color') |> innerText |> extract('/(\\d+[.,]?\\d+?)/') |> number,
	currency: css($, '.product_main .price_color') |> innerText |> extract('/([£$€])/'),
	instock: css($, '.product_main .instock.availability') |> innerText |> extract('/\\((\\d+) available\\)/') |> number,
	isInstock: css($, '.product_main .instock [class*="icon-"]') |> attr('class') |> extract('/icon-(\\w)/') |> match({ ok: true, else: false }),
	rating: css($, '.product_main .star-rating') |> extractRating,
	reviewCount: css($, '.product_main .star-rating small') |> innerText |> extract('/$(\\d+)/') |> number,
	description: css($, '#product_description + p') |> innerText,
	information: css($, '.sub-header:contains(Product Information) + table tr') |> kanpai($ => ({
		key: css($, 'th') |> innerText,
		value: css($, 'td') |> innerText,
	})) |> keyValueToObject
})

function kanpai<T>(func: T): Promise<ReturnType<T>>{};

await kanpai('https://news.ycombinator.com/') |> detail;