
const log = console.log;

import { Leaf, ArrayModel } from "./model.js";


//  //

class Component
{
	constructor( args, ce )
	{
		if( ! args ) return;

		this.refs = new Refs();

		this.e = this.createNode
		(
			this.expandDef( args ),
			ce
		);
	}

	expandDef( args )
	{
		const { type } = args;
		if( type instanceof Function )  return this.expandDef( type( args, this ) );
		return args;
	}

	createNode( def, ce )
	{
		const node =
			this.createElement( def );


		if( ce ) ce.appendChild( node );
		return node;
	}

	createElement( def )
	{
		const { type } = def;
		const { refs } = this;

		const e = document.createElement( type );

		const { class: className, classSw } = def;

		if( className ) refs.bind( e, "className", className );
		if( classSw )  for( let name in classSw )  refs.bindClassSw( e, name, classSw[ name ] );

		const { attrs, props, style, acts, focus } = def;

		if( props ) for( let name in props )  refs.bind( e, name, props[ name ] );
		if( attrs ) for( let name in attrs )  refs.bindAttr( e, name, attrs[ name ] );
		if( style ) for( let name in style )  refs.bind( e.style, name, style[ name ] );
		if( acts  ) for( let name in acts  )  e.addEventListener( name, acts[ name ] );
		if( focus ) refs.action( focus, () => { e.focus() } );

		const { text, parts } = def;
		if( text !== undefined ) refs.bind( e, "innerText", text );
		if( parts ) new Parts( this, e, parts );
		return e;
	}

	terminate()
	{
		this.partComponents.forEach( compo => compo.terminate() );
		this.partsArray.forEach( parts => parts.terminate() );
		this.refs.terminate();
	}

	partsArray = [];
	partComponents = [];
}

//  //

class Parts
{
	constructor( compo, e, def )
	{
		compo.partsArray.push( this );

		this.compo = compo;
		this.e = e;

		if( def instanceof Array )
		{
			def.forEach( partDef => this.createNode( partDef ) );
		}

		else if( def instanceof Object )
		{
			if( def.model instanceof ArrayModel )  this.setupDynamic( def );
		}
	}

	setupDynamic( def )
	{
		const { model, part } = def;
		const { refs } = this.compo;
		
		const bind = model =>
		{
			model.forEach( item => this.createNode( part( item ) ) );
		};
		
		refs.array( model, { bind } );
		model;
	}

	createNode( def )
	{
		if( ! def ) return;

		const { compo, e } = this;

		if( def.type instanceof Function )
		{
			const partCompo = new Component( def, e );
			compo.partComponents.push( partCompo );
			return partCompo.e;
		}
		
		else
		{
			return compo.createNode( def, e );
		}
	}

	terminate() {}
}


//  //

class Refs
{
	action( action, act )
	{
		const ref = action.createRef( act );
		this.refs.push( ref );
	}

	bind( target, name, value, convs )
	{
		const update = value => target[ name ] = value;
		this.leaf( value, convs, update );
	}

	bindAttr( e, name, value, convs )
	{
		const update = value =>
		{
			e.setAttribute( name, value );
		};
		
		this.leaf( value, convs, update );
	}

	bindClassSw( e, name, value )
	{
		const update = state =>
		{
			e.classList.toggle( name, state );
		};

		this.leaf( value, null, update );
	}

	leaf( value, convs, update )
	{
		if( value instanceof Array )
		{
			[ value, convs ] = value;
		}

		if( value instanceof Leaf )
		{
			const ref = value.createRef( { ...convs, update } );
			this.refs.push( ref ) ;
		}

		else update?.( value );
	}

	array( arrayModel, opers )
	{
		const ref = arrayModel.createRef( opers );
		this.refs.push( ref );
	}

	terminate()
	{
		this.refs.forEach( ref => ref.release() );
	}

	refs = [];
}


//  //

const create = ( args, ce ) =>
{
	if( ce && ce.constructor == String )  ce = document.querySelector( ce );

	const compo = new Component( args, ce );
	return () => compo.terminate();
}

export { create }
export default { create }
