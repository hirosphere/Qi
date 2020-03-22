
let Value = class_def
(
	null,
	function()
	{
		var next_id = 1;

		this.Initiate = function( initial_vlaue, prime_client )
		{
			this.Value = initial_vlaue;
			this.Clients = {};
			if( prime_client ) this.Clients.prime = prime_client;
		};

		this.AddClient = function( client )
		{
			let id = next_id ++;
			this.Clients[ id ] = client;
			client( this.Value );
		};

		this.Set = function( value, trigger )
		{
			if( this.Value == value && ! trigger )  return;
			this.Value = value;
			for( let id in this.Clients )
			{
				this.Clients[ id ]( value );
			}
		};

		this.Get = function()
		{
			return this.Value;
		};
	}
);

let Measure = class_def
(
	null,
	function( base, This )
	{
		this.RMin = 0;
		this.RMax = 100;
		this.RStep = 1;
		this.Scale = 1;

		this.Initiate = function( args )
		{
			if( args ) for( let fn in args ) this[ fn ] = args[ fn ];
		};

		this.VtoM = function( value )
		{
			return this.Scale * value;
		};

		this.MtoV = function( measure )
		{
			return measure / this.Scale;
		};
	}
);
Measure.Default = new Measure;

let Slider = function( com, value, args, measure )
{
	measure = measure || Measure.Default;
	let e = q.range( com, args );
	
	e.min = measure.RMin;
	e.max = measure.RMax;
	e.step = measure.RStep;

	e.oninput = function() { value.Set( measure.MtoV( this.value ) ); };
	value.AddClient( ( value ) => { e.value = measure.VtoM( value ); } );
};

let Input = function( com, value, args, measure )
{
	measure = measure || Measure.Default;
	let e = q.e( "input", com, args );

	e.onkeypress = function( ev )
	{
		if( ev.key == "Enter" ) value.Set( measure.MtoV( this.value ) );
	};

	value.AddClient( ( value ) => { e.value = measure.VtoM( value ); } );
};
