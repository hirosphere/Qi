

//  //

const ListItem = ( args, { refs } ) =>
{
	const { index } = args;

	return {
		type: "li",
		class: "ListItem",
		classSw: { selected: index.selected },
		text: index.title,
		acts: {
			mousedown( ev )
			{
				index.select();
			}
		}
	};
};

const List = ( args, {} ) =>
{
	const { index, class: cname = "List" } = args;

	return {
		type: "ul",
		class: cname,
		parts: {
			arrayModel: index.parts,
			create( index )
			{
				return { type: ListItem, index };
			}
		}
	};
};


//  //

export default { List, ListItem };
