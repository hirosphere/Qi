
let EQGraph = new function()
{

	this.DrawWave = function( context, width, height, samples )
	{
		let vcenter = height / 2;
		context.strokeStyle = "#fff";
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo( 0, vcenter );
		context.lineTo( width, vcenter );
		context.closePath();
		context.stroke();

		context.strokeStyle = "#fff";
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo( 0, vcenter );

		for( var i = 0; i < samples.length; i ++ )
		{
			let x = i / samples.length * width;
			let y = vcenter - samples[ i ] * 1;
			context.lineTo( x, y );
		}
		context.closePath();
		context.stroke();
	};
};


let CanvasFrame = class_def
(
	Pane,
	function( base )
	{
		this.UpdateLayout = function()
		{
			base.UpdateLayout.call( this );
			let context = this.e.getContext( "2d" );
			this.Draw( context, this.ConcreteArea.Width, this.ConcreteArea.Height );
		};

		this.Draw = function( context, width, height )
		{
			;
		};
	}
);

let CanvasPane = class_def
(
	CanvasFrame,
	function( base )
	{
		this.Build = function( args )
		{
			this.e = q.e( "canvas", null );
		};

		this.SetArea = function( left, top, width, height )
		{
			this.e.width = width;
			this.e.height = height;

			base.SetArea.call( this, left, top, width, height );
		};
	}
);

EQGraph.CanvasPane = class_def
(
	CanvasPane,
	function( base )
	{
		this.SetWave = function( wave )
		{
			this.Wave = wave;
			this.UpdateLayout();
		};

		this.Draw = function( context, width, height )
		{
			context.fillStyle = "#3030d0";
			context.fillRect( 10, 10, width - 20, height - 20 );
			context.font = "48px serif";
			//this.Wave && context.strokeText( this.Wave.Channels.length, 30, 60 );
			this.Wave && EQGraph.DrawWave( context, width, height, this.Wave.Channels[ 0 ].Samples );
		};
	}
);
