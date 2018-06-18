
let WavePage = class_def
(
	null,
	function()
	{
		// 構築 //

		this.Initiate = function()
		{
			let listMode = new Value( 1 );

			this.e = q.vert( null, { "class": "WP" } );
			//this.BuildHead( listMode );
			this.BuildBody();

			let self = this;
			listMode.AddView( function ( value ) { self.Side.Select( value.Get() ); } );
		};

		this.BuildHead = function( listMode )
		{
			let e = q.horiz( this.e, { "class": "WP_Head" } );
			new UI.StateButton( e, Cu.Page.Wave.MapBt, listMode,
				function( value ){ value.Set( value.Get() ? 0 : 1 ); }
			);
		};

		this.BuildBody = function()
		{
			let e = q.horiz( this.e, { "class": "WP_Body" } );
			this.BuildBar( e );
			this.BuildSide( e );
			this.BuildContent( e );
		};

		this.BuildSide = function( com )
		{
			this.Side = new PageSwitch( com, "WP_Side" );
			this.Side.Add( new ListPane( null, "WP_Site_List" ), "0" );
			this.Side.Add( new MapPane( null, "WP_Site_Map" ), "1" );
		};

		this.BuildContent = function( com )
		{
			let e = q.vert( com, { "class": "WP_Content", text: "WP_Content" } );
			q.div(  )
		};

		this.BuildBar = function( com )
		{
			let e = q.vert( com, { "class": "WP_Bar" } );
		};

		// 操作 //

		this.SetWave = function( wave )
		{
			;
		};

		//  //
	}
);
