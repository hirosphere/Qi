let EQAudio = new function()
{
	this.CreatePlayer = function()
	{
		let model = new Player(  );
		let context = new AudioContext();
		let view = new View( model, context, context.destination );
		return model;
	};

	let Player = function()
	{
		this.Wave = new Model.Value( null );
		
		this.Playing = new Model.Value( true );
		this.Volume = new Model.Value( 1 );
		this.Rate = new Model.Value( 30 );
		
		this.NS_Volume = new Model.Value( 1 );
		this.NS_Pan = new Model.Value( 0 );

		this.EW_Volume = new Model.Value( 1 );
		this.EW_Pan = new Model.Value( 0 );

		this.UD_Volume = new Model.Value( 1 );
		this.UD_Pan = new Model.Value( 0 );
	};

	let View = class_def
	(
		null,
		function()
		{
			this.Initiate = function( model, context, dest )
			{
				this.model = model;
				this.Context = context;

				this.playing = false;
				
				
				//  creates  //
				
				this.Splitter = context.createChannelSplitter( 3 );

				this.NS_Att = context.createGain();
				this.NS_Volume = context.createGain();
				this.NS_Pan = context.createStereoPanner();

				this.EW_Att = context.createGain();
				this.EW_Volume = context.createGain();
				this.EW_Pan = context.createStereoPanner();

				this.UD_Att = context.createGain();
				this.UD_Volume = context.createGain();
				this.UD_Pan = context.createStereoPanner();

				this.Volume = context.createGain();

				//  connects  //
				
				this.Splitter.connect( this.NS_Att, 0 );
				this.NS_Att.connect( this.NS_Volume );
				this.NS_Volume.connect( this.NS_Pan );
				this.NS_Pan.connect( this.Volume );
				
				this.Splitter.connect( this.EW_Att, 1 );
				this.EW_Att.connect( this.EW_Volume );
				this.EW_Volume.connect( this.EW_Pan );
				this.EW_Pan.connect( this.Volume );
				
				this.Splitter.connect( this.UD_Att, 2 );
				this.UD_Att.connect( this.UD_Volume );
				this.UD_Volume.connect( this.UD_Pan );
				this.UD_Pan.connect( this.Volume );
				
				this.Volume.connect( dest );

				//   //
				
				this.ConnectModel();
				this.UpdateParams();
				this.UpdatePlaying();
			};

			this.ConnectModel = function()
			{
				let self = this;

				this.model.Playing.AddView( { Change: function() { self.UpdatePlaying(); } } );
				this.model.Wave.AddView( { Change: function() { self.UpdateWave(); } } );

				let paramView = { Change: function() { self.UpdateParams(); } };

				this.model.Volume.AddView( paramView );
				this.model.Rate.AddView( paramView );

				this.model.NS_Volume.AddView( paramView );
				this.model.NS_Pan.AddView( paramView );

				this.model.EW_Volume.AddView( paramView );
				this.model.EW_Pan.AddView( paramView );

				this.model.UD_Volume.AddView( paramView );
				this.model.UD_Pan.AddView( paramView );
			};

			this.UpdatePlaying = function()
			{
				let playing = this.model.Playing.Get();
				if( this.playing == playing )  return;
				this.playing = playing;
				playing ? this.VoiceStart() : this.VoiceStop();
			};

			this.UpdateWave = function()
			{
				this.Wave = this.model.Wave.Get();
				this.playing = false;
				this.UpdatePlaying();
			};

			this.UpdateParams = function()
			{
				let current = this.Context.currentTime;

				this.NS_Volume.gain.setTargetAtTime( this.model.NS_Volume.Get(), current, 0.01 );
				this.NS_Pan.pan.setTargetAtTime( this.model.NS_Pan.Get(), current, 0.01 );

				this.EW_Volume.gain.setTargetAtTime( this.model.EW_Volume.Get(), current, 0.01 );
				this.EW_Pan.pan.setTargetAtTime( this.model.EW_Pan.Get(), current, 0.01 );

				this.UD_Volume.gain.setTargetAtTime( this.model.UD_Volume.Get(), current, 0.01 );
				this.UD_Pan.pan.setTargetAtTime( this.model.UD_Pan.Get(), current, 0.01 );

				let volume = this.playing ? this.model.Volume.Get() : 0;
				this.Volume.gain.setTargetAtTime( volume, current, 0.01 );

				if( this.Wave && this.bosc )
				{
					this.bosc.playbackRate.value =
						this.model.Rate.GetValue() *
						this.Wave.SamplingRate /
						this.Context.sampleRate || 1;
				}
			};

			this.VoiceStop = function()
			{
				this.UpdateParams();
			};

			this.VoiceStart = function()
			{
				oscstop( this.cosc );
				oscstop( this.bosc );

				if( this.Wave == null )  return;

				this.cosc = this.Context.createOscillator();
				this.cosc.frequency.value = 880;

				this.bosc = this.Context.createBufferSource();
				this.bosc.loop = true;

				let buffer = this.Context.createBuffer( 3, this.Wave.NS.Samples.length, this.Context.sampleRate );
				buffer.getChannelData( 0 ).set( this.Wave.NS.Samples );
				buffer.getChannelData( 1 ).set( this.Wave.EW.Samples );
				buffer.getChannelData( 2 ).set( this.Wave.UD.Samples );
				this.bosc.buffer = buffer;
				
				this.bosc.connect( this.Splitter );
				this.NS_Att.gain.value =
				this.EW_Att.gain.value =
				this.UD_Att.gain.value = 1.0 / this.Wave.MaxAcc;

				this.UpdateParams();

				this.cosc.start();
				this.bosc.start();

				//this.Att.gain.setTargetAtTime( 1.2 / this.Wave.MaxAcc, this.Context.currentTime, 0.1 );
			};

			function oscstop( osc )
			{
				if( ! osc )  return null;
				osc.stop();
				osc.disconnect();
				return null;
			}
		}
	);
};
