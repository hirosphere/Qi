
//  Range  //

export const Range = args =>
{
	const { label, value, unit } = args;

	const parts =
	[
		{ type: "label", class: "label", text: label },
		{ type: "input", attrs: { type: "range", value }, events: { input: ev => value.v = + ev.target.value } },
		{ type: "span",  class: "value", text: value },
		{ type: "span",  class: "unit",  text: unit },
	];

	return { type: "div", class: "Range", parts };
};

//    //

export default { Range };
