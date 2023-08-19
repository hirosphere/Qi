import { EA, DOM, Leaf, Model } from "../../meh/index.js";
import { Selector } from "../../meh/model/Selector.js";
import { csv as siteListCSV } from "./sitepub_all_utf8.js";

const log = console.log;

class Item { __ru = Symbol() ; fn(){} }

const list = new Model.Order < Item > ();

const item1 = new Item();

list.add( item1 );
list.add( item1 );
list.add( new Item );
list.add( new Item );
list.add( new Item );

list.items.forEach( item => item.fn() );

//  //

export namespace APP
{
	export class UIM
	{
		hoverCurrent = new SiteHover( null );
	}

	const SiteHoverPane = ( hover : SiteHover ) : EA =>
	{
		const info = new Leaf.String( "" );

		hover.createRef( site => info.value = site ? `${ site?.code } ${ site.name } ${ site.name_r } - ${ site.pref }` : "..." )

		return { type: "div", text: info };
	}

	export const UI = () : EA =>
	{
		const uim = new UIM();
	
		const parts =
		[
			{ type: "h2", text: "EQ-Map" },
			SiteHoverPane( uim.hoverCurrent ),
			Map.UI( uim.hoverCurrent ),
		];
	
		return { type: "div", class: "EQ-Map", parts };
	};
}

namespace Map
{
	// GUI model //

	class UIM
	{
		sites = getSiteList();
		selector = new Selector < Site >;
	}

	// GUI //

	const MapPoint = ( selector : Selector < Site >, site : Site, hover : SiteHover ) : EA =>
	{
		const ref = selector.makeRef( site );

		const size = 5;
		const off = size / 2;

		const style =
		{
			position: "absolute",
			top: String( ( 700 - ( site.lat - 23 ) * 29 ) - off ) + "px",
			left: String( ( ( site.long - 122.5 ) * 29 ) -off ) + "px",
			width: String( size ) + "px",
			height: String( size ) + "px",
			borderRadius: String( 3 ) + "px",
			cursor: "default"
		};

		const click = () => ref?.select();
		const mouseover = () => hover.value = site;

		const attrs =
		{
			selected: ref?.selected
		};

		return { type: "div", class: "map-point", attrs, style, acts: { click, mouseover } };
	}

	export const UI = ( hover : SiteHover ) : EA =>
	{
		const uim = new UIM();

		uim.selector;

		const parts : DOM.Args.Parts = [];
		const keys = Object.keys( uim.sites );
		keys.forEach( key => parts.push( MapPoint( uim.selector, uim.sites[ key ], hover ) ) );

		const style =
		{
			background: "hsl( 205, 85%, 80% )",
			height: "700px",
			position: "relative",
			display: "absolute"
		};

		return { type: "div", class: "map", style, parts };
	};	
}

class SiteHover extends Leaf < Site | null > {}

const rand = < T extends Record < string, any > > ( obj : T, keys : string[] ) =>
{
	const i = Math.floor( Math.random() * keys.length );
	const key = keys[ i ];
	return obj[ key ];
};

//  //

type Site =
{
	__ru : symbol,
	code : string,
	name : string,
	name_r : string,
	lat : number,
	long : number,
	depth : string,
	x1 : string,
	pref : string,
	pref_r : string,
	lat_j : string, long_j : string,
	x2 : string, x3 : string, x4 : string, x5 : string
};

let siteList : Record < string, Site > | null = null;

const getSiteList = () =>
{
	if( siteList )  return siteList;

	const lines = siteListCSV.split( "\n" );
	const rt : Record < string, Site > = {};

	for( const line of lines )
	{
		const [ code, name, name_r, lat, long, depth, x1, pref, pref_r, lat_j, long_j, x2, x3, x4, x5 ] = line.split( "," );
		rt[ code ] = { __ru: Symbol(), code, name, name_r, lat: Number( lat ), long: Number( long ), depth, x1, pref, pref_r, lat_j, long_j, x2, x3, x4, x5 };
	}
	
	return siteList = rt;	
};
