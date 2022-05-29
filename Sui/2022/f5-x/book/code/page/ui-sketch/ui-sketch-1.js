import { Leaf } from "../../../../base/model.js";
import { Range } from "../../ui.js";

const Caption = args =>
{
	const text =
`入力
レイアウト
`;

	return { type: "p", text };
};

const Main = args =>
{
	return {
		type: "div",
		class: "content",
		parts:
		[
			{ type: Caption },
			{ type: Range, title: "Range", value: new Leaf( 50 ) },
		]
	}
};

export default { Main };
