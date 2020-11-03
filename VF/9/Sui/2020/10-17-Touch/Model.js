const Model = {};

Model.Main = class
{
	Volume = new Model.Number( { Init: 70 } );
	Tune = new Model.Number( { Init: 442 } );
	Channels =
	{
		Melody: new Model.Channel( this )
	}

	Resources =
	{
		Waves: { Sq1: new Model.Tone( [ "Squ 1 1.0 1.0" ] ) },
		Envs: {}
	}
}

Model.Channel = class
{
	Volume = 50;
	Tone = new Model.Tone();
	AEnv = new Model.EG();
}

Model.EG = class
{
	Attack = new Model.Number( { Init: 50 } );
	Decay = new Model.Number( { Init: 50 } );
	Sustain = new Model.Number( { Init: 50 } );
	Release = new Model.Number( { Init: 50 } );
}

Model.Tone = class
{
	constructor( parameter )
	{
		this.Parameter = parameter;
		this.periodicawave = null;
		this.real = new Float32Array( 256 );
		this.imag = new Float32Array( 256 );
		this.Waves = [ new Model.Wave( this ), new Model.Wave( this ), new Model.Wave( this ), new Model.Wave( this ), new Model.Wave( this ) ];
		
		this.SetParameter( [ "Saw 1 30 100", "Saw 2 30 30", "Saw 3 30 0", "Saw 4 30 0", "Saw 8 30 0" ] );
		this.update();

		setInterval( () => { if( this.modified ) { this.update(); this.modified = false; } }, 1000 );
	}

	ToOsc( osc )
	{
		if( this.periodicawave == null )
		{
			this.periodicawave = osc.context.createPeriodicWave( this.real, this.imag );
		}
		osc.setPeriodicWave( this.periodicawave );
	}

	SetParameter( p )
	{
		p = p || [];
		for( const i in this.Waves ) this.Waves[ i ].SetParameter( p[ i ] );
	}

	update()
	{
		for( const i in this.real ) this.real[ i ] = this.imag[ i ] = 0;
		for( const wave of this.Waves )  wave.Calc( this.real, this.imag );
		this.periodicawave = null;
	}
}

Model.Wave = class
{
	type = "Sin";
	order = 1;
	att = 1.0;

	constructor( tone )
	{
		this.Level = new Model.Number( { Init: 1.0, OnChanged: () => tone.modified = true } );
		this.Att = new Model.Number( { Init: 10, OnChanged: () => tone.modified = true } );
	}

	SetParameter( p )
	{
		const a = ( p || "" ).split( " " );
		this.type = a[ 0 ] || "Sin";
		this.mul = a[ 1 ] || 1;
		this.Att.SetValue( a[ 2 ] || 10 );
		this.Level.SetValue( a[ 3 ] || 0 );
	}

	Calc( real, imag )
	{
		const mul = Math.round( this.mul );
		const level = this.Level.Value / 100;
		const att = this.Att.Value / 10;

		switch( this.type )
		{
			case "Saw": for( let i = 1; ( i * mul ) < real.length; i ++ )  real[ mul * i ] += level / Math.pow( i, att ); break;
			case "Squ": for( let i = 1; ( i * mul ) < real.length; i ++ )  if( i % 2 ) real[ mul * i ] += level / Math.pow( i, att ); break;
			default: real[ mul] += level; break;
		}
	}
}


// プリミティブ型 //

Model.Base = class
{
	onchangedlist = {};
	next_lid = 1;

	constructor( args )
	{
		args && args.OnChanged && this.AddOnChanged( args.OnChanged );
	}

	AddOnChanged( operation )
	{
		const lid = this.next_lid ++;
		this.onchangedlist[ lid ] = operation;
	}

	NotifyChanged( arg )
	{
		for( const lid in this.onchangedlist )  this.onchangedlist[ lid ]( arg );
	}
}

Model.Number = class extends Model.Base
{
	constructor( args )
	{
		super( args );
		this.Value = args && args.Init;
	}

	SetValue( value )
	{
		if( value === this.Value )  return;
		this.Value = value;
		this.NotifyChanged( value );
	}
}