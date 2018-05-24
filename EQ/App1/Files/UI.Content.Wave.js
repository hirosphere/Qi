
Content.Wave = class_def
(
	Content.Base,
	function()
	{
		this.Build = function()
		{
			this.e = q.div( null, { "class": "CONTENT_WAVE" } );
			this.title = q.h2( this.e, { "class": "CONTENT_WAVE_TITLE" } );
			this.path = q.div( this.e );

			let table = q.table( this.e, { "class": "WAVE_FILE_INFO" } );
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
			this.Index && EQWave.Get( this.Index.Path, callback );

			function callback( wave )
			{
				//q.text( self.qr, wave.Monitor );
				make_info_table( self.fileinfo, wave );
			}
		};

		function make_info_table( tbody, wave )
		{
			q.clr( tbody );
			for( var row of wave.Monitor )
			{
				let tr = q.tr( tbody );
				q.td( tr, { text: row[ 0 ], "class": "hdr" } );
				q.td( tr, { text: row[ 1 ] } );
				q.td( tr, { text: row[ 2 ] } );
				q.td( tr, { text: row[ 3 ] } );
			}
		};
	}
);
