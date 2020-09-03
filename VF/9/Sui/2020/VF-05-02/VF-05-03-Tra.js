/*

Train オーディオスケジュール属性

	(スケジュールで個別に制御したい属性)

	加速度	Acc
	速度	Speed
	モーター回転周波数	Motor
	インバータ駆動周波数	Inv


Proc 波形プロセッサが算出する属性

	キャリアモード, キャリア周波数



*/




VF.Train = function( doc, context )
{
	//
	const ds = doc.動力設定;

	const cs = {};
	this.CS = [];

	this.CSList = [ "Ctrl", "Acc", "Speed", "Power" ];

	for( let i in this.CSList )
	{
		const name = this.CSList[ i ];
		const c = cs[ name.toLowerCase() ] = this.CS[ i ] = context.createConstantSource();
		c.offset.value = 0;
		c.start();
	}

	//

	const seq = new VF.Sequence( this );

	//

	let run = false;

	this.Start = function( t )
	{
		this.Stop( t );
		run = true;

		context.resume();

		seq.build( doc.運転 || [] );
		seq.apply( t );

		cs.ctrl.offset.setValueAtTime( 1, t );
	};

	this.Stop = function( t )
	{
		if( run == false )  return;
		run = false;

		cs.ctrl.offset.setValueAtTime( 0, t );
		cs.acc.offset.cancelAndHoldAtTime( t );
		cs.speed.offset.cancelAndHoldAtTime( t );
		cs.power.offset.cancelAndHoldAtTime( t );
	};

	this.AddAccSchedule = ( toff, starttime, endtime, acc, startspeed, endspeed ) =>
	{
		cs.acc.offset.setValueAtTime( acc, toff + starttime );

		cs.speed.offset.setValueAtTime( startspeed, toff + starttime );
		cs.speed.offset.linearRampToValueAtTime( endspeed, toff + endtime );


		const rel = Math.min( ds.電力変動緩和時間, startspeed <= 0 ? 0 : endtime - starttime );
		cs.power.offset.linearRampToValueAtTime( calc_power( acc, startspeed ), toff + starttime + rel );	
		cs.power.offset.linearRampToValueAtTime( calc_power( acc, endspeed ), toff + endtime );	
	};

	const calc_power = ( acc, speed ) => acc * ( ( speed * ds.動力時速比 ) / ds.電力飽和回転数 );

};


//  //

VF.Sequence = function( train )
{
	let schedule = {};
	let currenttime = 0;

	this.apply = ( timeoffset ) =>
	{
		for( let key in schedule )
		{
			for( let item of schedule[ key ] )  item.apply( timeoffset );
		}
	};

	this.clear = () =>
	{
		;
	};

	this.build = function( sequence )
	{
		schedule = {};

		const context =
		{
			timepoint: 0, speed: 0, acc: 0
		};

		for( let item of sequence )
		{
			const ctor = Item[ item[ 0 ] ];
			if( ctor )  new ctor( context, item );
		}
	}

	const Item = {};

	Item[ "加速度" ] = function( context, args )
	{
		const starttime = context.timepoint;
		const accv = Math.abs( fld( args, 1, 0 ) );
		const speed = context.speed;
		const target = fld( args, 2, speed );
		const diff = target - speed;
		const acc = ( diff >= 0 ? accv : - accv );

		const time = Math.abs( diff / accv );
		const endtime = starttime + time;
		context.timepoint = endtime;
		context.speed = target;

		add( starttime, this );

		this.name = args[ 0 ];

		this.apply = ( timeoffset ) =>
		{
			train.AddAccSchedule( timeoffset, starttime, endtime, acc, speed, target );
		};

		log( starttime, time, args, this );
	};

	Item[ "惰行" ] = function( context, args )
	{
		const starttime = context.timepoint;
		const speed = context.speed;
		const time = fld( args, 1, 0 );
		const endtime = starttime + time;
		context.timepoint = endtime;

		add( starttime, this, args );
		log( starttime, time, args );

		this.apply = ( timeoffset ) =>
		{
			train.AddAccSchedule( timeoffset, starttime, endtime, 0, speed, speed );
		};
	};

	Item[ "停止" ] = function( context, args )
	{
		const starttime = context.timepoint;
		const time = fld( args, 1, 0 );
		const endtime = starttime + time;
		context.timepoint = endtime;

		add( starttime, this );
		log( starttime, time, args );


		this.apply = ( timeoffset ) =>
		{
			train.AddAccSchedule( timeoffset, starttime, endtime, 0, 0, 0 );
		};
	};

	const add = ( timepoint, item ) =>
	{
		const key = Math.floor( timepoint );
		( schedule[ key ] = schedule[ key ] || [] ).push( item );
	};

	//const log = ( st, t, a ) => console.log( st+" :", t+"秒", a[ 0 ] );
	const log = ( st, t, a ) => undefined;

	const fld = ( item, index, f ) => item[ index ] !== undefined ? item[ index ] : f ;
};
