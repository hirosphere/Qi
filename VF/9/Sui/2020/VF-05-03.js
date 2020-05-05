
const VF = new function()
{
};

VF.SoundGen = function( doc )
{
	this.Volume = 30;

	const context = new AudioContext();
	const master_volume = context.createGain();
	master_volume.connect( context.destination );

	const eq_1 = context.createBiquadFilter();
	eq_1.type = "bandpass";
	eq_1.connect( master_volume );

	const train = new VF.Train( doc, context );
	const dc_pwm = new VF.DCPWM( context, train, eq_1 );

	//

	this.Start = function()
	{
		const time = context.currentTime + 0.01;
		dc_pwm.Start( time, doc.キャリア設定 );
		train.Start( time );
		this.Update();
	};

	this.Stop = function()
	{
		const time = context.currentTime + 0.01;
		dc_pwm.Stop( time );
		train.Stop( time );
	};
	
	this.Update = function()
	{
		master_volume.gain.value = this.Volume / 100;
		eq_1.frequency.value = doc.音響1.周波数;
		eq_1.Q.value = doc.音響1.共振;
	};
};

VF.Train = function( doc, context )
{
	const power = this.Power = context.createConstantSource();
	power.offset.value = 0;
	power.start();

	// 

	this.Start = function( t )
	{
		context.resume();

		const schedule = doc.運転;

		power.offset.cancelAndHoldAtTime( t );

		for( let i in schedule )
		{
			const item = schedule[ i ];

			const time = item[ 0 ] || 0;
			const start_v = item[ 1 ] / 100;
			const end_v = item[ 2 ] / 100;

			power.offset.setValueAtTime( start_v, t );
			power.offset.linearRampToValueAtTime( end_v, t + time );

			t += time;
		}
	};

	this.Stop = function( time )
	{
		power.offset.cancelAndHoldAtTime( time );
	};
};

VF.DCPWM = function( context, train, destination )
{
	// インターフェース //

	this.Start = ( time, carrier_def_ ) =>
	{
		carrier_def =
		(
			carrier_def_ && carrier_def_.constructor == Array && carrier_def_.length > 0 ?

				carrier_def_ : [ [ 1.5, 150, "C" ], [ 3.0, 300, "C" ], [ 4.5, 600, "C" ], [ 6, 900, "C" ],  ]
		);
		enable_sig.offset.setValueAtTime( 1, time );
	};

	this.Stop = ( time ) => enable_sig.offset.setValueAtTime( 0, time );

	// 実装 //

	const enable_sig = context.createConstantSource();
	const carrier = context.createScriptProcessor( 0, 2, 1 );
	let phase = 0;
	let carrier_def;

	const ptof = ( power ) =>
	{
		let freq = 0;
		if( carrier_def ) for( let item of carrier_def )
		{
			freq = item[ 1 ] || 0;
			const point = item[ 0 ] || 0;

			if( power < ( point ) ) break;
		}
		return freq;
	};

	carrier.onaudioprocess = ( ev ) =>
	{
		const power_in = ev.inputBuffer.getChannelData( 0 );
		const enable_in = ev.inputBuffer.getChannelData( 1 );
		const output = ev.outputBuffer.getChannelData( 0 );

		for( let i = 0; i < output.length; i ++ )
		{
			if( ! enable_in[ i ] )
			{
				output[ i ] = 0;
				continue;
			}

			const power = power_in[ i ];
			const freq = ptof( power * 100 );
			const step = freq / context.sampleRate;

			output[ i ] = get_pulse( power, phase, step );
			//output[ i ] = ( ( power + phase ) > 1 ? - 1 : 1 );

			if( ( phase += step ) >= 1 ) phase -= 1;
		}
	};

	const get_pulse = ( power, phase, step ) =>
	{
		const saw = phase;
		const tri = 2 * ( phase < 0.5 ? phase : 1 - phase );

		const carr = ( step +  tri * ( 1 - step ) );
		const gain = 1 / step;
		const wf = Math.max( 0, carr - 1 + power ) * gain;
		return Math.min( 2, wf * 2 ) - 1;
	};

	//- 結線 //

	const merger = context.createChannelMerger( 2 );
	{
		train.Power.connect( merger, 0, 0 );
		enable_sig.connect( merger, 0, 1 );
		merger.connect( carrier );
	}	
	carrier.connect( destination );
	
	enable_sig.offset.value = 0;
	enable_sig.start();
} ;
