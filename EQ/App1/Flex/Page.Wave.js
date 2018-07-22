
let WavePage = class_def
(
	null,
	function()
	{
		// 構築 //

		this.Initiate = function( app )
		{
			this.App = app;
			this.info = {};

			this.e = q.column( null, { "class": "WP_col" } );
			this.BuildBody();
		};

		this.BuildBody = function()
		{
			let e = q.row( this.e, { "class": "WP_BODY_row" } );
			this.BuildBar( e );
			this.BuildSide( e );
			this.BuildContent( e );
		};

		this.BuildSide = function( com )
		{
			this.PeerList = new List( com, "WP_SITE_LIST", this.App.Doc.CurrentIndex, Cu.Index.Peer );
			//this.Map = this.Side.Add( new MapPane( null, "WP_SITE_MAP" ), "1" );
			//this.MapList = new MapList( this.Map, this.App.Doc.CurrentIndex );
		};

		this.BuildContent = function( com )
		{
			let e = q.div( com, { "class": "WP_CONTENT" } );
			this.Graph = new EQGraph.Pane( e, "WP_GRAPH", 400, 160 );
			this.Graph.Test();
			this.eInfo = q.div( e );
		};

		this.BuildBar = function( com )
		{
			let e = q.column( com, { "class": "WP_BAR_c" } );
		};

		// 操作 //

		this.SetWave = function( wave )
		{
			;
		};

		// イベント応答 //

		this.OnIndexChange = async function( index )
		{
			if( index && index.Site )
			{
				// this.Map.SetCenter( index.Site );
				// this.MapList.SetCurrent( index );
				this.PeerList.SetCurrent( index );
				this.UpdateInfo();
				this.info.Wave = index.GetWave().StartTimeStr;
			}
		};

		this.OnShow = function()
		{
			// this.Map.UpdateSize();
		};

		// 更新 //

		this.UpdateInfo = function()
		{
			var str = "";
			for( var fn in this.info )  str += `${fn} : ${this.info[fn]}`
			q.text( this.eInfo, str );
		};

	}
);
