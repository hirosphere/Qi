
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

let Slider = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
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

			this.e = q.input( null );
			
			let self = this;
			this.e.onkeydown = function( ev )
			{
				if( ev.key == "Enter" )  {  self.Value.Set( this.value );  }
			};

			this.Value && this.Value.AddView( this );
			this.Update();
		};

		this.Change =
		this.Update = function()
		{
			this.e.value = this.Value && this.Value.Get() || "" ;
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




