
import { Leaf, Rems } from "../model/model.js";

//  //

class Component
{
	constructor( args, ce )
	{
		this.es = {};
		this.rems = new Rems();

		this.e = this.createNode
		(
			this.expandDef( args, this ),
			ce
		);
	}

	expandDef( args = {} )
	{
		const { type } = args;
		const { es, rems } = this;
	
		if( type != null && type.constructor == String ) return args;
	
		const dec = {};
		const terminate = () => this.terminate();
		const def = type( args, { es, rems, terminate } );
		return def;
	}
	
	createNode( def, ce )
	{
		const { rems } = this;

		if( def && def.constructor == String )
		{
			const t = document.createTextNode( def );
			ce.appendChild( t );
			return t;
		}

		else if( def instanceof Leaf )
		{
			const t = document.createTextNode( "" );
			rems.bind( def, value => t.nodeValue = value );
			ce.appendChild( t );
			return t;
		}
		
		//   //

		const { type, class: className, classSw } = def;
		const e = document.createElement( type );
		
		if( className ) e.className = className;
		if( classSw ) for( let name in classSw ) bindClassSwitch( e, name, classSw[ name ], rems );
		
		const { name, attrs, props, style, acts, focus  } = def;
		
		if( name != null ) self.es[ name ] = e;
		if( attrs ) for( let name in attrs ) bindAttribute( e, name, attrs[ name ], rems );
		if( props ) for( let name in props ) bindProp( e, name, props[ name ], rems );
		if( style ) for( let name in style ) bindProp( e.style, name, style[ name], rems );
		if( acts ) for( let name in acts ) e.addEventListener( name, acts[ name ] );
		if( focus ) bindFocus( e, focus, rems );
		
		const { text, parts, partSw } = def;
		
		if( text != null )  bindProp( e, "innerText", text, rems );
		if( parts )
		{
			if( parts instanceof Array ) new StaticParts( e, parts, this, partSw );
			else if( parts instanceof Object ) new DynamicParts( e, parts, this, partSw );
		}

		if( ce && ce.constructor == String ) ce = document.querySelector( ce );
		if( ce ) ce.appendChild( e );
		
		return e;
	}

	terminate()
	{
		this.rems.do();
	}
}

class Parts
{
	constructor( e, def, component, partSw )
	{
		this.e = e;
		this.component = component;
		this.partSw = partSw;
		this.keys = {};

		this.build( def );

		const updateSwitch = ( partSw instanceof Leaf && partSw.value != null ) &&
		(
			partSw.value.constructor == Number ?
				( newOrder, oldOrder ) => this.updateOrderSwitch( newOrder, oldOrder ) :
				( newKey, oldKey ) => this.updateKeySwitch( newKey, oldKey )
		);

		updateSwitch && this.component.rems.bind( this.partSw, updateSwitch );
	}

	updateOrderSwitch( newOrder, oldOrder )
	{
		const o = this.e.childNodes[ oldOrder ];
		if( o instanceof HTMLElement ) o.style.display = "none";
		
		const n = this.e.childNodes[ newOrder ];
		if( n instanceof HTMLElement ) n.style.display = "";
	}

	updateKeySwitch( newKey, oldKey )
	{
		const o = this.keys[ oldKey ];
		if( o ) o.style.display = "none";

		const n = this.keys[ newKey ];
		if( n ) n.style.display = "";
	}

	createPart( def, key )
	{
		if( def === undefined ) return;
		
		let partElement;

		if( def.type && def.type.constructor == Function )
		{
			const pc = new Component( def, this.e );
			partElement = pc.e;
		}
		else
		{
			partElement = this.component.createNode( def, this.e, this.component );
		}

		if( this.partSw && partElement instanceof HTMLElement )
		{
			partElement.style.display = "none";
			this.keys[ key || def.partKey ] = partElement;
		}
	}

	terminate()
	{
		delete this.keys;
	}
}

class StaticParts extends Parts
{
	build( def )
	{
		def.forEach( def => this.createPart( def ) );
	}
}

class DynamicParts extends Parts
{
	build( def )
	{
		const
		{
			model,							//  { ArrayModel<X>
			createPart		//  ( X ) => ComponentDef }
		}
		= def;
		
		const { rems } = this.component;

		const view =
		{
			bind()
			{
				model.forEach( createpart );
			}
		};

		const createpart = key =>
		{
			const def = createPart( key );
			this.createPart( def, key );
		};

		rems.bind( model, view );
	}
}


//

const bindClassSwitch = ( e, name, state, rems ) =>
{
	rems.bind( state, state => e.classList.toggle( name, state ) );
};

const bindAttribute = ( e, name, value, rems ) =>
{
	rems.bind( value, value => e.setAttribute( name, value ) );
};

const bindProp = ( target, name, value, rems ) =>
{
	if( value === undefined ) return;
	rems.bind( value, value => { target[ name ] = value } );
};

const bindFocus = ( e, focus, rems ) =>
{
	rems.bind( focus, () => e.focus() );
};

//  //


//  //



//  //

const create = ( args, ce ) =>
{
	return new Component( args, ce );
};

export default { create }

