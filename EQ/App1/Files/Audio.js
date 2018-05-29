
let EQAudio = new function()
{
	this.Player = class_def
	(
		null,
		function()
		{
			this.Initiate = function()
			{
				this.Synth = new Synth( new AudioContext() );
			};

			this.SetWave = function( wave )
			{
				this.Synth.SetWave( wave );
			};
		}
	);

	let Synth = class_def
	(
		null,
		function()
		{
			this.Initiate = function( context )
			{
				this.Context = context;
				this.amp = context.createGain();
				this.amp.connect( context.destination );
			};

			this.SetWave = function( wave )
			{
				let rate = 40;

				this.cosc && this.cosc.disconnect();
				this.bosc && this.bosc.disconnect();

				this.cosc = this.Context.createOscillator();
				this.bosc = this.Context.createBufferSource();

				this.cosc.frequency.value = 880;
				this.bosc.playbackRate.value = rate * wave.SamplingRate / this.Context.sampleRate;
				this.bosc.buffer = this.CreateWaveBuffer( wave );
				this.bosc.loop = true;

				// this.cosc.connect( this.amp );
				this.bosc.connect( this.amp );

				this.cosc.start();
				this.bosc.start();

				this.amp.gain.value = 1.2 / wave.MaxAcc;
				//this.amp.gain.setTargetAtTime( 0, this.Context.currentTime, 0.1 );
			};

			this.CreateWaveBuffer = function( wave )
			{
				let buffer = this.Context.createBuffer( 3, wave.NS.Samples.length, this.Context.sampleRate );
				buffer.getChannelData( 0 ).set( wave.NS.Samples );
				buffer.getChannelData( 1 ).set( wave.UD.Samples );
				buffer.getChannelData( 2 ).set( wave.EW.Samples );
				return buffer;
			};
		}
	);
};
