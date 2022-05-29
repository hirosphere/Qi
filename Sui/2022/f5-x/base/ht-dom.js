import { Leaf } from "./model.js";


//  //

class Component
{
	e = null;
	es = {};

	constructor( args, ce, cc )
	{
		const def = this.build_def( args || {} );
		this.e = this.create_element( def, ce, this );
		this.init();
	}

	//  //

	init() {}
	term() {}

	// private //

	build_def( args, decor = {}, nest = 0 )
	{
		const { type } = args;

		if( type && type.constructor == Function )
		{
			const base = {};
			const def = type( args, this, decor, base );        //  type から def と decor の色付けを得る  //
			const rt = this.build_def( def, base, nest + 1 );  //  得られた def の type が基底クラスかもしれないので、再帰にて突き詰め。  //
			
			for( let name in decor )
			{
				this[ name ] = decor[ name ];
			}

			return rt;
		}

		return args;
	};

	create_element( def, ce )
	{
		const { type = "div", class: cname, name, clist, text } = def;
	
		const e = document.createElement( type );
	
		if( cname != null )  attach_prop( e, "className", cname );
		if( clist ) class_list( e, clist );
		if( text !== undefined )  attach_prop( e, "innerText", text );
		if( name != null ) this.es[ name ] = e;
		
		const { props, attrs, style, events, parts } = def;
	
		if( props )  for( let name in props )  attach_prop( e, name, props[ name ] );
		if( attrs )  for( let name in attrs )  attach_attr( e, name, attrs[ name ] );
		if( style )  for( let name in style )  attach_prop( e.style, name, style[ name ] );
		if( events )  for( let name in events )  e.addEventListener( name, events[ name ] );
	
		if( parts )  this.create_parts( parts, e );
	
		if( ce && ce.constructor == String )  ce = document.querySelector( ce );
		if( ce )  ce.appendChild( e );
	
		return e;
	};

	create_parts( def, e )
	{
		if( def.constructor == Array )
		{
			for( const pdef of def )  this.create_part( pdef, e );
		}

		else if( def.constructor == Object )
		{
			if( def.key ) new_switch( this, e, def );
			else new_array_view( this, e, def );
		}
	}

	create_part( def, ce )
	{
		if( ! def )  return;

		const { type } = def;
		if( type && type.constructor == Function )  new Component( def, ce, this );
		else  this.create_element( def, ce );
	}
}

const attach_attr = ( target, name, leafv ) =>
{
	if( leafv && leafv.is_leaf )
	{
		leafv.moreview = v => target.setAttribute( name, v );
	}
	else   target.setAttribute( name, leafv );
};

const attach_prop = ( target, name, leafv ) =>
{
	if( leafv && leafv.is_leaf  )  leafv.attach( target, name );
	else target[ name ] = leafv;
};


const class_list = ( e, list ) =>
{
	for( let name in list )
	{
		const state = Leaf.make( list[ name ] );
		state.moreview = value => e.classList.toggle( name, value || false );
	}
};


const new_switch = ( compo, ce, def ) =>
{
	console.log( "new_switch" );

	const key = Leaf.make( def.key );
	const partdef = def.def;
	const es = {};
	let curr = null;

	const get_e = key =>
	{
		if( es[ key ] ) return es[ key ];
		if( ! partdef )  return null;
		const pc = new Component( partdef( key ), ce, compo );
		return es[ key ] = pc.e;
	};

	key.moreview = key =>
	{
		if( curr ) curr.style.display = "none";
		curr = get_e( key );
		if( curr ) curr.style.display = "";
	};
};

const new_array_view = ( compo, ce, def ) =>
{
	const { model, def: part_def } = def;
	const muted = Leaf.make( def.muted, false );
	let created = false;

	const create_part = ( item, order ) =>
	{
		part_def && compo.create_part( part_def( item ), ce );
	};

	const hdls = {};

	hdls.bind = args =>
	{
		if( muted.value || created )  return;
		created = true;

		for( const item of model )
		{
			create_part( item );
		}
	};

	hdls.insert = args =>
	{
		const { start, count } = args;
		for( let ord = start; ord < start + count; ord ++ )  
		{
			const item = model[ ord ];
			item && create_part( item, ord );
		}
	}

	model.moreview = args =>
	{
		const hdl = hdls[ args.type ];
		hdl && hdl( args );
	};

	muted.moreview = state => hdls.bind();
};


//  //

const create = ( args, ce ) => new Component( args, ce, null );

export { Component, create };
