VF.Train = function( doc, context )
{
	//

	const cs = {};
	this.CS = [];

	this.CSList = [ "Ctrl", "Acc", "Speed", "Power", "Gear", "Motor", "Brush", "ACDrive" ];

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

	this.GetParms = () =>
	{
		const p = {}, s = doc.動力設定;
		
		p.whdia = s.車輪径;
		p.whcirc = p.whdia * Math.PI;
		p.whge = s.車輪歯数;
		p.moge = s.電動機歯数;
		p.redr = s.電動機歯数 / s.車輪歯数;

		p.wheel = ( speed ) => ( speed / 3.6 ) / ( p.whcirc / 1000 );
		p.motor = ( speed ) => p.wheel( speed ) * p.redr;

		p.psats = s.電力飽和速度;
		p.relax = s.電力変動緩和時間;
		p.slip = s.誘導すべり率;
		p.acdrv = ( speed ) => p.motor( speed ) * ( 1 + p.slip / 100 );

		p.power = ( acc, speed ) => acc * speed / p.psats;

		return p;
	};

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
		cs.motor.offset.cancelAndHoldAtTime( t );
		cs.acdrive.offset.cancelAndHoldAtTime( t );

	};

	this.AddAccSchedule = ( toff, starttime, endtime, acc, startspeed, endspeed ) =>
	{
		cs.acc.offset.setValueAtTime( acc, toff + starttime );

		cs.speed.offset.setValueAtTime( startspeed, toff + starttime );
		cs.speed.offset.linearRampToValueAtTime( endspeed, toff + endtime );

		const p = this.GetParms();

		{
			const rel = Math.min( p.relax, startspeed <= 0 ? 0 : endtime - starttime );
			cs.power.offset.linearRampToValueAtTime( p.power( acc, startspeed ), toff + starttime + rel );	
			cs.power.offset.linearRampToValueAtTime( p.power( acc, endspeed ), toff + endtime );	
		}

		cs.motor.offset.setValueAtTime( p.motor( startspeed ), toff + starttime );
		cs.motor.offset.linearRampToValueAtTime( p.motor( endspeed ), toff + endtime );

		cs.acdrive.offset.setValueAtTime( p.acdrv( startspeed ), toff + starttime );
		cs.acdrive.offset.linearRampToValueAtTime( p.acdrv( endspeed ), toff + endtime );
	};

};

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
