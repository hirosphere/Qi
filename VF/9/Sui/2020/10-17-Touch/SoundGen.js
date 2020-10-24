
class SoundGen
{
	volume = 10;
	voices = {};

	constructor()
	{
		const c = this.context = new AudioContext();
		const g = this.voice_dest = c.createGain( { gain: 0 } );
		g.connect( c.destination );
		this.Update();
	}

	Update()
	{
		this.voice_dest.gain.value = this.volume / 100;
	}

	PostKeyEvent( ev )
	{
		if( ev.type == "Key-On" )
		{
			this.voices[ ev.note_id ] = new Voice( this.context, this.voice_dest, ev.key );
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

class Voice
{
	constructor( context, dest, key )
	{
		this.context = context;

		const o = this.osc = context.createOscillator();
		const g = this.gain = new GainNode( context, { gain: 0 } );
		
		o.connect( g );
		g.connect( dest );
		
		o.detune.value = ( key - 69 ) * 100;

		const t = context.currentTime + 0.001;
		o.start( t );
		g.gain.setTargetAtTime( 1 / 0.63, t, 0.1 );
	}

	release()
	{
		const t = this.context.currentTime + 0.001;
		const t_r = t + 5.5;
		this.gain.gain.cancelAndHoldAtTime( t );
		this.gain.gain.setTargetAtTime( 0, t, 0.5 );
		this.osc.stop( t_r );
		this.osc = undefined;
	}
}