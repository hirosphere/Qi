
class Keyboard
{
	Channel = 0;
	Trainspose = 48;

	constructor( com, on_event )
	{
		this.on_event = on_event;

		const e = this.e = ecr( "div", com, { class: "KB" } );
		this.kb_con = e;
		this.mon = ecr( "div", com, { style: { height: "20px" } } );

		this.touch_works = {};
		this.note_id = 0;
		this.keysp = new KeySpace();
		this.key_buttons = {};
		this.create_key_buttons( 0, 36 );

		e.addEventListener( "touchstart", ev => this.touchstart( ev ) );
		e.addEventListener( "touchmove", ev => this.touchmouve( ev ) );
		e.addEventListener( "touchend", ev => this.touchend( ev ) );
		e.addEventListener( "touchcancel", ev => this.touchend( ev ) );
	}

	// interface //

	Shift( value )
	{
		this.Trainspose += value;
		this.update();
	}

	// key buttons //

	create_key_buttons( begin, end )
	{
		for( let key = begin, left = 0; key <= end; key ++ )
		{
			const area = this.keysp.KeyToSpace( key );
			const bu = this.key_buttons[ key ] = new KeyButton( this.kb_con, area, key );
		}
		this.update();
	}

	update()
	{
		for( const n in this.key_buttons )  this.key_buttons[ n ].update( this.Trainspose );
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
			w.tr_key = w.key + this.Trainspose;
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
			w.tr_key = w.key + this.Trainspose;
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
		return this.keysp.PosToKey(  ev.pageX - this.e.offsetLeft, ev.pageY - this.e.offsetTop);
		//return this.pos_to_key(  ev.pageX - this.e.offsetLeft, ev.pageY - this.e.offsetTop);
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
		this.on_event( { type: "Key-On", ch: this.Channel, note_id: w.note_id, key: w.tr_key, touch_id: w.id } );
		
		this.post( [ "Key-On", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	post_note_off( w )
	{
		const kb = this.key_buttons[ w.key ];
		kb && kb.add_active( -1 );
		this.on_event( { type: "Key-Off", ch: this.Channel, note_id: w.note_id, key: w.tr_key, touch_id: w.id } );
		
		this.post( [ "Key-Off", "w" + w.id, "n" + w.note_id, "k" + w.key ].join( " " ) );
	}

	// monitor //

	post( msg ) { this.mon.innerText = msg; }

}

class KeySpace
{
	Pitch = 55;
	Height = 120;
	
	PosToKey( x, y )
	{
		const half = ( y < this.Height ? 1 : 0 );
		return Math.floor( ( x - half * this.Pitch / 2 ) / ( this.Pitch ) ) * 2 + half;
	}

	KeyToSpace( key )
	{
		const half = key % 2;
		const left = key * this.Pitch / 2;
		const top = ( half ? 0 : this.Height );
		const w = this.Pitch - 0;
		const h = this.Height;
		return { left: left, top: top, width: w, height: h };
	}
}

class KeyButton
{
	constructor( com, a, key )    // a: area
	{
		const s = { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" };
		this.e = ecr( "span", com, { class: "KI", style: s } );
		this.key = key;
		this.active = 0;
	}

	static note_name = [ "C", "C#", "D", "D#",  "E", "F", "F#", "G",  "G#", "A", "A#", "B" ];

	update( transpose )
	{
		const key = this.key + transpose;
		const oct = Math.floor( key / 12 );
		const note_num = key - ( oct * 12 );
		const note = KeyButton.note_name[ note_num ];
		const freq = Math.floor( 10 * 440 * Math.pow( 2, ( key - 69 ) / 12 ) ) / 10;
		this.e.innerHTML = `${ oct - 1 }.${ note_num }<br/>${ freq }`;
		//this.e.innerHTML = `${ note }${ oct - 1 }<br/>${ key }`;
		this.e.classList.toggle( "-half", note.length == 2 );
	}

	add_active( v )
	{
		this.active += v;
		this.e.classList.toggle( "-active", this.active > 0 );
	};
}

