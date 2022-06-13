import { Leaf } from "../../../../base/model.js";


//  //

const Clock = args =>
{
	const text = new Leaf( "" );

	const tick = () =>
	{
		const date = new Date();
		text.value = date.toLocaleString();
		setTimeout( tick, 1000 - date.getTime() % 1000 );
	};

	tick();

	return { type: "div", class: "clock", text }
};


// Links //

const links_block_1 =
{
	title: "メイン",
	parts:
	[
		{ title: "Twitter", url: "https://twitter.com/" },
		{ title: "hirosphere", url: "https://twitter.com/hirosphere/with_replies" },
		{ title: "川越市", url: "https://weather.yahoo.co.jp/weather/jp/11/4310/11201.html" },
		{ title: "豊島区", url: "https://weather.yahoo.co.jp/weather/jp/13/4410/13116.html" },
		{ title: "千代田区", url: "https://weather.yahoo.co.jp/weather/jp/13/4410/13101.html" },
		{ title: "", url: "" },
	]
};

const links_block_2 =
{
	title: "趣味",
	parts:
	[
		{ title: "秋月電子", url: "https://akizukidenshi.com/catalog/" },
		{ title: "Top", url: "http://localhost/Home/#?Top" },
		{ title: "", url: "" },
	]
};

const links_data =
[
	links_block_1,
	links_block_2,
];

const Links = args =>
{
	const { data } = args;

	const parts =
	{
		def: data => { return { type: LinksBlock, data }; },
		model: data,
	};

	return { type: "div", class: "Links", parts };
};

const LinksBlock = args =>
{
	const { data } = args;
	
	const head = { type: "h2", text: data.title };

	const itemdef = item =>
	{
		const a =
		{
			type: "a", text: item.title, attrs: { href: item.url, target: "_blank" }
		};
		return { type: "li", parts: [ a ] }
	};
	
	const content =
	{
		type: "ul",
		parts:
		{
			model: data.parts,
			def: itemdef
		}
	};
	
	return { type: "div", class: "Block", parts: [ head, content ] };
};

//  //

export const Top = args =>
{
	const { index } = args;
	const clock = { type: Clock };
	const h1 = { type: "h1", text: index.title, parts: [ clock ] };
	const links = { type: Links, data: links_data };
	return { type: "div", class: "Top", parts:[ h1, links ] };
};


