
import { ArrayModel, Leaf, next_ru } from "../../base/model.js";


//  //

class Index
{
	constructor( src, composition = null )
	{
		this.type = src.type;
		this.title = new Leaf( src.title );
		this.name = new Leaf( src.name );

		this.has_part = new Leaf( src && src.parts && src.parts.length > 0 || false );
		this.is_root = new Leaf( composition == null );

		this.composition = composition;
		composition && ( composition.names[ this.name.value ] = this );
		
		next_ru( this );
	}

	//  //	
	
	get path()
	{
		return ( this.composition && ( this.composition.path + "/" ) || "" ) + this.name;
	}

	async dyn_search( path )
	{
		if( ! path.length ) return null;
		if( path.shift() !== this.name.v ) return null;
		
		await this.load_parts();

		const part = this.names[ path[ 0 ] ];
		return  part && await part.dyn_search( path )  ||  { index: this, subpath: path, is_head: path.length > 0 };
	}

	search( path = [] )
	{
		if( ! path.length ) return null;
		if( path.shift() !== this.name.v ) return null;
		
		const part = this.names[ path[ 0 ] ];
		return  part && part.search( path )  ||  { index: this, subpath: path, is_head: path.length > 0 };
	}


	// query //

	get query()
	{
		return "";
		// return this._test_query;
	}

		_test_query = "&param=" + Math.floor( Math.random() * 101 );


	// parts //

	parts = new ArrayModel();
	names = {};

	async load_parts() { return this.parts };

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

	new_selection()
	{
		return new Selection( this );
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

class IndexView
{
	constructor( index, land )
	{
		this.index = index;
		this.land = land;
	}

	// . link //

	get_link( is_head = false )
	{
		return this.land.make_link( this.index, is_head );
	}

	//  //

	select( is_head )
	{
		this.land.url.value = this.get_link( is_head );
	}

	selected = new Leaf( false );

};

class Selection
{
	constructor( tree )
	{
		this.tree = tree;
		this.url.moreview = url => this.set_url( url );
		this.curr_page.moreview = ( new_index, old_index ) => this.on_page_change( new_index, old_index );
	}

	//  //

	url = new Leaf( null );
	curr_head = new Leaf( null );
	curr_page = new Leaf( null );

	//  //

	async load_url()
	{
		await this.set_url( location.search );
	}

	async set_url( url )
	{
		if( url == null )  return;

		const { index, subpath, is_head } = await this.search( url );
		
		const head = index && ( is_head ? index : index.composition || index );
		this.curr_page.value = index;
		this.curr_head.value = head; 
	}

	async search( url )
	{
		const qs = this.decode_url( url );
		const path_list = qs.page && qs.page.split( "/" ) || [];
		
		const root = this.tree.root;
		const res = root && await root.dyn_search( path_list || [] );

		return res || { index: root, is_head: true };
	}


	make_link( index, is_head )
	{
		return "?page=" + index.path + ( is_head ? "/" : "" ) + index.query;
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

	rus = {};
	
	on_page_change( new_index, old_index )
	{
		const old_item = this.get_item( old_index );
		const new_item = this.get_item( new_index );

		if( old_item ) old_item.selected.v = false;
		if( new_item ) new_item.selected.v = true;
	}

	get_item( index )
	{
		return this.rus[ index ] || this.new_item( index );
	}

	new_item( index )
	{
		if( ! index ) return null;

		const item = this.rus[ index ] = new IndexView( index, this );
		return item;
	}

};

//  //

export { Index, Tree };
export default { Index, Tree };

