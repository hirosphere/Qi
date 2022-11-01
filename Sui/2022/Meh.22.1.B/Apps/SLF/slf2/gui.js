

//  //

const PropListItem = args =>
{
	;

	return {
		type: "div", class: "item",
		parts:[
			{ type: "label", class: "title", text: args.title },
		],
	};
};


//  //

export default
{
	PropListItem,
};
