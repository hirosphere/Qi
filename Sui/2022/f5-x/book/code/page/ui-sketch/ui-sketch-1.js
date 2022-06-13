import { Leaf } from "../../../../base/model.js";
import { Range } from "../../ui.js";
import HSL from "./hsl.js";
import Switch from "./switch.js";

const Caption = args =>
{
	const text =
`入力
レイアウト
`;

	return { type: "p", text };
};

const UISketch = args =>
{
	const h1 = { type: "h1", text: args.index.title };
	const content = { type: "div", class: "page-content" };
	return { type: "div", class: "page", parts: [ h1, content ] };
};


export default { Main: UISketch, HSL, Switch };
