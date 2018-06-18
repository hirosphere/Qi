let UI = {};

let PageSwitch = class_def		// ページスイッチ //
(
	null,
	function()
	{
		this.Initiate = function( com, className )
		{
			this.Current = null;
			this.Pages = {};
			this.e = com;
		};

		this.Add = function( page, name )
		{
			this.Pages[ name ] = page;
			page.e.style.display = "none";
			this.e.appendChild( page.e );
		};

		this.Select = function( name )
		{
			let page = this.Pages[ name ];
			if( page == this.Current )  return;

			this.Current && ( this.Current.e.style.display = "none" );
			this.Current && this.Current.OnHide && this.Current.OnHide();
			this.Current = page;
			this.Current && ( this.Current.e.style.display = "flex" );
			this.Current && this.Current.OnShow && this.Current.OnShow();
		};
	}
);

//  //

UI.StateButton = function( com, labels, value, onclick )
{
	let e = q.button( com );
	e.onclick = function() { onclick( value ); };
	value.AddView( function( value )
	{
		q.text( e, labels[ value.Get() ] );
	});
};
