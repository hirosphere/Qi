import { Leaf, Ref } from "../model/Leaf.js";
const log = console.log;

//

export type EA = Args.Element;

//

export namespace ef
{
	export const div = ( args : Args.Element ) => ( { type: "div", ... args } );
	export const h2 = ( args : Args.Element ) => ( { type: "h2", ... args } );
}

export namespace Args
{
	export type Node = Element | Value;

	export interface Element
	{
		type ? : string ;
		hooks ? : Hooks ;
		class ? : Class ;
		attrs ? : Attrs ;
		props ? : Props ;
		style ? : Style ;
		acts ? : Acts ;
		text ? : Value ;
		parts ? : Parts;
	}

	export type Class = string | Record < string, Leaf.LoL.Boolean >;

	type Attrs = Record < string, Value > ;
	export type Props = Partial < Record < ElementProp, Value > > ;
	type Style = Record < CSSPropKey, Value > ;
	export type CSSPropKey = string ;
	export type Value = Leaf.LoL.String | Leaf.LoL.Number | Leaf.LoL.Boolean | undefined ;
	
	type Acts = Record < string, Act > ;
	type Act = ( ev : Event ) => void;

	export type Parts = Node[] ;
}

type ElementProp = "textContent" | "value";

//

interface Hooks { init ? : () => void ; }

class Component
{
	pfs = new Array < PartsFragment > ();
	refs = new Array < Ref > ();
	classSwitch = new Array < ClassSwitch >;

	constructor( def : Args.Node, ce : Element )
	{
		this.createNode( def, ce );
	}

	createNode( def : Args.Node, ce : Element )
	{
		if( def instanceof Leaf || typeof def == "string" || typeof def == "number" || typeof def == "boolean" )
		{
			this.createTextNode( def, ce );
		}

		else if( typeof def == "object" ) this.createElement( def, ce );
	}

	createElement( def : Args.Element, ce : Element )
	{
		if( ! def.type ) return;

		const e = document.createElement( def.type );

		const { class: classname, attrs, props, style, acts, text, parts } = def;

		if( classname )  this.bindClass( e, classname );
		if( attrs )  for( let name in attrs )  this.bindAttr( e, name, attrs[ name ] );
		if( props )  this.bindProps( e, props );
		if( style )  for( let name in style )  this.bindStyle( e, name, style[ name ] );
		if( acts )  for( let name in acts )  e.addEventListener( name, acts[ name ] );
		if( text != null )  this.bindProp( e, "textContent", text );
		if( parts )  new PartsFragment( this, e, parts );

		if( ce )  ce.appendChild( e );
	}

	createTextNode( value : Args.Value, ce : Element )
	{
		log( value )
		const n = document.createTextNode( "" );
		if( value instanceof Leaf ) {  }
		else n.nodeValue = String( value );
		ce?.appendChild( n );
	}

	bindClass( e : Element, value : Args.Class )
	{
		if( typeof value == "string" ) e.className = value;
		else this.classSwitch.push( new ClassSwitch( e, value ) );
	}

	bindAttr( e : Element, name : string, lol : Args.Value )
	{
		if( lol == null )  return;

		if( lol instanceof Leaf )
		{
			const update = () => e.setAttribute( name, String( lol.value ) );
			this.refs.push( lol.createRef( update ) );
		}

		else e.setAttribute( name, String( lol ) );
	}

	bindProps( e : Element, props : Args.Props )
	{
		for( let name in props )
		{
			this.bindProp( e, name as ElementProp, props[ name as ElementProp ] );
		}
	}

	bindProp( e : Element, name : ElementProp, lol : Args.Value )
	{
		if( lol == null )  return;

		if( lol instanceof Leaf )
		{
			const update = () => setProp( e, name, lol.value )
			this.refs.push( lol.createRef( update ) );
		}

		else setProp( e, name, lol );
	}

	bindStyle( e : HTMLElement, name : Args.CSSPropKey, lol : Args.Value )
	{
		if( lol instanceof Leaf )
		{
			;
		}

		else if( lol != null ) e.style.setProperty( name, String( lol ) );
	}

	terminate()
	{
		this.refs.forEach( ref => ref.release() );
	}
}

const setProp = ( e : Element, name : ElementProp, value : string | number | boolean ) =>
{
	if( name == "value" )
	{
		if( ( e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement ) )
		{
			e[ name ] = String( value );
		}
	}

	else e[ name ] = String( value );
};

//  //

class ClassSwitch
{
	refs = new Array < Ref > ;

	constructor( e : Element, value : Record < string, Leaf.LoL.Boolean > )
	{
		for( let className in value ) this.makeItem( e, className, value[ className ] );
	}

	makeItem( e : Element, className : string, lol : Leaf.LoL.Boolean )
	{
		if( lol instanceof Leaf )
		{
			const update = () => e.classList.toggle( className, lol.value );
			this.refs.push( lol.createRef( update ) );
		}

		else e.classList.toggle( className, lol );
	}

	terminate()
	{
		this.refs.forEach( ref => ref.release() );
	}
}

//  //

class PartsFragment
{
	constructor( compo : Component, e : Element, arg : Args.Parts )
	{
		compo.pfs.push( this );

		arg.forEach( partdef => compo.createNode( partdef, e ) );
	}
}

//  //

export const create = ( def : Args.Node, ce : Element | string ) =>
{
	if( typeof ce == "string" )
	{
		const ce2 = document.querySelector( ce );
		if( ce2 ) new Component( def, ce2 );
	}

	else if( ce instanceof Element ) new Component( def, ce );
	
	// log( ce, JSON.stringify( def, null, "\t" ) );
};

