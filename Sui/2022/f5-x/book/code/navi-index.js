
import { ArrayModel, Leaf, next_ru } from "../../base/model.js";


//  //

class Index
{
	constructor( src, composition = null, order )
	{
		this.type = src.type;
		this.title = new Leaf( src.title );
		this.name = src.name;

		this.has_part = new Leaf( src && src.parts && src.parts.length > 0 || false );
		this.is_root = new Leaf( composition == null );

		this.composition = composition;
		
		if( composition )
		{
			this.path = [ ... composition.path, this ];
			composition.names[ this.name ] = this;
		}

		else
		{
			this.path = [ this ];
		}

		this.order = order;
		
		next_ru( this );
	}

	//  structure  //

	get path_mon()
	{
		return this.path.map( i => i.title.value );
	}
	
	get link_path()
	{
		const com_path = this.composition && this.composition.link_path || [];

		return [ ... com_path, encodeURIComponent( this.name ) ];
	}

	async search( path )
	{
		if( path.length == 0 )  return { index: this, rem: [] };

		await this.load_parts();
		const rem = [ ... path ];
		const name = path.shift();
		const part = this.names[ name ];

		if( part )  return await part.search( path, this );

		return { index: this, rem };
	}

	path = [];
	names = {};
	parts = new ArrayModel();

	async load_parts() { return this.parts };


	// query //

	get query()
	{
		return "";
		// return this._test_query;
	}

		_test_query = "&param=" + Math.floor( Math.random() * 101 );


	// page def //
	
	get_content_def( location ) { return null; }


	//  //

	toString() { return this.ru; }
}


//  //

class Tree
{
	constructor( src, types = {} )
	{
		this.types = types;
		this.root = this.create_index( src, null );
		this.update_monitor();
	}

	new_locatiol()
	{
		return new Location( this );
	}

	//  //

	create_index( src, composition )
	{
		if( ! src ) return null;

		const type = this.types[ src.type ] || Index;
		const index = new type( src, composition, this );

		if( src.parts ) for( const psrc of src.parts )
		{
			index.parts.push( this.create_index( psrc, index ) );
		}

		return index;
	}

	//  //

	monitor = new Leaf( "tree" );
	update_monitor()
	{
		const list = [];
		for( let ru in this.rus )
		{
			const index = this.rus[ ru ];
			list.push( `${ ru } ${ index.title } ${ index.path }` );
		}
		this.monitor.v = list.join( "\n" );
	}
}


//  //

class Location
{
	constructor( tree )
	{
		this.tree = tree;
		this.url.moreview = url => this.on_url_update( url );
		this.curr_page.moreview = ( new_index, old_index ) => this.on_page_change( new_index, old_index );
	}

	//  //

	url = new Leaf( null );
	on_changed( url, index ) {}

	//  //

	curr_head = new Leaf( null );
	curr_page = new Leaf( null );

	//  //

	async load_url()
	{
		this.url.value = location.search;
	}

	select( index, is_head = false )
	{
		this.url.value = this.get_link( index, is_head );
	}

	get_selected( index )
	{
		return  this.stats.selected[ index ] = this.stats.selected[ index ] || new Leaf( false );
	}

	get_link( index, is_head )
	{
		const path = index.link_path || [];
		path.shift();
		const head = ( ! index.is_root.v && is_head ) ? "/" : "";
		const query = index.query;

		return "?page=" + path.join( "/" ) + head + query;
	}

	//  //

	async on_url_update()
	{
		if( this.url.value == null )  return;

		const { index, is_head, rem } = await this.search( this.url.value );
		
		const head = index && ( is_head ? index : index.composition || index );
		this.curr_head.value = head;
		this.curr_page.value = index;

		this.on_changed( this.url.value, index );
	}

	async search( url )
	{
		const qs = this.decode_url( url );
		const path = qs.page && qs.page.split( "/" ) || [];
		
		const is_head =  path.slice( -1 )[ 0 ] == "";
		if( is_head )  path.pop();
		
		const root = this.tree.root;
		const res = root && await root.search( path ) || {};

		return { is_head, ... res };
	}

	decode_url( url )
	{
		if( ! url )  return {};

		const queries = url.replace( "?", "" ).split( "&" );
		const rt = {};
		for( const name_value of queries )
		{
			const [ name, value ] = name_value.split( "=" );
			rt[ decodeURIComponent( name ) ] = decodeURIComponent( value );
		}
		return rt;
	}

	
	// item pool //

	stats = { selected: {} };
	
	on_page_change( new_index, old_index )
	{
		const old_item = this.get_selected( old_index );
		const new_item = this.get_selected( new_index );

		if( old_item ) old_item.value = false;
		if( new_item ) new_item.value = true;
	}
};

//  //

export { Index, Tree };
export default { Index, Tree };

