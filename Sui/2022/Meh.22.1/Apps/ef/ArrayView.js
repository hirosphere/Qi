import { ArrayModel } from "../../Meh/vanil/meh.js";

export const ArrayView = args =>
{
	const model = ArrayModel(  );

	return {
		type: "div", class: "ArrayView",
		text: "ArrayView",
		parts: {
			model,
		}
	};
};


