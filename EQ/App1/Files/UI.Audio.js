
let AudioPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			let self = this;
			let player = args.Player;

			this.e = q.div( null, {} );

			new StateButton( this, { Width: 70, Height: -1, Value: player.Synth.Playing, Labels: { "false": "停止中", "true": "再生中" } } );
			new Slider( this, { Width: 220, Height: -1 } );

			//new Pane( this, { Width: 60, Height: -1, edef: { type: "button", text: "button" } } );
			//new Pane( this, { Width: 120, Height: -1, edef: { type: "input" } } );
			//new Pane( this, { Width: 120, Height: -1, edef: { type: "input" } } );


			this.Layout = new Layout.Horiz();
		};
	}
);
