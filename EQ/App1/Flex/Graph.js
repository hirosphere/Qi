
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

EQGraph.Pane = class_def
(
	null,
	function( base )
	{
		this.Initiate = function( com, className, width, height )
		{
			this.e = q.e( "canvas", com, { "class": className } );
			this.e.width = width;
			this.e.height = height;
			this.e.style.width = width + "px";
			this.e.style.height = height; + "px"
		};

		this.Test = function()
		{
			let context = this.e.getContext( "2d" );
			let width = this.e.width;
			let height = this.e.height;

			context.save();

			let ss = stylesets.M2;
			context.fillStyle = ss.Back;

			context.fillRect( 0, 0, width - 0, height - 0 );

			context.restore();
		}

		this.SetWave = function( wave )
		{
			this.Wave = wave;
			this.Update();
		};

		let stylesets =
		{
			S1: { Back: "#000000", NS: "#ffffff", EW: "#80d870", UD: "#40d0d0" },
			M1: { Back: "#3030A0", NS: "#ffffff", EW: "#c0ffff", UD: "#c0d8FF" },
			M2: { Back: "#4040C0", NS: "#ffffff", EW: "#ffffff", UD: "#ffffFF" },
		};

		this.Update = function()
		{
			let context = this.e.getContext( "2d" );
			let width = this.e.width;
			let height = this.e.height;

			context.save();

			let ss = stylesets.S1;
			context.fillStyle = ss.Back;

			context.fillRect( 0, 0, width - 0, height - 0 );

			if( this.Wave == null )  return;

			let maxacc = this.Wave.MaxAcc;
			let h = height / 3;
			this.Wave && EQGraph.DrawWave( context, width, h, this.Wave.NS, maxacc, ss.NS );
			context.translate( 0, h * 1 );
			this.Wave && EQGraph.DrawWave( context, width, h, this.Wave.EW, maxacc, ss.EW );
			context.translate( 0, h * 1 );
			this.Wave && EQGraph.DrawWave( context, width, h, this.Wave.UD, maxacc, ss.UD );

			context.restore();
		};
	}
);
