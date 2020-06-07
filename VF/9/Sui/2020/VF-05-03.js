
const VF = new function()
{
};

VF.SoundGen = function( doc )
{
	this.Volume = 30;

	this.WaveMonitor = new VF.WaveMon();

	const context = new AudioContext();
	const master_volume = context.createGain();
	master_volume.connect( context.destination );

	//const eq_1 = context.createBiquadFilter();
	//eq_1.type = "bandpass";
	//eq_1.connect( master_volume );

	const train = new VF.Train( doc, context );
	let cur_vf = null;

	const proc = new VF.Proc( doc, train, context, master_volume, this.WaveMonitor );

	//

	this.Start = function()
	{
		const t = context.currentTime + 0.01;
		train.Start( t );
		this.Update( t );
	};

	this.Stop = function()
	{
		const t = context.currentTime + 0.01;
		train.Stop( t );
	};
	
	this.Update = function( t )
	{
		master_volume.gain.value = this.Volume / 100;
		//eq_1.frequency.value = doc.音響1.周波数;
		//eq_1.Q.value = doc.音響1.共振;
	};
};

VF.Train = function( doc, context )
{
	const mode = this.Mode = context.createConstantSource();
	mode.offset.value = 0;
	mode.start();
	
	const power = this.Power = context.createConstantSource();
	power.offset.value = 0;
	power.start();

	const motor_hz = this.Motor_Hz = context.createConstantSource();
	motor_hz.offset.value = 0;
	motor_hz.start();

	// 

	this.Start = function( t )
	{
		context.resume();

		const schedule = doc.運転;

		mode.offset.setValueAtTime( 1, t );
		
		power.offset.cancelAndHoldAtTime( t );

		for( let i in schedule )
		{
			const item = schedule[ i ];

			const time = ef( item[ 0 ] , 0 );

			if( item[ 1 ] != undefined )
			{
				if( item[ 2 ] != undefined )
				{
					power.offset.setValueAtTime( ef( item[ 1 ], 0 ), t );
					power.offset.linearRampToValueAtTime( ef( item[ 2 ], 0 ), t + time );
				}
				else
				{
					power.offset.linearRampToValueAtTime( ef( item[ 1 ], 0 ), t + time );
				}
			}

			t += time;
		}
	};

		const ef = ( v, f ) => v != null ? v : f;

	this.Stop = function( t )
	{
		mode.offset.setValueAtTime( 0, t );
		power.offset.cancelAndHoldAtTime( t );
	};
};

const clip = ( sig, clip ) => Math.min( clip, Math.max( - clip, sig ) );

let mon;
setInterval( ()=>mon !== undefined && console.log( mon ), 2000 );

VF.Proc = function( doc, train, context, dest, wave_mon )
{

	// 実装 //

	console.log( context.sampleRate );

	const proc_node = context.createScriptProcessor( 0, 2, 1 );
	const samplerate = context.sampleRate;
	let update_ctr = samplerate;

	const vvvf_wg = new VF.VVVF_WG( samplerate );
	const test_wg = new VF.Test_WG( samplerate );
	let wg = vvvf_wg;

	let test_ph = 0;

	proc_node.onaudioprocess = ( ev ) =>
	{
		const mode_in = ev.inputBuffer.getChannelData( 0 );
		const power_in = ev.inputBuffer.getChannelData( 1 );

		const main_out = ev.outputBuffer.getChannelData( 0 );

		for( let i = 0; i < main_out.length; i ++ )
		{
			const s = { sync: false };		
	
			if( mode_in[ i ] == 0 )
			{
				main_out[ i ] = 0;
				//main_out[ i ] += Math.sin( Math.PI * 2 * test_ph );
				test_ph += 500 / samplerate;
				test_ph %= 1;
				update_ctr = samplerate;
				continue;
			}

			if( ( update_ctr += 100 ) >= samplerate )
			{
				update_ctr -= samplerate;
				const params = { power: power_in[ i ] / 100 };
				params.vvvf =
				{
					modes: doc.VVVF設定.切り替え,
					freq: power_in[ i ] / 100 * 100,
					clip: doc.VVVF設定.電力飽和周波数 || 1
				};
				wg.update( params );
			}

			wg.draw( i , main_out, s );
			wave_mon.post( s );
		}
	};

	//- 結線 -//

	{
		const merger = context.createChannelMerger( 2 );
		train.Mode.connect( merger, 0, 0 );
		train.Power.connect( merger, 0, 1 );
		merger.connect( proc_node );
	}
	{
		const splitter = context.createChannelSplitter( 5 );	
		proc_node.connect( splitter );
		splitter.connect( dest, 0 );
	}
};

VF.VVVF_WG = function( samplerate )
{
	const mod = { gain: 0, step: 0, phase: 0 };
	const async_carr = { step: 0, phase: 0 };
	let sync_rate = 0;

	this.update = ( params ) =>
	{
		mod.freq = params.vvvf.freq;
		mod.step = mod.freq / samplerate;
		mod.gain = params.vvvf.freq / params.vvvf.clip;

		mb = 0;  // Hz
		me = 0;
		acb = 1050;  // Hz
		ace = 700;  // Hz

		const modes = params.vvvf.modes;
		if( modes && modes.constructor == Array ) for( let mode of modes )
		{
			mb = me;
			me = mode[ 0 ];

			if( mod.freq > mode[ 0 ] )  continue;
			sync_rate = mode[ 1 ];

			acb = mode[ 2 ] || 0;
			ace = emp_fill( mode[ 3 ], acb );

			break;
		}

		async_carr.freq = clip
		(
			acb +
				( ace - acb  ) *
				( mod.freq - mb ) / ( me - mb )
			,
			Math.max( acb, ace ),
			Math.min( acb, ace )
		);

		async_carr.step = async_carr.freq / samplerate;

	};

	const emp_fill = ( value, fill ) => value != null ? value : fill;

	this.draw = ( i, main_out, s ) =>
	{		
		// モジュレーター //

		const sig_u = sin( 0 );
		const sig_v = sin( 120 );
		const sig_w = sin( 240 );

		if( ( mod.phase += mod.step ) >= 1 )
		{
			mod.phase -= 1;
			s.sync = true;
		}
		
		// キャリア //

		const carr_phase = ( sync_rate ? ( mod.phase * sync_rate ) % 1 : async_carr.phase );
		const carr_freq = ( sync_rate ? mod.freq : async_carr.freq );

		const ph = carr_phase * 4;
		const carr_tri = ( ph < 1 ? ph : ( ph < 3 ? 2 - ph : ph - 4 ) );
		

		if( ( async_carr.phase += async_carr.step ) >= 1 )
		{
			async_carr.phase %= 1;
			s.ac_sync = true;
		}

		const scale = samplerate / carr_freq / 2;
		const pul_u = get_pulse( sig_u, carr_tri, scale );
		const pul_v = get_pulse( sig_v, carr_tri, scale );
		const pul_w = get_pulse( sig_w, carr_tri, scale );

		const pul_uv = pul_u - pul_v;
		const pul_vw = pul_v - pul_w;
		const pul_wu = pul_w - pul_u;

		const main = main_out[ i ] = pul_uv;

		s.a = carr_tri;
		//s.a = mod.phase;
		//s.b = sig_u;  s.c = sig_v;  s.d = sig_w;
		s.b = pul_u;  s.c = pul_v;  s.d = main / 2;
	};

	const sin = ( diff ) => mod.gain * Math.sin( ( mod.phase + diff / 360 ) * Math.PI * 2 );

	const get_pulse = ( sig, carr, scale ) =>
	{
		return clip( carr * scale + sig * scale, 1, -1 );
	};
	
	const clip = ( value, max, min ) => Math.min( max, Math.max( min, value ) );
}


VF.Test_WG = function( samplerate )
{
	const osc = { gain: 0, phase: 0, freq: 440 };

	this.update = ( power, freq ) =>
	{
		osc.gain = power;
		osc.step = osc.freq / samplerate;
	};

	this.draw = ( i, out, ms ) =>
	{
		const s = Math.random() * 2 - 0.5;
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );
		out[ i ] = ms.a = osc.gain * Math.sin( osc.phase * Math.PI * 2 );

		if( ( osc.phase += osc.step ) >= 1 )
		{
			osc.phase %= 1;
		}
	};
};


VF.Graph = function( canvas, mon )
{
	const context = canvas.getContext( "2d" );
	const width = canvas.width;
	const height = canvas.height;
	const y_half = height / 2;

	const clear = () =>
	{
		context.fillStyle = "hsl( 45, 5%, 95% )";
		context.fillRect( 0, 0, width, height );
	}

	this.Update = () =>
	{
		clear();

		const yp = 80; let yc = yp / 2 + 0;
		const sl = 60, dl = 120;
		draw_wave( mon.a, yc, yp * 0.4, 0, sl, 0, dl );  yc += yp;
		draw_wave( mon.b, yc, yp * 0.4, 0, sl, 0, dl );  yc += yp;
		draw_wave( mon.c, yc, yp * 0.4, 0, sl, 0, dl );  yc += yp;
		draw_wave( mon.d, yc, yp * 0.4, 0, sl, 0, dl );  yc += yp;
	};

	const draw_wave = ( wave, yc, ya, sbeg, slen, dbeg, dlen ) =>
	{
		context.beginPath();
		context.moveTo( wave[ 0 ], yc );

		const x_ratio = dlen / slen;

		for( let i = sbeg; i < sbeg + slen; i ++ )
		{
			const value = wave[ i ] || 0;
			const y = yc - value * ya;
			context.lineTo( ( i + 0 ) * x_ratio, y );
			context.lineTo( ( i + 1 ) * x_ratio, y );
		}

		context.stroke();
	};

	clear();
};

VF.WaveMon = function()
{
	const len = 4800;
	this.a = new Array( len );
	this.b = new Array( len );
	this.c = new Array( len );
	this.d = new Array( len );
	let pos = 0;

	this.post = ( sample ) =>
	{
		if( pos >= len )
		{
			if( sample.sync )  pos = 0;
			else  return;
		}

		this.a[ pos ] = sample.a || 0;
		this.b[ pos ] = sample.b || 0;
		this.c[ pos ] = sample.c || 0;
		this.d[ pos ] = sample.d || 0;

		++ pos;
	};
};


VF.DCPWM = function( doc, context, train, destination )
{
	// インターフェース //

	this.Start = ( time ) =>
	{
		console.log( "DCPWM.Start" );

		const cd = ( doc && doc.直流PWM設定 );
		carrier_def =
		(
			cd && cd.constructor == Array && cd.length > 0 ?  cd :

				[ [ 1.5, 150, "C" ], [ 3.0, 300, "C" ], [ 4.5, 600, "C" ], [ 6, 900 ],  ]
		);
		enable_sig.offset.setValueAtTime( 1, time );
	};

	this.Stop = ( time ) => enable_sig.offset.setValueAtTime( 0, time );

	// 実装 //

	const enable_sig = context.createConstantSource();
	const carrier = context.createScriptProcessor( 0, 2, 1 );
	
	const samplerate = context.sampleRate;
	
	let carr_update_ctr = samplerate;
	let phase = 0;
	let carrier_def;

	const ptof = ( power, rt ) =>
	{
		let freq = 0;
		rt.power = power / 100;

		if( carrier_def ) for( let item of carrier_def )
		{
			freq = item[ 1 ] || 0;
			const point = item[ 0 ] || 0;

			if( power < ( point ) ) break;
		}
		rt.freq = freq;
	};

	
	const c = { freq : 0, power : 0 };
	
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
				carr_update_ctr = samplerate;
				continue;
			}

			const power = power_in[ i ];  // パーセント値 //

			if( ( carr_update_ctr += 200 ) >= samplerate )
			{
				carr_update_ctr -= samplerate;
				ptof( power, c );
			}
	
			output[ i ] = get_pulse( c.power, phase, c.freq, samplerate );

			if( ( phase += c.freq ) >= samplerate ) phase -= samplerate;
		}
	}
	
	const get_pulse = ( power, phase, freq, s_rate ) =>
	{
		const ph = phase / freq;
		const scale = s_rate / freq;
		const half = scale / 2;
		const bias = half - 1;
		const carr = clip( ph < half ? ph - bias : half - ph, 0, - bias );
		const wf = power * half + carr;
		return clip( wf, 1, 0 ) * 2 - 1;
	};
	
	const clip = ( value, max, min ) => Math.min( max, Math.max( min, value ) );

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
