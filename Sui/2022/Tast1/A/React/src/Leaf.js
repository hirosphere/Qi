
export const Leaf = class
{
	constructor( args )
	{
		const { value, rel } = args || {};
		this.priv.value = value;
		if( rel )
		{
			this.priv.rels.push( rel );
			rel.update();
		}
	}

	//

	static new( value, rel ) { return new Leaf( { value, rel } ) }

	//

	set shot( shot )
	{
		this.priv.shots.push( shot );
	}

	set view( view )
	{
		this.priv.views.push( view );
	}

	set rel( rel )
	{
		this.priv.rels.push( rel );
	}

	get value()
	{
		return this.priv.value;
	}

	set value( new_value )
	{
		this.priv.value = new_value;
		this.priv.views.forEach( view => view( new_value ) );
		this.priv.rels.forEach( rel => rel.update() );
		this.priv.shots.forEach( shot => shot( new_value ) );
		this.priv.shots = [];
	}

	// 

	priv = { shots: [], rels: [], views: [] };
};

export const Rel = class extends Leaf
{
	constructor( args )
	{
		super( args );

		const { calc, src } = args || {};
		this.priv.calc = calc || ( () => 0 );
		if( src )
		{
			this.priv.src = src;
			for( let name in src ) src[ name ].rel = this;
		}
		this.update();
	}

	update()
	{
		this.value = this.priv.calc( this.getsrc() );
	}

	getsrc()
	{
		const src = {};
		if( this.priv.src ) for( let name in this.priv.src ) src[ name ] = this.priv.src[ name ].value;
		return src;
	}
}
