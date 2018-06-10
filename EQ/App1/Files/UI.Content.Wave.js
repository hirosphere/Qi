
Content.Wave = class_def
(
	Content.Base,
	function()
	{
		this.Build = function( args )
		{
			this.Wave = null;
			this.AudioPlayer = args.Doc.AudioPlayer;

			this.e = q.div( null, { "class": "CONTENT_WAVE" } );

			this.Info1 = new DivPane( this, { Width: -1, Height: 25, Rel: 0, Class: "WAVE_INFO_1" } );
			this.CanvasPane = new EQGraph.CanvasPane( this, { Width: -1, Height: 100, Rel: 30 } );
			new AudioPane( this, { Width: -1, Height: 60, Player: this.AudioPlayer } );
			this.Info2 = new DivPane( this, { Width: -1, Height: 160, Rel: 0, Class: "WAVE_INFO_2" } );

			this.Layout = new Layout.Vert( { Sep: 1 } );
		};

		this.SetIndex = function( index )
		{
			this.Index = index;
			this.Update();
		};

		this.Update = function()
		{
			let self = this;
			this.Index && EQWave.Get( this.Index.Path, callback );

			function callback( wave )
			{
				//make_info_table( self.Info2.e, wave.Monitor );
				//make_info_table( self.Info2.e, wave.ChannelMonitor );
				//q.text( self.path, wave && wave.GetInfo() );
				self.Wave = wave;
				self.UpdateInfo1();
				self.AudioPlayer.Wave.Set( wave );
				self.CanvasPane.SetWave( wave );
			}
		};

		this.UpdateInfo1 = function()
		{
			let w = this.Wave;
			let info = `${ q.frac( w.MaxAcc, 2 ) }gal  ${ w.SampleTime }秒`;
			q.text( this.Info1.e, info );
		};

		function make_info_table( com, rows )
		{
			q.clr( com );
			let tbody = q.tbody( q.table( com ) );
			for( var row of rows )
			{
				let tr = q.tr( tbody );
				q.td( tr, { text: row[ 0 ], "class": "hdr" } );
				q.td( tr, { text: row[ 4 ] } );
				q.td( tr, { text: row[ 1 ] } );
				q.td( tr, { text: row[ 2 ] } );
				q.td( tr, { text: row[ 3 ] } );
			}
		};
	}
);

Content.Wave.FileInfoPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": "CONTENT_WAVE" } );
			this.title = q.h2( this.e, { "class": "CONTENT_WAVE_TITLE" } );
			this.path = q.div( this.e );

			let table = q.table( this.e, { "class": "WAVE_FILE_INFO" } );
			this.fileinfo = q.tbody( table );
		};
	}
);
