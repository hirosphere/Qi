
class App
{
	constructor()
	{
		new urlgqst( document.body );
		new gakubuchi( document.body );
		new UI.Animation( document.body );
	}
}

const urlgqst = class
{
	constructor( com )
	{
		const e = ecr( "textarea", com, { class: "urlq" } );
		e.value = tenki_url( new Date().getTime() - 3600 * 1000, 24 ) .join( "\n" );
	}
}

const gakubuchi = class
{
	cur;
	frames;
	start_pos;

	constructor( com )
	{
		const e = ecr( "div", com, { class: "Gaku" } );
		//  this.img = ecr( "img", e, { attrs: { src: "https://storage.tenki.jp/archive/satellite/2021/06/19/10/00/00/japan-near-large.jpg" } } );
		this.img = ecr( "img", e );
		
		this.img.addEventListener( "touchstart", ev => this.touchstart( ev ) );
		this.img.addEventListener( "touchmove", ev => this.touchmove( ev ) );

		this.frames = tenki_url( new Date().getTime() - 240 * 60000, 24 );
		this.cur = this.frames.length - 1;
		this.update();
	}

	update()
	{
		this.img.src = this.frames[ this.cur ];
	}

	touchstart( ev )
	{
		ev.cancelable && ev.preventDefault();
		for( const touch of ev.changedTouches )  if( touch.target == this.img ) this.start_pos = touch.pageX;
	}

	touchmove( ev )
	{
		for( const touch of ev.changedTouches )
		{
			if( touch.target != this.img ) continue;

			const unit = 10;
			const diff = touch.pageX - this.start_pos;
			if( Math.abs( diff ) < unit ) continue;

			this.start_pos = touch.pageX;
			const cur = this.cur + Math.round( diff / unit );
			this.cur = ( cur < 0 ? 0 : cur >= this.frames.length ? this.frames.length - 1 : cur );
			this.update();
		}
	}
}

const UI = {};

UI.Animation = class
{
	constructor( com )
	{
		const e = ecr( "div", com, { class: "Animation", text: "Frame Animation " + df( "{YYYY}{MM}{DD}-{hh}{mm}" ) } );
		this.info = ecr( "div", e, { class: "-info" } );

		e.addEventListener( "touchstart", ev => this.touchstart( ev ) );
		e.addEventListener( "touchmove", ev => this.touchmove( ev ) );
		//  e.addEventListener( "touchend", ev => this.touchend( ev ) );
		//  e.addEventListener( "touchcancel", ev => this.touchend( ev ) );

		this.e = e;
	}

	setinfo( touch )
	{
		this.info.innerText = Math.round( touch.pageX - this.e.offsetLeft );
	}

	touchstart( ev )
	{
		ev.cancelable && ev.preventDefault();
		for( const touch of ev.changedTouches )
		{
			if( touch.target != this.e ) continue;
			this.setinfo( touch );
		}
	}

	touchmove( ev )
	{
		for( const touch of ev.changedTouches )
		{
			if( touch.target != this.e ) continue;
			this.setinfo( touch );
		}
	}

}

class Movie
{
	;
}

const tenki_url = ( endtick, length ) =>
{
	//const fmt = "https://storage.tenki.jp/archive/satellite/{YYYY}/{MM}/{DD}/{hh}/00/00/japan-near-large.jpg";
	const fmt = "https://storage.tenki.jp/archive/satellite/{YYYY}/{MM}/{DD}/{hh}/00/00/japan-wide-vapor-large.jpg";
	
	const rt = [];
	const step = 60 * 60 * 1000;
	for( let tick = endtick - ( length * step ); tick <= endtick; tick += step )
	{
		rt.push( df( fmt, new Date( tick ) ) );
	}
	return rt;
}

