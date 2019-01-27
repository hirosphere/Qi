
let AudioPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			let self = this;
			let model = args.Player;

			this.e = q.div( null, {} );

			this.BuildHoriz1( this, { Width: -1, Height: 120 }, model );
			let vert = new VertPane( this, { Rel: 10, Height: -1 } );
			this.BuildHoriz2( vert, { Width: -1, Height: 75, Sep: 10 }, model );

			this.Layout = new Layout.Vert( { Sep: 5 } );
		};

		this.BuildHoriz1 = function( com, args, model )
		{
			let horiz = new HorizPane( com, args );

			new StateButton( horiz, { Width: 120, Height: -1, Value: model.Playing, Labels: { "false": "停止中", "true": "再生中" } } );

			{
				let vert = new VertPane( horiz, { Width: 600, Rel: 0, Height: -1, Sep: 3 } );

				SInp( vert, { Width: -1, Height: 25 }, "音量", model.Volume, [ 130, 60, 100], [ 0, 0, 8 ], [ 0, 1, 0.01 ] );
				SInp( vert, { Width: -1, Height: 25 }, "倍速", model.Rate, [ 130, 60, 200 ], [ 0, 0, 8 ], [ 1, 800, 1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "コンプレッサー", model.Compressor, [ 130, 60, 200 ], [ 0, 0, 8 ], [ 1, 8, 0.1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "オーバードライブ", model.Distortion, [ 130, 60, 200 ], [ 0, 0, 8 ], [ 0, 30, 1 ] );
			
				{
					let horizC = new HorizPane( vert, { Width: -1, Height: 25, Sep: 2 } );
	
					// new Label( horizC, { Width: 50, Height: -1, Text: "開始点" } )
					// new Input( horizC, { Width: 240, Height: -1, Value: model.Begin, } );
	
					// new Label( horizC, { Width: 50, Height: -1, Text: "長さ" } )
					// new Input( horizC, { Width: 50, Height: -1, Value: model.Length, } );
				}
			}
		};

		this.BuildHoriz2 = function( com, args, model )
		{
			let horiz = new HorizPane( com, args );

			{
				let vert = new VertPane( horiz, { Width: 350, Rel: 5, Height: -1, Sep: 2 } );
				
				SInp( vert, { Width: -1, Height: 25 }, "NS音量", model.NS_Volume, [ 70, 60, 80 ], [ 0, 0, 8 ], [ 0, 1, 0.1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "EW音量", model.EW_Volume, [ 70, 60, 80 ], [ 0, 0, 8 ], [ 0, 1, 0.1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "UD音量", model.UD_Volume, [ 70, 60, 80 ], [ 0, 0, 8 ], [ 0, 1, 0.1 ] );
			}

			{
				let vert = new VertPane( horiz, { Width: 350, Rel: 5, Height: -1, Sep: 2 } );
				vert.e.style.zIndex = 1;
				
				SInp( vert, { Width: -1, Height: 25 }, "NS定位", model.NS_Pan, [ 70, 60, 80 ], [ 0, 0, 8 ], [ -1, 1, 0.1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "EW定位", model.EW_Pan, [ 70, 60, 80 ], [ 0, 0, 8 ], [ -1, 1, 0.1 ] );
				SInp( vert, { Width: -1, Height: 25 }, "UD定位", model.UD_Pan, [ 70, 60, 80 ], [ 0, 0, 8 ], [ -1, 1, 0.1 ] );
			}
		};

		function SInp( com, args, label, value, wid, rel, msr )
		{
			let horiz = new HorizPane( com, args );
			new Label( horiz, { Width: wid[ 0 ], Rel: rel[ 0 ], Height: -1, Text: label } );
			new Input( horiz, { Width: wid[ 1 ], Rel: rel[ 1 ], Height: -1, Value: value } );
			new Slider( horiz, { Width: wid[ 2 ], Rel: rel[ 2 ], Height: -1, Value: value, Min: msr[ 0 ], Max: msr[ 1 ], Step: msr[ 2 ] } );
		};
	}
);
