var InstSet = new function()
{
	let context = new AudioContext();
	let delaytime = 0.02;

	function curr( time ) { return context.currentTime + delaytime + ( time || 0 ); }

	this.WaveVoice = class_def
	(
		null,
		function()
		{
			this.Initiate = function( dest )
			{
				this.Mode = 0;
				this.Dest = dest || context.destination;

				// let buffer = this.makewave1( 100, context );
				let buffer = this.makewave2( context );

				let osc = this.osc = context.createBufferSource();
				let cosc = this.cosc = context.createOscillator();
				let camp = this.camp = context.createGain();
				let amp = this.amp = context.createGain();

				osc.buffer = buffer;
				osc.loop = true;
				osc.loopStart = 0;
				osc.loopEnd = 1;
				osc.detune.value = -1200;

				cosc.frequency.value = 440 * 4;
				camp.gain.value = 0;
				amp.gain.value = 0;
				
				cosc.connect( camp );
				amp.connect( this.Dest );
				this.UpdateMode();

				cosc.start();
				osc.start();
			};

			this.UpdateMode = function()
			{
				this.osc.disconnect();
				this.camp.disconnect();

				switch( this.Mode )
				{
					case 1:
						this.camp.connect( this.amp );
						this.osc.connect( this.camp.gain );
						break;

					default:
						this.osc.connect( this.amp );
						break;
				}
			};

let file = "../SampleWaves/20180409063800.in/SMN0031804090638/SMN0031804090638.NS";
//let file = "../SampleWaves/20180409063800.in/SMN0051804090638/SMN0051804090638.UD";

			this.makewave2 = function( context )
			{
				let wu = new EQWave.WaveUnit();
				wu.LoadDataText( file );
				if( ! wu.Completed )  return this.makewave1( 100, context );

				let samplecount = wu.Wave.length;
				this.freqrate = wu.SampleRate / context.sampleRate * 2;
				let buffer = context.createBuffer( 1, samplecount, context.sampleRate );
				buffer.getChannelData( 0 ).set( wu.Wave );
				return buffer;
			};

			this.makewave1 = function( samplecount, context )
			{
				this.freqrate = samplecount / context.sampleRate * 2;
				let wt1 = new Float32Array( samplecount );
				
				for( var i = 0; i < samplecount; i ++ )
				{
					let phase = i / samplecount;
					wt1[i] = ( phase < 0.1 ? 1 : -1 );		// パルス波生成。
				}
				
				let buffer = context.createBuffer( 1, samplecount, context.sampleRate );
				buffer.getChannelData( 0 ).set( wt1 );
				return buffer;
			};

			this.SetMode = function( value )
			{
				this.Mode = value;
				this.UpdateMode();
			}

			this.SetHold = function( value )
			{
				this.Hold = value;
				this.NoteOff();
			};

			this.SetCarr = function( value )
			{
				this.cosc.frequency.setTargetAtTime( value, curr(), 0.001 );
			}

			this.NoteOn = function( freq )
			{
				this.osc.playbackRate.setValueAtTime( freq * this.freqrate, curr() );
				this.amp.gain.setTargetAtTime( 0.1, curr(), 0.01 );
			};

			this.NoteOff = function()
			{
				if( ! this.Hold )  this.amp.gain.setTargetAtTime( 0, curr(), 0.1 );
			};
		}
	);

	this.OscVoice = class_def
	(
		null,
		function( dest )
		{
			this.Initiate = function()
			{
				let osc = this.osc = context.createOscillator();
				let amp = this.amp = context.createGain();
				
				amp.gain.value = 0;
				osc.type = "square";
				
				osc.connect( amp );
				amp.connect( context.destination );

				osc.start();
			};

			this.NoteOn = function( freq )
			{
				this.osc.frequency.setValueAtTime( freq, curr() );
				this.amp.gain.setValueAtTime( 0.1, curr() );
			};

			this.NoteOff = function()
			{
				this.amp.gain.setValueAtTime( 0, curr() );
			};
		}
	);
};
