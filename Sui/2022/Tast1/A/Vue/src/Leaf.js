export const Leaf = class
{
	constructor( args = {} )
	{
		this.priv.value = args.value;
	}

	//  //

	set( value ) { this.value = value; }

	set view( view )
	{
		this.views.push( view );
	}

	//  //

	get con() { return this.value; }
	set con( new_value ) { this.value = new_value; }

	get value()
	{
		return this.priv.value;
	}

	set value( new_value )
	{
		if( new_value === this.priv.value ) return;

		this.priv.value = new_value;
		this.priv.views.forEach(   view => view( new_value )   );
	}

	priv = { value: undefined, views: [] };

	toString()
	{
		return "Leaf " + String( this.priv.value );
	}
};


export class Branch
{
}

Branch.newType = ( def = {} ) =>
{
	const type = class extends Branch
	{
		constructor( { value } )
		{
			super();
			const rel = new_value =>
			{
				new_value;
			};

			makeFields( this, def.fields, value, rel );
		}
	};

	const { methods } = def;

	if( methods ) for( let name in methods ) type.prototype[ name ] = methods[ name ];

	return type;
};

const makeFields = ( branch, fields, values = {}, rel ) =>
{
	if( fields ) for( let name in fields ) makeField( branch, name, fields, values, rel );
};

const makeField = ( branch, name, fields, values, rel ) =>
{
	const ctor = fields[ name ];
	const value = values[ name ];
	branch[ name ] = new Leaf( { value: ctor( value ), rel } );
};
