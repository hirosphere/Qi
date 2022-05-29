import { Minimal } from "./minimal.js";



//  //

const Main = args =>
{
	const { index } = args;

	const h1 = { type: "h1", text: index.title };
	const minimal = { type: Minimal };
	
	return { type: "div", class: "content Train", parts: [ h1, minimal ] };
};


//  //

export default { Main };

