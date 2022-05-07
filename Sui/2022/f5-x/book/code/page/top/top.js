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


//  //

const Links = args =>
{
	return { type: "div", class: "links", parts: [  ] };
};


//  //

export const Top = args =>
{
	const clock = { type: Clock };
	const h1 = { type: "h1", text: "Top", parts: [ clock ] };

	return { type: "div", class: "top-page", parts:[ h1 ] };
};


