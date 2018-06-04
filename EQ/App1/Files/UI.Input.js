
let Measure = class_def
(
	null,
	function()
	{
	}
);

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

let SliderInput = class_def
(
	DivPane,
	function( base )
	{
		this.Build = function( args )
		{
			base.Build.call( this, args );

			let ic = args && args.IConv;
			let sc = args && args.SConv;

			new Label( this, { Width: 60, Height: -1, Rel: 0, Text: args.Text } );
			new Input( this, { Width: 45, Height: -1, Rel: 0, Value: args.Value, Conv: ic } );
			new Slider( this, { Width: 80, Height: -1, Rel: 10, Value: args.Value, Conv: sc } );

			this.Layout = new Layout.Horiz;
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
			this.Conv = args.Conv || this.Conv;

			this.e = q.input( null );
			this.e.type = "range";
		};
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




