
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
			this.fileinfo = q.div( this.e, { "class": "WAVE_FILE_INFO" } );
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
				q.text( self.fileinfo, wave.Monitor );
			}
		}
	}
);
