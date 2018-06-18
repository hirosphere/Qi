
let Label = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.e( "label", null, { text: args && args.Text } );
		};
	}
);

let Slider = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.Value = args.Value;

			let attrs = { min: args.Min, max: args.Max, step: args.Step };
			fill( attrs, { min: 0, max: 1, step: 0.1 } );

			this.e = q.input( null, "range", { attrs: attrs } );

			let self = this;
			this.e.oninput = function()
			{
				self.Value.Set( self.VtoM( this.value ) );
			};

			this.Value && this.Value.AddView( this );
			this.Change();
		};

		this.Change = function()
		{
			this.e.value = this.Value && this.MtoV( this.Value.Get() );
		};

		this.MtoV = function( value ) { return value; };
		this.VtoM = function( value ) { return value; };

		function fill( a, b )
		{
			for( var name in b )
			{
				if( a[ name ] === undefined )  a[ name ] = b[ name ];
			}
		}

	}
);

let Input = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.Value = args.Value;
			this.Conv = args.Conv || this.Conv;

			this.e = q.input( null );
			
			let self = this;
			this.e.onkeydown = function( ev )
			{
				if( ev.key == "Enter" )  {  self.Value.Set( self.Conv.VtoM( this.value ) );  }
			};

			this.Value && this.Value.AddView( this );
			this.Update();
		};

		this.Change =
		this.Update = function()
		{
			this.e.value = this.Value && this.Conv.MtoV( this.Value.Get() );
		};

		this.Conv =
		{
			MtoV: function( mv ) { return mv; },
			VtoM: function( vv ) { return vv; }
		};
	}
);

let ButtonSelectPane = class_def
(
	HorizPane,
	function( base )
	{
		this.Build = function( args )
		{
			base.Build.call( this, args );

			let self = this;
			this.Selection = args.Selection;
		};

		this.AddItem = function( caption, size, tag )
		{
			let edef = { type: "button", text: caption };
			new Pane( this, { Width: size, Height: -1, edef: edef } );
		};
	}
);

let StateButton = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.Value = args.Value;
			this.Labels = args.Labels;

			let self = this;
			this.e = q.button( null );
			this.e.onclick = function() { self.OnClick(); };
			this.Value && this.Value.AddView( this );
			this.Update();
		};

		this.OnClick = function()
		{
			this.Value && this.Value.Set( ! this.Value.Get() );
		};

		this.Change =
		this.Update = function()
		{
			q.text( this.e, this.Value && this.Labels && this.Labels[ this.Value.Get() ] || "" );
		};
	}
);




