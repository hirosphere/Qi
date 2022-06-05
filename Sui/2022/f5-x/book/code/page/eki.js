import { Leaf } from "../../../base/model.js";
import Navi from "../navi-index.js";

const baseurl = "https://express.heartrails.com/api/json?method=";


// Index //

class Index extends Navi.Index
{
	constructor( args )
	{
		super( args );
		this.has_part.value = this._has_part;
	}

	_has_part = true;

	parts_loaded = false;

	async fetch()
	{
		if( this.parts_loaded )  return;
		this.parts_loaded = true;

		// console.log( "fetch", this.title.value );

		const url = baseurl + this.url();
		const res = await fetch( url );
		const cont = await res.json();
		const data = cont && cont.response;
		//  console.log( data[p.propname ] );

		const parts = [];
		let order = 0;
		for( const p_data of this.list( data ) )
		{
			const p_src = this.part_src( p_data );
			parts.push( new this.Part( { src: p_src, composition: this, order: order ++ } ) );
		}

		this.parts.add( parts );
		this.mon.url.value = url;
		this.mon.json.value = JSON.stringify( cont, null, "	" );
	}

	part_src( data ) { return { name: data, title: data }; }

	get_content_def( location )
	{
		return { type: Frame, index: this, location };
	}

	mon =
	{
		url: new Leaf( "" ),
		json: new Leaf( "" ),
	};
}


class StationIndex extends Navi.Index
{
	get_content_def()
	{
		return { type: Station, index: this };
	}

	_has_part = false;
}


class LineIndex extends Index
{
	url() {  return "getStations" + "&line=" + this.title.value; }
	list( data ) { return data.station };
	Part = StationIndex;

	part_src( data ) { return { name: data.name, title: data.name, data }; }
}


class PrefIndex extends Index
{
	url() {  return "getLines" + "&prefecture=" + this.title.value; }
	list( data ) { return data.line; };
	Part = LineIndex;
}


class AreaIndex extends Index
{
	url() {  return "getPrefectures" + "&area=" + this.title.value; }
	list( data ) { return data.prefecture; };
	Part = PrefIndex;
}


class RootIndex extends Index
{
	constructor( src, composition )
	{
		super( src, composition );
	}

	url() { return "getAreas"; }
	list( data ) { return data.area; };
	Part = AreaIndex;
}


// HTML DOM //

// Station Page //

const row = ( name, value ) =>
{
	const parts =
	[
		{ type: "td", text: name },
		{ type: "td", text: value },
	];

	return { type: "tr", parts };
};

const Station = args =>
{
	const { index, location } = args;

	const table =
	{
		type: "table",
		parts:
		[
			row( "郵便番号", "〒" + index.data.postal.slice( 0, 3 ) + "-" + index.data.postal.slice( 3 ) ),
			row( "北緯", index.data.y ),
			row( "東経", index.data.x ),
			row( "前駅", index.data.prev ),
			row( "次駅", index.data.next ),
		]
	};

	const main =
	{
		type: "div", class: "Eki content col-flex",
		parts:
		[
			{ type: "h1", text: index.title },
			{ type: "p", class: "-url", text: index.path.slice( -5 ).map( i => i.title.v ).join( " - " ) },
			table,
		]
	};

	return main;
};

// List Page //

const ListItem = args =>
{
	const { index, location } = args;

	const click = ev =>
	{
		ev.preventDefault();
		location.select( index );
	};

	const con = 
	{
		type: "a",
		class: "-item",
		attrs: { href: location.get_link( index ) },
		parts:
		[
			{ type: "span", class: "-nomble", text: index.order + 1 },
			{ type: "span", class: "-name", text: index.title }
		],
		events: { click },
	};

	return { type: "li", parts: [ con ] };
};

const Frame = args =>
{
	const { index, location } = args;

	index.fetch();

	//  //
	
	const list =
	{
		type: "ul",  class: "-list",
		parts:
		{
			model: index.parts,
			def: index => { return { type: ListItem, index, location }; },
		}
	};


	//  //

	const content =
	{
		type: "div", class: "-content",
		parts:
		[
			{
				type: "div", class: "-list-wrapper",
				parts: [ list ]
			},
			{ type: "textarea", class: "-monitor", props:{ value: index.mon.json }, },
		]
	};


	//  //

	const main =
	{
		type: "div", class: "Eki content col-flex",
		parts:
		[
			{ type: "h1", text: index.title },
			{ type: "p", class: "-url", text: index.mon.url },
			content
		]
	};

	return main;
};



// exports //

export default { RootIndex };

