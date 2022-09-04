const l = console.log;
const log = console.log;

//  //

class Notable
{
	constructor( expriv )
	{
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
		const expriv =
		{
			value: args.value,
			source: args.source,
			refUpdate: args.refUpdate,
		};
		super( expriv );

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
		
		this._refUpdate();
		for( let id in this.priv.refs )  this.priv.refs[ id ].set( value );
		if( this.priv.source ) this.priv.source.set( value );
	}

	get() { return this.priv.value; }

	//  
}


//  //

class Refs
{
	addLeaf( value, update, make = true )
	{
		if( make ) value = Leaf.make( value );
		if( value instanceof Leaf ) return value.createRef( update );
		update( value );
	}
}


//  //

class Branch
{
	static newType( def )
	{
		const newType = class extends Branch {};
		return newType;
	}
}



//  //

class ArrayModel extends Array
{

}

//  //

class Tree
{
	constructor( { srcValue } )
	{
		l( "Tree" );

		this.root = new this.Node( srcValue, { tree: this } );
	}

	get Node() { return Node; }
}


//  //

class Node
{
	constructor( args = {}, { tree, comNode, name } )
	{
		this.priv =
		{
			tree,
			comNode,
			id: "n" + Node.nextId ++,
			names: {},
			parts: new ArrayModel,
		};

		if( comNode )
		{
			name = args.name ?? name;
			comNode.priv.names[ name ] = this;
			comNode.priv.parts.push( this );

			l( `Node ${ this.priv.id }`, name );
		}


		const { parts } = args;
		if( parts && parts instanceof Array ) for( const part of args.parts )  this.createPart( part, { tree, comNode: this } );
		if( parts && parts instanceof Object ) for( const name in args.parts )  this.createPart( parts[ name ], { tree, comNode: this, name } );
		
	}

	//  //

	get parts() { return this.priv.parts; }

	createPart( args, work )
	{
		return new this.priv.tree.Node( args, work );
	}

	//  //

	static nextId = 1;
}


//  //

export { Leaf, Refs, Branch, Tree, Node };
export default { Leaf, Refs, Branch, Tree, Node }

