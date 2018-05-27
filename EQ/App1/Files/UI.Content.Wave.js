
Content.Wave = class_def
(
	Content.Base,
	function()
	{
		this.Build = function()
		{
			this.AudioPlayer = new EQAudio.Player();

			this.e = q.div( null, { "class": "CONTENT_WAVE" } );

			this.CanvasPane = new EQGraph.CanvasPane( this, { Width: -1, Height: 60, Rel: 30 } );
			let div1 = new DivPane( this, { Width: -1, Height: 60, Rel: 0 } );
			let div3 = new DivPane( this, { Width: -1, Height: 60, Rel: 0, Class: "WAVE_FILE_INFO" } );

			this.Layout = new Layout.Vert();

			this.title = q.div( div1.e, { "class": "CONTENT_WAVE_TITLE" } );
			this.path = q.div( div1.e );

			let table = q.table( div3.e );
			this.fileinfo = q.tbody( table );
		};

		this.SetIndex = function( index )
		{
			this.Index = index;
			this.Update();
		};

		this.Update = function()
		{
			q.text( this.title, this.Index && this.Index.GetCaption() );
			q.text( this.path, this.Index && this.Index.Path );

			let self = this;
			this.Index && EQWave.Get( this.Index.Path, this.Index.IsSurf, callback );

			function callback( wave )
			{
				//make_info_table( self.fileinfo, wave.Monitor );
				//make_info_table( self.fileinfo, wave.ChannelMonitor );
				self.AudioPlayer.SetWave( wave );
				self.CanvasPane.SetWave( wave );
			}
		};

		function make_info_table( tbody, rows )
		{
			q.clr( tbody );
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
		}
	}
);
