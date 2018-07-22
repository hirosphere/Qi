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
			return page;
		};

		this.Select = function( name, index )
		{
			let page = this.Pages[ name ];
			if( page == this.Current )
			{
				//this.Current.SetIndex && this.Current.SetIndex( index );
				SetIndex( page, index );
				return;
			}

			if( this.Current )
			{
				this.Current.e.style.display = "none";
				this.Current.OnHide && this.Current.OnHide();
			}

			this.Current = page;

			if( this.Current )
			{
				this.Current.e.style.display = "flex";
				this.Current.OnShow && this.Current.OnShow();
				//this.Current.SetIndex && this.Current.SetIndex( index );
				SetIndex( page, index );
			}
		};

		function SetIndex( page, index )
		{
			if( ! ( page && page.OnIndexChange && page.Index != index ) )  return;
			page.Index = index;
			page.OnIndexChange( index );
		}
	}
);

