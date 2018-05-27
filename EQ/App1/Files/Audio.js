
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
				this.cosc && this.cosc.disconnect( this.amp );
				this.cosc = this.Context.createOscillator();
				this.cosc.frequency.value = 880;
				this.cosc.connect( this.amp );
				this.cosc.start();
				this.amp.gain.value = 0.2;
				this.amp.gain.setTargetAtTime( 0, this.Context.currentTime, 0.1 );			}
		}
	);
};
