let EQAudio = new function()
{
	this.CreatePlayer = function()
	{
		let model = new Player(  );
		let context = new AudioContext();
		let view = new View( model, context, context.destination );
		return model;
	};

	let PlayerCore = function()
	{
		this.Wave = new Model.Value( null );
		
		this.Playing = new BoolValue( true );

		this.Volume = new NumberValue( 1 );
		this.Rate = new NumberValue( 30 );

		this.Compressor = new NumberValue( 1 );
		this.Distortion = new NumberValue( 0 );
		
		this.Begin = new Model.Value( "2014/04/14/ 12:28:0000" );
		this.Length = new Model.Value( 300 );

		this.NS_Volume = new NumberValue( 0.7 );
		this.NS_Pan = new NumberValue( -0.7 );

		this.EW_Volume = new NumberValue( 0.7 );
		this.EW_Pan = new NumberValue( 0.7 );

		this.UD_Volume = new NumberValue( 0.7 );
		this.UD_Pan = new NumberValue( 0 );
	};

	let Player = function()
	{
		PlayerCore.call( this );

		let hashOrder =
		[
			this.Rate, this.Playing,
			this.Volume, this.Compressor,
			this.NS_Volume, this.NS_Pan,
			this.EW_Volume, this.EW_Pan,
			this.UD_Volume, this.UD_Pan,
			this.Distortion
		];

		this.SetHash = function( hash )
		{
			let values = hash.split( "," );
			for( var i = 0; i < values.length && i < hashOrder.length; i ++ )
			{
				hashOrder[ i ].SetHash( values[ i ] );
			}
		};

		this.GetHash = function()
		{
			let values = [];
			for( var value of hashOrder )
			{
				values.push( value.GetHash() );
			}
			return values.join( "," );
		};
	}

	// Value //

	let BoolValue = class_def
	(
		Model.Value,
		function()
		{
			this.GetHash = function() { return this.Value ? "1" : "0"; };
			this.SetHash = function( value ) { this.Set( isne( value ) ? this.DefaultValue : value == 1 ); };
		}
	);

	let NumberValue = class_def
	(
		Model.Value,
		function()
		{
			this.GetHash = function() { return this.Value; };
			this.SetHash = function( value ) { this.Set( isne( value ) ? this.DefaultValue : value ); };
		}
	);

	function isne( value ){ return value == undefined || value == ""; }

	// View //

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

				this.Comp = context.createDynamicsCompressor();
				{
					this.Comp.ratio.value = 1.0;
					this.Comp.knee = 0;
					this.Comp.threshold.value = -80;
				}
				
				this.Dist = context.createScriptProcessor( 0, 2, 2 );
				{
					this.Dist.onaudioprocess = ( ev )=>
					{
						const inp0 = ev.inputBuffer.getChannelData( 0 );
						const out0 = ev.outputBuffer.getChannelData( 0 );
						const inp1 = ev.inputBuffer.getChannelData( 1 );
						const out1 = ev.outputBuffer.getChannelData( 1 );
						
						const gain = Math.pow( 10, this.model.Distortion.Get() / 10 );

						for( let i = 0; i < inp0.length; i ++ )
						{
							out0[ i ] = Math.max( -1, Math.min( 1, inp0[ i ] * gain ) );
							out1[ i ] = Math.max( -1, Math.min( 1, inp1[ i ] * gain ) );
						}
					}
				}

				this.Volume = context.createGain();

				//  connects  //
				
				{
					//const d = this.Volume;
					const d = this.Comp;
				
					this.Splitter.connect( this.NS_Att, 0 );
					this.NS_Att.connect( this.NS_Volume );
					this.NS_Volume.connect( this.NS_Pan );
					this.NS_Pan.connect( d );
					
					this.Splitter.connect( this.EW_Att, 1 );
					this.EW_Att.connect( this.EW_Volume );
					this.EW_Volume.connect( this.EW_Pan );
					this.EW_Pan.connect( d );
					
					this.Splitter.connect( this.UD_Att, 2 );
					this.UD_Att.connect( this.UD_Volume );
					this.UD_Volume.connect( this.UD_Pan );
					this.UD_Pan.connect( d );

					this.Comp.connect( this.Dist );
					this.Dist.connect( this.Volume );
					
					this.Volume.connect( dest );
				}

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

				this.model.Compressor.AddView( paramView );
				this.model.Distortion.AddView( paramView );

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

				this.Comp.ratio.setTargetAtTime( this.model.Compressor.Get(), current, 0.01 );
				
				let volume = this.model.Volume.Get() * Math.sqrt( this.model.Compressor.Get() );
				this.Volume.gain.setTargetAtTime( this.playing ? volume : 0, current, 0.01 );

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
