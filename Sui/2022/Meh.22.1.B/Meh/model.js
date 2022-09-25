
const log = console.log;

//  //

class Action
{
	constructor()
	{
		this.priv = { refs: {}, };	
	}

	//  //

	do()
	{
		const { refs } = this.priv;
		for( let id in refs ) refs[ id ].action();
	}

	// refs //

	createRef( action )
	{
		const ref = new Action.Ref( this, action );
		this.priv.refs[ ref.id ] = ref;
		return ref;
	}

	removeRef( ref )
	{
		delete this.priv.refs[ ref.id ];
	}
}

Action.Ref = class
{
	constructor( source, action )
	{
		this.id = "ar-" + Action.Ref.nextId ++;
		this.source = source;
		this.action = action;
	}

	do()
	{
		this.source?.do();
	}

	release()
	{
		this.source?.removeRef( this );
	}

	static nextId = 1;
}



//  //

class Leaf
{
	constructor( value, args = {} )
	{
		this.priv =
		{
			value,
			rel: args.rel,
			refs: {},
		};
	
	}

	// refs //

	createRef( opers )
	{
		const ref = new Leaf.Ref( this, opers );

		this.priv.refs[ ref.id ] = ref;
		ref.update( this.priv.value, undefined, {} );
		
		return ref;
	}

	removeRef( ref )
	{
		delete this.priv.refs[ ref.id ];
	}

	static makeRef( leaf, opers )
	{
		return leaf instanceof Leaf ? leaf.createRef( opers ) : new Leaf.Ref();
	}

	// value //

	set( newValue, sender )
	{
		const oldValue = this.priv.value;
		if( newValue === oldValue ) return;

		this.priv.value = newValue;


		const { refs, rel } = this.priv;
		rel?.( newValue, oldValue );
		for( let id in refs ) refs[ id ].update( newValue, oldValue, { sender } );
	}
	
	get value() { return this.priv.value; }
	set value( value ) { this.set( value, null ); }
	
	//  //
};

Leaf.String = class extends Leaf {}
Leaf.Number = class extends Leaf {}
Leaf.Boolean = class extends Leaf {}
Leaf.Object = class extends Leaf {}

Leaf.Ref = class
{
	constructor( source, opers = {} )
	{
		this.id = "lr-" + Leaf.Ref.nextId ++;
		this.source = source;
		this.opers = opers;
	}

	update( newValue, oldValue )
	{
		const { update } = this.opers;
		update?.( this.toRef( newValue ), this.toRef( oldValue ) );
	}

	toRef( value )
	{
		const { toRef } = this.opers;
		return toRef ? toRef( value ) : value;
	}

	set value( value )
	{
		if( ! this.source )  return;

		const { toModel } = this.opers;
		
		this.source.set( toModel ? toModel( value ) : value, this );
	}

	get value() { return this.source?.value; }

	release()
	{
		this.source?.removeRef( this );
	}

	static nextId = 1;
}

//  //

class Branch
{
	constructor( args = {} )
	{
		const { default: defValue = {}, vars, rels, update } = BranchMakeDef( this );

		const rel = value => BranchUpdate( this, vars, rels, update );

		if( vars ) for( let name in vars )
		{
			const value = args.value?.[ name ] ?? defValue[ name ];
			this[ name ] = new Leaf( value, { rel } );
		}

		if( rels ) for( let name in rels )
		{
			this[ name ] = new Leaf();
		}

		BranchUpdate( this, vars, rels, update );
	}
}

const BranchMakeDef = ( self ) =>
{
	return self.constructor.def || {};
}

const BranchUpdate = ( self, vars, rels, update ) =>
{
	const values = {};
	for( let name in vars )  values[ name ] = self[ name ].value;
	const res = update?.( values );
	if( res ) for( let name in res )
	{
		if( name in rels ) self[ name ].value = res[ name ];
	}
}


//  //


class ArrayModel extends Array
{
	constructor()
	{
		super();

		this.priv =
		{
			refs: {},
		};
	}

	//  //

	createRef( opers )
	{
		const ref = new ArrayRef( this, opers );
		this.priv.refs[ ref.id ] = ref;
		ref.opers.bind?.( this );
		return ref;
	}

	removeRef( ref )
	{
		delete this.priv.refs[ ref.id ];
	}

	//  //

	get first() { return this[ 0 ] || null; }
	get last() { return this[ this.length - 1 ] || null; }

}

class ArrayRef
{
	constructor( source, opers = {} )
	{
		this.id = "ar" + ArrayRef.nextId ++;
		this.source = source;
		this.opers = opers;
	}

	release()
	{
		this.source?.removeRef( this );
	}

	static nextId = 1;
}


//  //

class Node
{
	constructor( srcValue, inits, expriv )
	{
		this.priv =
		{
			id: "node-" + Node.nextId ++,
			tree: inits.tree || null,
			com: inits.com || null,
			order : inits.order ?? 0,
			name: String( inits.name ?? srcValue.name ?? inits.order ?? "" ),
			parts: new ArrayModel,
			names: {},
			... expriv
		};

		// parts //

		const { parts } = srcValue;
		let order = 0;
		if( parts instanceof Array ) while( order < parts.length )
		{
			this.createPart( parts[ order ], { order, } );
			order ++;
		}
		else if( parts instanceof Object ) for( let name in parts )
		{
			this.createPart( parts[ name ], { order, name } );
			order ++;
		}
	}

	static nextId = 1;

	// accessors //

	get id() { return this.priv.id }
	get com() { return this.priv.com }
	get order() { return this.priv.order; }
	get name() { return this.priv.name; }
	get parts() { return this.priv.parts; }

	get next() { return this.com?.parts[ this.order + 1 ] || null; }
	get prev() { return this.com?.parts[ this.order - 1 ] || null; }

	//  //

	createPart( srcValue, inits )
	{
		const type = srcValue?.type ?? this.constructor;
		const part = new type( srcValue, { tree: this.tree, com: this, ...inits } );
		this.priv.parts.push( part );
		this.priv.names[ part.name ] = part;
	}

	//  //

	toString() { return this.id; }
}


//  //

class Tree
{

	build( srcValue )
	{
		this.root = srcValue && this.createNode( srcValue, { tree: this } ) || null;
	}

	createNode( srcValue, inits )
	{
		const type = srcValue?.type ?? this.defaultNode;
		return new type( srcValue, inits )
	}

	get defaultNode() { return Node }


}


//  //



//  //



//  //

export { Action, Leaf, Branch, ArrayModel, Tree, Node }
export default { Action, Leaf, Branch, ArrayModel, Tree, Node }

