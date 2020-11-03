
const SG = {};

SG.Main = class
{
	constructor( model )
	{
		this.Model = model;

		const c = this.context = new AudioContext();
		const g = this.voice_dest = c.createGain( { gain: 0 } );
		g.connect( c.destination );

		this.Channels = {};
		this.Channels.Melody = new SG.Channel( c, g, this.Model.Channels.Melody );
		this.Update();

		model.Volume.AddOnChanged( () => this.Update() );
	}

	Update()
	{
		this.voice_dest.gain.value = SG.a_curve( this.Model.Volume.Value / 100, 0.1 );
	}
}

SG.a_curve = ( v, p ) => Math.pow( 64, v - 1 ) * ( v > p ? 1 : v * ( 1 / p ) );

SG.Channel = class
{
	voices = {};

	constructor( context, dest, model )
	{
		this.context = context;
		this.voice_dest = dest;
		this.model = model;
	}

	PostKeyEvent( ev )
	{
		if( ev.type == "Key-On" )
		{
			this.voices[ ev.note_id ] = new SG.Voice( this.context, this.voice_dest, ev.key, this.model );
		}
		else if( ev.type == "Key-Off" )
		{
			const voice = this.voices[ ev.note_id ];
			if( voice == null ) return;

			voice.release();
			delete this.voices[ ev.note_id ];
		}
	}
}

SG.Voice = class
{
	constructor( context, dest, key, model )
	{
		this.model = model;
		this.context = context;

		const o = this.osc = context.createOscillator();
		const g = this.gain = new GainNode( context, { gain: 0 } );
		
		o.connect( g );
		g.connect( dest );
		
		o.detune.value = ( key - 69 ) * 100;
		model.Tone.ToOsc( o );

		const t = context.currentTime + 0.001;
		o.start( t );
		{
			const at = this.envt( this.model.AEnv.Attack );
			const dt = this.envt( this.model.AEnv.Decay );
			const sl = this.model.AEnv.Sustain.Value / 100;

			g.gain.setTargetAtTime( 1, t, at );
			g.gain.setTargetAtTime( sl, t + at, dt );
		}
	}

	envt( m ){ return Math.pow( 10, m.Value / 20 ) / 1000; }

	release()
	{
		const t = this.context.currentTime + 0.001;
		const rt = this.envt( this.model.AEnv.Release );
		this.gain.gain.cancelAndHoldAtTime( t );
		this.gain.gain.setTargetAtTime( 0, t, rt );
		this.osc.stop( t + rt * 4 );
		this.osc = undefined;
	}
}
