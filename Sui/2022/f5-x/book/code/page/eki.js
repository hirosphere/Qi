import { Leaf } from "../../../base/model.js";
import Navi from "../navi-index.js";

const baseurl = "https://express.heartrails.com/api/json?method=";


// Index //

class Index extends Navi.Index
{
	constructor( src, composition, order )
	{
		super( src, composition, order );
		this.has_part.value = this._has_part;
	}

	_has_part = true;

	parts_loaded = false;

	async load_parts()
	{
		if( this.parts_loaded )  return;
		this.parts_loaded = true;

		console.log( "load_parts", this.title.value );

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
			parts.push( new this.Part( p_src, this, order ++ ) );
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
	_has_part = false;
}


class LineIndex extends Index
{
	url() {  return "getStations" + "&line=" + this.title.value; }
	list( data ) { return data.station };
	Part = StationIndex;

	part_src( data ) { return { name: data.name, title: data.name }; }
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

const Item = args =>
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

	index.load_parts();

	//  //
	
	const list =
	{
		type: "ul",  class: "-list",
		parts:
		{
			model: index.parts,
			def: index => { return { type: Item, index, location }; },
		}
	};

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

