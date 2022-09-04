const l = console.log;
import { Leaf, Refs } from "./model/model.js";

//  //

class Component
{
	constructor( args, ce )
	{
		this.es = {};
		this.refs = new Refs();
		this.node = this.createNode( args, ce );
	}

	expandDef( args )
	{		
		const { type } = args;
		if( type?.constructor != Function ) return args;

		const { es, refs } = this;
		const def = type( args, { es, refs } );
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
		this.refs.clear();
	}
};

const createElement = ( def, component ) =>
{
	const { refs } = component;

	const { type, class: cname, attrs, props, acts } = def;	
	const e = document.createElement( type );

	if( cname !== undefined ) bindAttr( e, "class", cname, refs );
	if( attrs ) for( let name in attrs ) bindAttr( e, name, attrs[ name ], refs );
	if( props ) for( let name in props ) bindProp( e, name, props[ name ], refs );
	if( acts ) for( let name in acts ) e.addEventListener( name, acts[ name ] );

	//

	const { text, parts } = def;
	bindProp( e, "innerText", text, refs );
	parts && new Parts( parts, e, component );

	return e;
};

const bindProp = ( target, name, value, refs ) =>
{
	if( value === undefined ) return;
	refs.addLeaf( value, value => { target[ name ] = value }, false );
};

const bindAttr = ( e, name, value, refs ) =>
{
	refs.addLeaf( value, value =>{ e.setAttribute( name, value ?? "" ) }, false );
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

		l( arrayModel , create )

		if( arrayModel && create )
		{
			arrayModel.forEach
			(
				item => component.createNode( create( item ), e )
			);

			arrayModel.forEach
			(
				item =>l( create( item ), item )
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

