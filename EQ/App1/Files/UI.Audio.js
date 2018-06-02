
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

			this.BuildHoriz1( this, { Width: -1, Height: 80 }, model );
			this.BuildHoriz2( this, { Width: -1, Height: 80 }, model );
			this.BuildHoriz3( this, { Width: -1, Height: 80 }, model );

			this.Layout = new Layout.Vert( { Sep: 2 } );
		};

		this.BuildHoriz1 = function( com, args, model )
		{
			let horiz = new DivPane( com, args );
			horiz.e.style.zIndex = 1;
			
			new StateButton( horiz, { Width: 80, Height: -1, Value: model.Playing, Labels: { "false": "停止中", "true": "再生中" } } );

			new SliderInput( horiz, { Width: 120, Height: -1, Text: "音量", Value: model.Volume } );
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "倍速", Value: model.Rate } );

			horiz.Layout = new Layout.Horiz( { Sep: 2 } );
		};

		this.BuildHoriz2 = function( com, args, model )
		{
			let horiz = new DivPane( com, args );
			horiz.e.style.zIndex = 1;
			
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "NSパン", Value: model.NS_Pan } );
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "EWパン", Value: model.EW_Pan } );
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "UDパン", Value: model.UD_Pan } );

			horiz.Layout = new Layout.Horiz( { Sep: 2 } );
		};

		this.BuildHoriz3 = function( com, args, model )
		{
			let horiz = new DivPane( com, args );
			horiz.e.style.zIndex = 1;
			
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "NS音量", Value: model.NS_Volume } );
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "EW音量", Value: model.EW_Volume } );
			new SliderInput( horiz, { Width: 120, Height: -1, Text: "UD音量", Value: model.UD_Volume } );

			horiz.Layout = new Layout.Horiz( { Sep: 2 } );
		};
	}
);
