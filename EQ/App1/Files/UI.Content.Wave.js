
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

			this.Info = new DivPane( this, { Width: -1, Height: 46, Rel: 0, Class: "WAVE_INFO" } );
			{
				const e = this.Info.e;
				this.Info_Site = q.a( e, { "class": "_SITE", attrs: { href: "void(0)", target: "_blank" } } );
				this.Info_Acc = q.span( e, { "class": "_ACC _C1" } );
				this.Info_Len = q.span( e, { "class": "_LEN _C2" } );
				this.Info_Date = q.span( e, { "class": "_DATE _C1" } );
				this.Info_Time = q.span( e, { "class": "_TIME _C2" } );
				this.Info_Elev = q.span( e, { "class": "_ELEV _C1" } );
				q.span( this.Info.e, { text:" データ元: " } );
				q.a
				(
					e,
					{ text:"K-NET KiK-net",
					attrs: { href: "http://www.kyoshin.bosai.go.jp/kyoshin/", target: "_blank", alt: "防災科学技術研究所 強震観測網" }
				} );
				this.Info_Test = q.div( e, { "class": "_TEST" } );
			}

			{
				const horiz = new HorizPane( this, { Width: -1, Height: 200, Rel: 10 } );
				this.CanvasPane = new EQGraph.CanvasPane( horiz, { Width: 300, Height: -1, Rel: 8 } );
				this.Map = new Pane
				(
					horiz,
					{
						Width: 300, Height: -1, Rel: 12,
						edef: { type: "iframe" }
					}
				);
			}

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
				//make_info_table( self.Info2.e, "wave.ChannelMonitor" );
				//q.text( self.path, wave && wave.GetInfo() );
				self.Wave = wave;
				self.UpdateInfo();
				self.AudioPlayer.Wave.Set( wave );
				self.CanvasPane.SetWave( wave );
			}
		};

		this.UpdateInfo = function()
		{
			let w = this.Wave;
			let ws = w && w.SiteInfo;
			let n = this.Index;
			let s = n && n.Site || {};
			const map_url = `https://maps.google.co.jp/maps?&output=embed&q=loc:${ s.Lat },${ s.Lng }&z=7`;
			
			const datestr = make_date_str( w.StartTimeStr );
			const elevdep = ws.Elev + "m" + ( ws.Depth != null && `, ${ws.Depth}m` || "" ); 
			let info = `( , ${ w.SampleTime }秒 `;
			this.Info_Site.href = map_url;
			
			q.text( this.Info_Site, `${ s.Code } ${ s.Name } ` );
			q.text( this.Info_Elev, elevdep );
			//q.text( this.Info_Date, w.StartTimeStr );
			q.text( this.Info_Date, datestr[ 0 ] );
			q.text( this.Info_Time, datestr[ 1 ] );
			q.text( this.Info_Acc, `${ q.frac( w.MaxAcc, 2 ) }gal` );
			q.text( this.Info_Len, `${ w.SampleTime }秒` );
			q.text( this.Info_Test, map_url );

			if( this.maptimeout ) clearTimeout( this.maptimeout );
			this.maptimeout = setTimeout( ()=> this.Map.e.contentWindow.location.replace( map_url ), 1000 );
		};

		function make_date_str( datestr )
		{
			const rt = [];

			const dt = datestr.split( " " );
			{
				const s = dt[ 0 ].split( "/" );
				rt[ 0 ] = `${s[0]}年${s[1]}月${s[2]}日`;
			}

			{
				const s = dt[ 1 ].split( ":" );
				rt[ 1 ] = `${s[0]}時${s[1]}分${s[2]}秒`;
			}

			return rt;
		}

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
