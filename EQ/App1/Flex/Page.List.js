
let RootPage = class_def
(
	null,
	function()
	{
		this.Initiate = function( indexSel )
		{
			this.e = q.horiz( null, { "class": "ROOT_PAGE" } );
			this.title = q.h1( this.e, { "class": "INDEX_SIDE_HEADER" } );
			this.List = new EnterList( this.e, "ENTER_LIST", indexSel );
		};

		this.OnIndexChange = function( index )
		{
			q.text( this.title, Cu.Index.Cap( index ) );
			this.List.SetIndex( index );
		};
	}
);

let YearPage = class_def
(
	null,
	function()
	{
		this.Initiate = function( indexSel )
		{
			this.e = q.horiz( null, { "class": "YEAR_PAGE" } );
			this.title = q.h1( this.e, { "class": "INDEX_SIDE_HEADER" } );
			this.List = new EnterList( this.e, "ENTER_LIST", indexSel );
		};

		this.OnIndexChange = function( index )
		{
			q.text( this.title, Cu.Index.Cap( index ) );
			this.List.SetIndex( index );
		};
	}
);

let EQPage = class_def
(
	null,
	function()
	{
		this.Initiate = function( indexSel )
		{
			this.e = q.horiz( null, { "class": "EQ_PAGE" } );
			this.title = q.h1( this.e, { "class": "INDEX_SIDE_HEADER" } );
			this.List = new EnterList( this.e, "ENTER_LIST", indexSel );
		};

		this.OnIndexChange = function( index )
		{
			q.text( this.title, Cu.Index.Cap( index ) );
			this.List.SetIndex( index );
		};
	}
);

let FolderPage = class_def
(
	null,
	function()
	{
		this.Initiate = function( indexSel )
		{
			this.e = q.horiz( null, { "class": "FOLDER_PAGE" } );
			this.title = q.h1( this.e, { "class": "INDEX_SIDE_HEADER" } );
			this.List = new EnterList( this.e, "EnterList", indexSel );
		};

		this.OnIndexChange = function( index )
		{
			q.text( this.title, Cu.Index.Cap( index ) );
			this.List.SetIndex( index );
		};
	}
);
