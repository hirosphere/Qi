
const log = console.log;

import { Leaf, ArrayModel } from "./model.js";


//  //

class Component
{
	constructor( args, ce, mute )
	{
		if( ! args ) return;

		this.refs = new Refs();

		this.mainNode = this.createNode
		(
			this.expandDef( args ),
			ce, mute
		);
	}

	expandDef( args )
	{
		const { type } = args;
		if( type instanceof Function )  return this.expandDef( type( args, this ) );
		return args;
	}

	createNode( def, ce, mute )
	{
		const node =
			this.createTextNode( def ) ||
			this.createElement( def, mute );

		if( ce ) ce.appendChild( node );
		return node;
	}

	createTextNode( def )
	{
		if( def?.constructor == String )
		{
			const node = document.createTextNode();
			node.nodeValue = def;
			return node;
		}
	}

	createElement( def, mute )
	{
		const { type } = def;
		const { refs } = this;

		const e = document.createElement( type );

		if( mute ) e.style.display = "none";

		const { class: className, classSw } = def;

		if( className ) refs.bindProp( e, "className", className );
		if( classSw )  for( let name in classSw )  refs.bindClassSw( e, name, classSw[ name ] );

		const { attrs, props, style, acts, focus } = def;

		if( props ) for( let name in props )  refs.bindProp( e, name, props[ name ] );
		if( attrs ) for( let name in attrs )  refs.bindAttr( e, name, attrs[ name ] );
		if( style ) for( let name in style )  refs.bindProp( e.style, name, style[ name ] );
		if( acts  ) for( let name in acts  )  e.addEventListener( name, acts[ name ] );
		if( focus ) refs.bindAction( focus, () => { e.focus() } );

		const { text, parts, partSw } = def;
		if( text !== undefined ) refs.bindProp( e, "innerText", text );
		if( parts ) new Parts( this, e, parts, partSw );
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
	keys = {};

	constructor( compo, e, def, partSw )
	{
		compo.partsArray.push( this );

		this.compo = compo;
		this.e = e;
		this.mute = partSw != null;

		if( def instanceof Array )
		{
			def.forEach( partDef => this.createNode( partDef ) );
		}

		else if( def instanceof Object )
		{
			if( def.model instanceof ArrayModel )  this.setupDynamic( def );
		}

		this.makePartSw( partSw );
	}

	setupDynamic( def )
	{
		const { model, part } = def;
		const { refs } = this.compo;
		
		const bind = model =>
		{
			for( const item of model )
			{
				const key = item?.pageKey ?? item;
				const node = this.createNode( part( item ), key );
			}
		};
		
		refs.array( model, { bind } );
		model;
	}

	createNode( def, key )
	{
		if( ! def ) return;

		const { compo, e } = this;

		let node;

		if( def.type instanceof Function )
		{
			const partCompo = new Component( def, e, this.mute );
			compo.partComponents.push( partCompo );
			
			node = partCompo.mainNode;
		}
		
		else
		{
			node = compo.createNode( def, e, this.mute );
		}
		
		if( key != null && node instanceof HTMLElement ) this.keys[ key ] = node;

		return node;
	}

	makePartSw( leaf )
	{
		if( ! leaf ) return;

		log( leaf );

		this.makeKeyPSw( leaf );
	}

	makeKeyPSw( leaf )
	{
		const { refs } = this.compo;
		
		const update = ( newKey, oldKey ) =>
		{
			const newE = this.keys[  newKey?.pageKey ?? newKey  ];
			const oldE = this.keys[  oldKey?.pageKey ?? oldKey  ];

			if( oldE ) oldE.style.display = "none";
			if( newE ) newE.style.display = "";
		};

		refs.bindLeaf( leaf, null, update );
	}

	terminate() {}
}


//  //

class Refs
{
	bindAction( action, act )
	{
		const ref = action.createRef( act );
		this.refs.push( ref );
	}

	bindProp( target, name, value, convs )
	{
		const update = value => target[ name ] = value;
		this.bindLeaf( value, convs, update );
	}

	bindAttr( e, name, value, convs )
	{
		const update = value =>
		{
			e.setAttribute( name, value );
		};
		
		this.bindLeaf( value, convs, update );
	}

	bindClassSw( e, name, value )
	{
		const update = state =>
		{
			e.classList.toggle( name, state );
		};

		this.bindLeaf( value, null, update );
	}

	bindLeaf( value, convs, update )
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
