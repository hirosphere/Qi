

//  //

const createTabIndex = ( selected, rems ) =>
{
	return rems.bind( selected, state => state ? 0 : -1 );
}

//  //

const ListItem = ( args, { rems } ) =>
{
	const { index } = args;
	const tabIndex = createTabIndex( index.selected, rems );

	return {
		type: "li",
		class: "ListItem",
		classSw: { selected: index.selected },
		attrs:{ tabIndex },
		acts: { keypress( ev ) { console.log( ev.key ) } },
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
