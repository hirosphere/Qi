
let EQAudio = new function()
{
	this.Player = class_def
	(
		null,
		function()
		{
			this.Initiate = function()
			{
				this.Playing = new Model.Value( false );

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
				self = this;
				this.Playing = new Model.Value( true );
				this.Context = context;

				this.amp = context.createGain();
				this.amp.connect( context.destination );

				this.Playing.AddView( { Change: function() { self.Update(); } } );
			};

			this.SetWave = function( wave )
			{
				this.Wave = wave;

				let buffer = this.WaveBuffer = this.Context.createBuffer( 3, wave.NS.Samples.length, this.Context.sampleRate );
				buffer.getChannelData( 0 ).set( wave.NS.Samples );
				buffer.getChannelData( 1 ).set( wave.UD.Samples );
				buffer.getChannelData( 2 ).set( wave.EW.Samples );

				this.Update();
			};

			this.Update = function()
			{
				this.Playing.GetValue() ? this.Start() : this.Stop();
			};

			this.Stop = function()
			{
				this.amp.gain.setTargetAtTime( 0, this.Context.currentTime, 0.01 );
			};

			this.Start = function()
			{
				let wave = this.Wave;
				let rate = 40;

				this.cosc && this.cosc.disconnect();
				this.bosc && this.bosc.disconnect();

				this.cosc = this.Context.createOscillator();
				this.cosc.frequency.value = 880;

				this.bosc = this.Context.createBufferSource();
				this.bosc.playbackRate.value = rate * wave.SamplingRate / this.Context.sampleRate;
				this.bosc.loop = true;
				this.bosc.buffer = this.WaveBuffer;
				
				// this.cosc.connect( this.amp );
				this.bosc.connect( this.amp );

				this.cosc.start();
				this.bosc.start();

				this.amp.gain.value = 1.2 / this.Wave.MaxAcc;
				//this.amp.gain.setTargetAtTime( 1.2 / this.Wave.MaxAcc, this.Context.currentTime, 0.1 );
			};
		}
	);
};
