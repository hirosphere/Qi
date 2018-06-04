
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

			this.BuildHoriz1( this, { Width: -1, Height: 75 }, model );
			let vert = new VertPane( this, { Rel: 10, Height: -1 } );
			this.BuildHoriz2( vert, { Width: -1, Height: 75 }, model );

			this.Layout = new Layout.Vert( { Sep: 5 } );
		};

		this.BuildHoriz1 = function( com, args, model )
		{
			let horiz = new DivPane( com, args );
			horiz.e.style.zIndex = 1;
			
			new StateButton( horiz, { Width: 80, Height: -1, Value: model.Playing, Labels: { "false": "停止中", "true": "再生中" } } );

			let vert = new VertPane( horiz, { Rel: 10, Height: -1 } );
			new SliderInput( vert, { Width: 500, Height: 25, Text: "音量", Value: model.Volume } );
			new SliderInput( vert, { Width: 500, Height: 25, Text: "倍速", Value: model.Rate } );

			horiz.Layout = new Layout.Horiz( { Sep: 5 } );
		};

		this.BuildHoriz2 = function( com, args, model )
		{
			let horiz = new HorizPane( com, args );

			{
				let vert = new VertPane( horiz, { Width: 240, Rel: 0, Height: -1, Sep: 2 } );
				vert.e.style.zIndex = 1;
				
				new SliderInput( vert, { Width: -1, Height: 25, Text: "NS音量", Value: model.NS_Volume } );
				new SliderInput( vert, { Width: -1, Height: 25, Text: "EW音量", Value: model.EW_Volume } );
				new SliderInput( vert, { Width: -1, Height: 25, Text: "UD音量", Value: model.UD_Volume } );
			}

			{
				let vert = new VertPane( horiz, { Width: 240, Rel: 0, Height: -1, Sep: 2 } );
				vert.e.style.zIndex = 1;
				
				new SliderInput( vert, { Width: -1, Height: 25, Text: "NS定位", Value: model.NS_Pan } );
				new SliderInput( vert, { Width: -1, Height: 25, Text: "EW定位", Value: model.EW_Pan } );
				new SliderInput( vert, { Width: -1, Height: 25, Text: "UD定位", Value: model.UD_Pan } );
			}
		};

		this.BuildHoriz3 = function( com, args, model )
		{
			let cont = new VertPane( com, args );
			cont.e.style.zIndex = 1;
			
			new SliderInput( cont, { Width: 120, Height: -1, Text: "NS音量", Value: model.NS_Volume } );
			new SliderInput( cont, { Width: 120, Height: -1, Text: "EW音量", Value: model.EW_Volume } );
			new SliderInput( cont, { Width: 120, Height: -1, Text: "UD音量", Value: model.UD_Volume } );
		};
	}
);
