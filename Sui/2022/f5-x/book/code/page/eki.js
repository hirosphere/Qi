import Navi from "../navi-index.js";


//  //

class Index extends Navi.Index
{
	constructor( src, composition )
	{
		super( src, composition );
		this.has_part.value = true;
	}

	parts_loaded = false;

	async load_parts()
	{
		if( this.parts_loaded )  return;
		this.parts_loaded = true;

		const p = this.prof();
		if( ! p ) return;

		// console.log( p.url( this.title.value ), p.propname );

		const res = await fetch( p.url( this.title.value ) );
		const cont = await res.json();
		const data = cont && cont.response;
		const tot = p.title || ( s => s );
		// console.log( data[p.propname ] );

		const parts = [];
		for( const item of data[ p.propname ] )
		{
			const title = tot( item );
			parts.push( new p.parttype( { title, name: title }, this ) );
		}

		this.parts.add( parts );
	}

	prof() {}
}

class RootIndex extends Index { prof() { return profs.root } }
class AreaIndex extends Index { prof() { return profs.area; } }
class PrefIndex extends Index { prof() { return profs.pref; } }
class LineIndex extends Index { prof() { return profs.line; } }
class StationIndex extends Navi.Index {}

const profs =
{
	root:
	{
		url() { return "http://express.heartrails.com/api/json?method=getAreas" },
		propname : "area",
		parttype : AreaIndex,
	},

	area:
	{
		url( title ) { return `http://express.heartrails.com/api/json?method=getPrefectures&area=${ title }` },
		propname : "prefecture",
		parttype : PrefIndex,
	},

	pref:
	{
		url( title ) { return `http://express.heartrails.com/api/json?method=getLines&prefecture=${ title }` },
		propname : "line",
		parttype : LineIndex,
	},

	line:
	{
		url( title ) { return `http://express.heartrails.com/api/json?method=getStations&line=${ title }` },
		propname : "station",
		parttype : StationIndex,
		title: i => i.name,
	},
};


//  //

export default { RootIndex };

