const l = console.log;
import { Leaf, Rems } from "./model/model.js";

//  //

class Component
{
	constructor( args, ce )
	{
		this.es = {};
		this.rems = new Rems();
		this.node = this.createNode( args, ce );
	}

	expandDef( args )
	{		
		const { type } = args;
		if( type?.constructor != Function ) return args;

		const { es, rems } = this;
		const def = type( args, { es, rems } );
		return this.expandDef( def );
	}

	createNode( args, ce )
	{
		const node = createElement( this.expandDef( args ), this );

		if( ce )
		{
			if( ce && ce.constructor == String )  ce = document.querySelector( ce );
			ce.appendChild( node );
		}
	}

	terminate()
	{
		this.rems.clear();
	}
};

const createElement = ( def, component ) =>
{
	const { rems } = component;

	const { type, class: cname, classSw, attrs, props, acts } = def;	
	const e = document.createElement( type );

	if( cname !== undefined ) bindAttr( e, "class", cname, rems );
	if( classSw ) for( let name in classSw ) bindClassSw( e, name, classSw[ name ], rems );
	if( attrs ) for( let name in attrs ) bindAttr( e, name, attrs[ name ], rems );
	if( props ) for( let name in props ) bindProp( e, name, props[ name ], rems );
	if( acts ) for( let name in acts ) e.addEventListener( name, acts[ name ] );

	//

	const { text, parts } = def;
	bindProp( e, "innerText", text, rems );
	parts && new Parts( parts, e, component );

	return e;
};

const bindClassSw = ( e, name, state, rems ) =>
{
	rems.bind( state, state => e.classList.toggle( name, state ) );
}

const bindProp = ( target, name, value, rems ) =>
{
	if( value === undefined ) return;
	rems.bind( value, value => { target[ name ] = value }, false );
};

const bindAttr = ( e, name, value, rems ) =>
{
	const update = value =>
	{
		e.setAttribute( name, value ?? "" );
	};

	rems.bind( value, update, false );
};

//  //

class Parts
{
	constructor( def, e, component )
	{
		if( ! def ) return;

		if( def instanceof Array ) this.buildStatic( def, e, component );
		
		else  this.buildDynamic( def, e, component );
	}

	buildStatic( def, e, component )
	{
		def.forEach( def => component.createNode( def, e ) );
	}

	buildDynamic( def, e, component )
	{
		const { arrayModel, create } = def;

		if( arrayModel && create )
		{
			arrayModel.forEach
			(
				item => component.createNode( create( item ), e )
			);
		}
	}
}

//  //

const create = ( args, ce ) =>
{
	new Component( args, ce );
};


//  //

export default { create };

