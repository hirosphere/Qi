
let AudioPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			let self = this;
			let player = args.Player;
			let synth = player.Synth;

			this.e = q.div( null, {} );

			new StateButton( this, { Width: 80, Height: -1, Value: synth.Playing, Labels: { "false": "停止中", "true": "再生中" } } );
			
			new Label( this, { Width: 60, Height: -1, Text: "音量" } );
			new Input( this, { Width: 80, Height: -1, Value: synth.Volume } );

			new Label( this, { Width: 60, Height: -1, Text: "倍速" } );
			new Input( this, { Width: 80, Height: -1, Value: synth.Rate } );
			new Slider( this, { Width: 220, Height: -1 } );

			//new Pane( this, { Width: 60, Height: -1, edef: { type: "button", text: "button" } } );
			//new Pane( this, { Width: 120, Height: -1, edef: { type: "input" } } );
			//new Pane( this, { Width: 120, Height: -1, edef: { type: "input" } } );


			this.Layout = new Layout.Horiz();
		};
	}
);
