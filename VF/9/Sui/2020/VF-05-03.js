
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

	const eq_1 = context.createBiquadFilter();
	eq_1.type = "bandpass";
	eq_1.connect( master_volume );

	const train = this.Train = new VF.Train( doc, context );
	const proc = new VF.Proc( doc, train, context, eq_1, this.WaveMonitor );

	//

	this.GetTrainVars = () => proc.vars;

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
		eq_1.frequency.value = doc.音響1.周波数;
		eq_1.Q.value = doc.音響1.共振;
	};
};

let mon;
setInterval( ()=>mon !== undefined && console.log( mon ), 2000 );

VF.Proc = function( doc, train, context, dest, wave_mon )
{
	const 動力設定 = doc.動力設定;
	this.vars = {};

	// 実装 //

	console.log( context.sampleRate );

	const proc_node = context.createScriptProcessor( 0, train.CS.length, 1 );
	const samplerate = context.sampleRate;
	let update_ctr = samplerate;

	const vvvf_wg = new VF.VVVF_WG( samplerate );
	let wg = vvvf_wg;

	let test_ph = 0;


	proc_node.onaudioprocess = ( ev ) =>
	{
		const inp = {};
		for( let i in train.CSList )  inp[ train.CSList[ i ] ] = ev.inputBuffer.getChannelData( i );


		const main_out = ev.outputBuffer.getChannelData( 0 );

		for( let i = 0; i < main_out.length; i ++ )
		{
			const s = { sync: false };		

			if( ( update_ctr += 100 ) >= samplerate )
			{
				update_ctr -= samplerate;
				for( let name in inp )  this.vars[ name ] = inp[ name ][ i ];

				wg.update( this.vars, 動力設定.切り替え );
			}
	
			if( inp.Ctrl[ i ] != 0 )
				wg.draw( i , main_out, s );
			else
				main_out[ i ] = 0;

			wave_mon.post( s );
		}
	};

	//- 結線 -//

	{
		const merger = context.createChannelMerger( train.CS.length );

		for( let i in train.CS )  train.CS[ i ].connect( merger, 0, i );

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
	const sig = { gain: 0, step: 0, phase: 0 };
	const async_carr = { step: 0, phase: 0 };
	let sync_rate = 0;

	this.update = ( vars, modes ) =>
	{
		sig.freq = vars.ACDrive;
		sig.step = sig.freq / samplerate;
		sig.gain = Math.abs( vars.Power );

		sig_beg = 0;  // Hz
		sig_end = 0;  // Hz
		ac_beg = 1050;  // Hz
		ac_end = 700;  // Hz

		if( modes && modes.constructor == Array ) for( let mode of modes )
		{
			sig_beg = sig_end;
			sig_end = mode[ 0 ];

			if( sig.freq > mode[ 0 ] )  continue;
			sync_rate = mode[ 1 ];

			ac_beg = mode[ 2 ] || 0;
			ac_end = emp_fill( mode[ 3 ], ac_beg );

			break;
		}

		async_carr.freq = clip
		(
			ac_beg +
				( ac_end - ac_beg  ) *
				( sig.freq - sig_beg ) / ( sig_end - sig_beg )
			,
			Math.max( ac_beg, ac_end ),
			Math.min( ac_beg, ac_end )
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

		if( ( sig.phase += sig.step ) >= 1 )
		{
			sig.phase -= 1;
			s.sync = true;
		}
		
		// キャリア //

		const carr_phase = ( sync_rate ? ( sig.phase * sync_rate ) % 1 : async_carr.phase );
		const carr_freq = ( sync_rate ? sig.freq : async_carr.freq );

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
		//s.a = sig.phase;
		//s.b = sig_u;  s.c = sig_v;  s.d = sig_w;
		s.b = pul_u;  s.c = pul_v;  s.d = main / 2;
	};

	const sin = ( diff ) => sig.gain * Math.sin( ( sig.phase + diff / 360 ) * Math.PI * 2 );

	const get_pulse = ( sig, carr, scale ) =>
	{
		return clip( carr * scale + sig * scale, 1, -1 );
	};
	
	const clip = ( value, max, min ) => Math.min( max, Math.max( min, value ) );
}


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

