
const VF = new function()
{
	{
		const len = 128
		const zero = len / 2;
		const curve = new Float32Array( len );
		for( let i = 0; i < len; i ++ )
		{
			curve[ i ] = ( i > zero ? 1 : - 1 );
		}
		this.PW_Shape_Curve_2 = curve;
	}
};

VF.SoundGen = function( doc )
{
	this.Volume = 30;
	this.IsPlay = false;

	const context = new AudioContext();
	const master_volume = context.createGain();
	master_volume.connect( context.destination );

	const train = new VF.Train( doc, context );
	const pwm = new VF.PWM( context, train.Power, train.Freq, master_volume, - 0.485, 0.495, VF.PW_Shape_Curve_2 );


	//

	this.Start = function()
	{
		this.IsPlay = true;
		train.Start();
		this.Update();
	};

	this.Stop = function()
	{
		this.IsPlay = false;
		this.Update();
	};
	
	this.Update = function()
	{
		master_volume.gain.value = this.IsPlay ? this.Volume / 100 : 0;
	};

	this.Play = function( doc, vf )
	{
		;
	};

	this.Update();
};

VF.Train = function( doc, context )
{
	let carrier_def = null;
	
	const power = this.Power = context.createConstantSource();
	power.offset.value = 0;
	power.start();

	const freq = this.Freq = context.createScriptProcessor( 0, 1, 1 );

	freq.onaudioprocess = ( ev ) =>
	{
		const input = ev.inputBuffer.getChannelData( 0 );
		const output = ev.outputBuffer.getChannelData( 0 );
		const freq = ptof( input[ 0 ] * 100 );

		for( let i = 0; i < output.length; i ++ )
		{
			output[ i ] = freq;
		}
	};

	const ptof = ( power ) =>
	{
		//return 600;
		let freq = 0;
		if( carrier_def ) for( let item of carrier_def )
		{
			freq = item[ 1 ];
			if( power < item[ 0 ] ) break;
		}
		return freq;
	};

	power.connect( freq );

	// 

	this.Start = function()
	{
		const schedule = doc.運転;
		context.resume();
		let t = context.currentTime + 0.001;

		power.offset.cancelAndHoldAtTime( t );

		for( let i in schedule )
		{
			const item = schedule[ i ];

			const time = item[ 0 ] || 0;
			const start_v = item[ 1 ] / 100;
			const end_v = item[ 2 ] / 100;

			console.log( t, time, start_v, end_v );

			power.offset.setValueAtTime( start_v, t );
			power.offset.linearRampToValueAtTime( end_v, t + time );

			t += time;
		}

		carrier_def = doc.キャリア設定;
		if( carrier_def == null || carrier_def.length == 0 )  carrier_def = [ 100, 300 ];
	};
};

VF.PWM = function( context, power, freq, output, offset_v, att_v, shape_curve )
{
	const carrier = context.createOscillator();
	const att = context.createGain();
	const offset = context.createConstantSource();
	const shaper = context.createWaveShaper();
	
	carrier.frequency.value = 0;
	freq.connect( carrier.frequency );
	carrier.type = "triangle";
	att.gain.value = att_v;
	offset.offset.value = offset_v;
	shaper.curve = shape_curve;	

	carrier.connect( att );
	att.connect( shaper );
	offset.connect( shaper );
	power.connect( shaper );
	shaper.connect( output );

	carrier.start();
	offset.start();
};
