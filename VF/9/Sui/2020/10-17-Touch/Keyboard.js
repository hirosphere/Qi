
class Keyboard
{
	KeyPitch = 45;
	Channel = 0;

	constructor( com, on_event )
	{
		this.on_event = on_event;

		const e = this.e = ecr( "div", com, { class: "KB" } );
		this.kb_con = e;
		this.mon = ecr( "div", com, { style: { height: "20px" } } );

		this.touch_works = {};
		this.note_id = 0;
		this.key_buttons = {};
		this.create_key_buttons( 52, 77 );

		e.addEventListener( "touchstart", ev => this.touchstart( ev ) );
		e.addEventListener( "touchmove", ev => this.touchmouve( ev ) );
		e.addEventListener( "touchend", ev => this.touchend( ev ) );
		e.addEventListener( "touchcancel", ev => this.touchend( ev ) );
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
		const e = ecr( "span", this.kb_con, { class: "KI", text: label, style: { left: left + "px", top: top } } );
		e.active = 0;
		e.add_active = ( v ) =>
		{
			e.active += v;
			e.classList.toggle( "-active", e.active > 0 );
		};
		this.key_buttons[ key ] = e;
	}

	// touch //

	touchstart( ev )
	{
		ev.preventDefault();
		for( const touch of ev.changedTouches )
		{
			if( ! this.is_key_button( touch.target ) ) continue;

			const w = this.get_touch_work( touch );
			w.key = this.touch_to_key( touch );
			this.post_note_on( w )
		}
	}

	touchmouve( ev )
	{
		for( const touch of ev.changedTouches )
		{
			if( ! this.is_key_button( touch.target ) ) continue;
			
			const w = this.get_touch_work( touch );
			const key = this.touch_to_key( touch );
			if( key == w.key )  continue;
			
			this.post_note_off( w );
			w.key = key;
			this.post_note_on( w );
		}
	}

	touchend( ev )
	{
		for( const touch of ev.changedTouches )
		{
			if( ! this.is_key_button( touch.target ) ) continue;

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

	is_key_button( e )
	{
		return e != null && e.parentNode == this.kb_con;
	}

	// note //

	post_note_on( w )
	{
		const note_id = w.note_id = ++ this.note_id;
		const kb = this.key_buttons[ w.key ];
		kb && kb.add_active( 1 );
		this.on_event( { type: "Key-On", ch: this.Channel, note_id: w.note_id, key: w.key, touch_id: w.id } );
		
		this.post( [ "Key-On", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	post_note_off( w )
	{
		const kb = this.key_buttons[ w.key ];
		kb && kb.add_active( -1 );
		this.on_event( { type: "Key-Off", ch: this.Channel, note_id: w.note_id, key: w.key, touch_id: w.id } );
		
		this.post( [ "Key-Off", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	// monitor //

	post( msg ) { this.mon.innerText = msg; }

}

