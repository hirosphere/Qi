const l = console.log;
const log = console.log;

const deffn = x => x;

//  //

class Ref
{
	set source( value ) {}
}

class Notable extends Ref
{
	constructor( expriv )
	{
		super();
		this.priv =
		{
			id: "*" + Notable.nextId ++,
			refs: {},
			... expriv
		};
	}

	static nextId = 1;
}


//  //

class Leaf extends Notable
{
	constructor( args = {} )
	{
		const priv =
		{
			value: args.value,
			rel: args.rel,
			source: args.source,
			refUpdate: args.refUpdate,
		};
		super( priv );

		this._refUpdate();
	}

	//  static  //

	static make( value )
	{
		return value instanceof Leaf ? value : new Leaf( { value } );
	}

	//  src  //

	createRef( update )
	{
		const ref = new Leaf( { source: this, value: this.priv.value, refUpdate: update } );
		this.priv.refs[ ref.id ] = ref;
		return ref;
	}

	removeRef( ref ) { delete this.priv.refs[ ref.id ]; }

	//  ref  //

	_refUpdate()
	{
		if( this.priv.refUpdate ) this.priv.refUpdate( this.priv.value );
	}

	//  value  //

	set value( value ) { this.set( value ); }
	get value() { return this.priv.value; }

	set( value )
	{
		const oldv = this.priv.value;
		if( value === oldv ) return;

		this.priv.value = value;
		// l( `Leaf${ this.priv.id } set`, value, `>${ this.priv.source?.priv.id }` );
		
		this.priv.rel?.( value, oldv );
		this._refUpdate();
		for( let id in this.priv.refs )  this.priv.refs[ id ].set( value );
		if( this.priv.source ) this.priv.source.set( value );
	}

	get() { return this.priv.value; }

	//  
}

Leaf.String = Leaf;
Leaf.Number = Leaf;
Leaf.Boolean = Leaf;
Leaf.Object = Leaf;

Leaf.Ref = class
{
	constructor( args = {} )
	{
		const { update = deffn, toRef = deffn, toModel = deffn } = args;
		this.priv =
		{
			source: null,
		};
	}

	set source( leaf )
	{
		this.priv.source = leaf;
	}

	update( args )
	{
		const { toRef, toModel, update } = this.priv;
	}

	get value() { return this.source?.value; }

	set value( value )
	{
		if( this.source )  this.source.value = value;
		return value;
	}
}


//  //

class Rems
{
	refs = [];

	bind( value, update, make = true )
	{
		if( make ) value = Leaf.make( value );
		if( value instanceof Leaf )
		{
			const ref = value.createRef( update );
			this.refs.push( ref );
			return ref;
		}
		update( value );
	}

	release()
	{
		;
	}
}


//  //

class Branch
{
}



//  //

class ArrayModel extends Array
{

}

//  //

class Tree
{
	constructor()
	{
		this.priv =
		{
			root: null,
		};
	}

	get root() { return this.priv.root; }

}


//  //

class Node
{
	constructor( srcValue = {}, { tree, comNode, name } )
	{
		this.priv =
		{
			tree,
			comNode,
			id: "n" + Node.nextId ++,
			names: {},
			parts: new ArrayModel,
			buildParts: ( def ) =>
			{
				if( def && def instanceof Array ) for( const part of def )  this.createPart( part );
				if( def && def instanceof Object ) for( const name in def )  this.createPart( def[ name ] );
			}
		};

		if( comNode )
		{
			name = srcValue.name ?? name;
			if( name != null ) comNode.priv.names[ name ] = this;
			comNode.priv.parts.push( this );
		}
	}

	//  //

	get tree() { return this.priv.tree; }

	get PartClass() { return Node; }

	createPart( srcValue )
	{
		const PartClass = this.PartClass;
		return new PartClass( srcValue, { tree : this.priv.tree, comNode : this } );
	}

	get parts() { return this.priv.parts; }

	//  //

	static nextId = 1;
}


//  //

export { Leaf, Rems, Branch, Tree, Node };
export default { Leaf, Rems, Branch, Tree, Node }

