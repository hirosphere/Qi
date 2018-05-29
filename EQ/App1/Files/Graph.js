
let EQGraph = new function()
{

	this.DrawWave = function( context, width, height, channel, maxacc, color )
	{
		let vcenter = height / 2;
		context.strokeStyle = "#fff";
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo( 0, vcenter );
		context.lineTo( width, vcenter );
		context.closePath();
		context.stroke();

		context.strokeStyle = color;
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo( 0, vcenter );

		let scale = vcenter / maxacc;
		for( var i = 0, len = channel.SampleCount; i < len; i ++ )
		{
			let x = i / len * width;
			let y = vcenter - channel.GetSample( i ) * scale;
			context.lineTo( x, y );
		}
		//context.closePath();
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

		let stylesets =
		{
			S1: { Back: "#000000", NS: "#ffffff", EW: "#80d870", UD: "#40d0d0" },
			M1: { Back: "#3030A0", NS: "#ffffff", EW: "#c0ffff", UD: "#c0d8FF" },
		};

		this.Draw = function( context, width, height )
		{
			// context.fillStyle = "#2828b0";
			let ss = stylesets.M1;
			context.fillStyle = ss.Back;

			context.fillRect( 0, 0, width - 0, height - 0 );

			if( this.Wave == null )  return;

			let maxacc = this.Wave.MaxAcc;
			this.Wave && EQGraph.DrawWave( context, width, height, this.Wave.UD, maxacc, ss.UD );
			this.Wave && EQGraph.DrawWave( context, width, height, this.Wave.EW, maxacc, ss.EW );
			this.Wave && EQGraph.DrawWave( context, width, height, this.Wave.NS, maxacc, ss.NS );
		};
	}
);
