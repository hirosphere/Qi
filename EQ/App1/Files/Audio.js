
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
				let rate = 12;

				this.cosc && this.cosc.disconnect();
				this.bosc && this.bosc.disconnect();

				this.cosc = this.Context.createOscillator();
				this.bosc = this.Context.createBufferSource();

				this.cosc.frequency.value = 880;
				this.bosc.playbackRate.value = rate / wave.SamplingRate;
				this.bosc.buffer = this.CreateWaveBuffer( wave.NS );
				this.bosc.loop = true;

				// this.cosc.connect( this.amp );
				this.bosc.connect( this.amp );

				this.cosc.start();
				this.bosc.start();

				this.amp.gain.value = 0.2 / wave.MaxAcc;
				//this.amp.gain.setTargetAtTime( 0, this.Context.currentTime, 0.1 );
			};

			this.CreateWaveBuffer = function( channel )
			{
				let buffer = this.Context.createBuffer( 1, channel.Samples.length, this.Context.sampleRate );
				buffer.getChannelData( 0 ).set( channel.Samples );
				return buffer;
			};
		}
	);
};
