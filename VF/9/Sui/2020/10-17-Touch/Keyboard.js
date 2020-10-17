
class Keyboard
{
	KeyPitch = 45;
	constructor( com )
	{
		const e = this.e = ecr( "div", com, { class: "KB" } );
		this.mon = ecr( "div", com, { style: { height: "20px" } } );

		this.touch_works = {};
		this.note_id = 0;
		this.key_buttons = {};
		this.create_key_buttons( 0, 25 );

		e.addEventListener( "touchstart", ev => this.touchstart( ev ) );
		e.addEventListener( "touchmove", ev => this.touchmouve( ev ) );
		e.addEventListener( "touchend", ev => this.touchend( ev ) );
		e.addEventListener( "touchcancel", ev => this.touchend( ev ) );
	}

	// touch //

	touchstart( ev )
	{
		//if( ! ev )  return;
		ev.preventDefault();
		for( const touch of ev.changedTouches )
		{
			const w = this.get_touch_work( touch );
			const key = this.touch_to_key( touch );
			if( key == w.key )  break;
			w.key = key;
			this.post_note_on( w )
		}
	}

	touchmouve( ev )
	{
		if( ! ev )  return;
		for( const touch of ev.changedTouches )
		{
			const w = this.get_touch_work( touch );
			const key = this.touch_to_key( touch );
			if( key == w.key )  break;
			this.post_note_off( w );
			w.key = key;
			this.post_note_on( w );
		}
	}

	touchend( ev )
	{
		if( ! ev )  return;
		for( const touch of ev.changedTouches )
		{
			const w = this.get_touch_work( touch );
			this.post_note_off( w );
			w.key = undefined;
		}
	}

	touch_to_key( ev )
	{
		return this.pos_to_key(  ev.pageX - this.e.offsetLeft, ev.pageY - this.e.offsetTop);
	}

	get_touch_work( touch )
	{
		const id = touch.identifier;
		return this.touch_works[ id ] || ( this.touch_works[ id ] = { id: id } );
	}

	// pos //
	
	pos_to_key( x, y )
	{
		return Math.floor( x / this.KeyPitch );
	}

	key_to_pos( key )
	{
		return { left: key * this.KeyPitch, top: 0 };
	}

	// key buttons //

	create_key_buttons( begin, end )
	{
		for( let key = begin, left = 0; key <= end; key ++ )
		{
			this.create_key_button( left, key, key );
			left += this.KeyPitch;
		}
	}

	create_key_button( left, label, key )
	{
		const top = 0 + "px";
		const e = ecr( "span", this.e, { class: "KI", text: label, style: { left: left + "px", top: top } } );
		e.active = 0;
		e.add_active = ( v ) =>
		{
			e.active += v;
			e.classList.toggle( "-active", e.active > 0 );
		};
		this.key_buttons[ key ] = e;
	}

	// note //

	post_note_on( w )
	{
		const note_id = w.note_id = ++ this.note_id;
		const kb = this.key_buttons[ w.key ];
		kb && kb.add_active( 1 );
		this.post( [ "Key-On", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	post_note_off( w )
	{
		const kb = this.key_buttons[ w.key ];
		kb && kb.add_active( -1 );
		this.post( [ "Key-Off", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	// monitor //

	post( msg ) { this.mon.innerText = msg; }

}

