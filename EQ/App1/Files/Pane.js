let Pane = class_def
(
	null,
	function()
	{
		this.Type = "Pane";
		let defvals = { Left: 0, Top: 0, Width: 0, Height: 0, Rel: 0, Layout: null, Enable: true };

		this.Initiate = function( com, args, x1, x2, x3 )
		{
			this.PartNodes = [];
			this.ConcreteArea = { left: 0, top: 0, width: 0, height: 0 };
			
			for( var name in defvals )
			{
				let arg = args && args[ name ];
				this[ name ] = ( arg !== undefined ? arg : defvals[ name ] );
			}

			this.Build( args, x1, x2, x3 );
			com && com.Add( this );
		};

		this.Build = function( args )
		{
			if( args && args.edef ) this.e = q.e( null, null, args && args.edef );
		};

		this.Add = function( part )
		{
			this.PartNodes.push( part );
			if( this.e && part.e )
			{
				part.e.style.display = "block";
				part.e.style.position = "absolute";
				this.e.appendChild( part.e );
			}
		};

		this.SetArea = function( left, top, width, height )
		{
			this.ConcreteArea = { Left: left, Top: top, Width: width, Height: height };
			this.UpdateLayout();
		};

		this.UpdateLayout = function()
		{
			if( this.e )
			{
				this.e.style.display = ( this.Enable ? "block" : "none" );

				let c = this.ConcreteArea;
				let st = this.e.style;

				this.Test && console.log( Math.floor( c.Top ), Math.floor( c.Height ) );

				st.left = c.Left + "px";
				st.top = c.Top + "px";
				st.width = c.Width + "px";
				st.height = c.Height + "px";

				let over_w = this.e.offsetWidth - c.Width;
				let over_h = this.e.offsetHeight - c.Height;

				if( over_w )  st.width = c.Width - ( over_w ) + "px";
				if( over_h )  st.height = c.Height - ( over_h ) + "px";
			}

			this.Layout && this.Layout.Action( this );
		};
	}
);

let DivPane = class_def
(
	Pane,
	function()
	{
		this.Type = "DivPane";
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": args.Class || "" } );
		};
	}
);

let HorizPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": args.Class || "" } );
			this.e.style.zIndex = 1;
			this.Layout = new Layout.Horiz( { Sep: args.Sep } );
		};
	}
);

let VertPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			this.e = q.div( null, { "class": args.Class || "" } );
			this.e.style.zIndex = 1;
			this.Layout = new Layout.Vert( { Sep: args.Sep } );
		};
	}
);

let RootPane = class_def
(
	Pane,
	function()
	{
		this.Type = "RootPane";
		this.Build = function( part )
		{
			//console.log( "RootPane", this.Enable, this.Width, this.Height );
			let html = document.documentElement;
			let body = document.body;
			
			this.e = body;
			
			let self = this;
			window.addEventListener( "resize", function() { self.UpdateLayout(); } );

		};

		this.UpdateLayout = function()
		{
			if( this.PartNodes.length < 1 ) return;
			this.PartNodes[ 0 ].SetArea( 0, 0, this.e.clientWidth, this.e.clientHeight );
		};
	}
);

let Layout = new function()
{
	this.Default = class_def
	(
		null,
		function()
		{
			this.Action = function( pane )
			{
				for( var part of pane.PartNodes )
				{
					part.SetArea( part.Left, part.Top, part.Width, part.Height );
				}
			};
		}
	);

	let Bridge = class_def
	(
		null,
		function()
		{
			this.Sep = 0;

			this.Initiate = function( args )
			{
				this.Sep = args && args.Sep || this.Sep;
			};

			this.Action = function( pane )
			{
				var x_fix_total = this.get_total_sep( pane );
				var x_rel_total = 0;
				for( var part of pane.PartNodes )
				{
					if( part.Enable == false )  continue;
					x_fix_total += this.get_x_fix( part );
					x_rel_total += part.Rel;
				}

				let x_rem = Math.max( this.get_x_cont( pane ) - x_fix_total, 0 );
				let y_cont = this.get_y_cont( pane );
				//pane.Test && console.log( "x_rem, y_cont", x_rem, y_cont );
				var x_pos = 0;
				for( var part of pane.PartNodes )
				{
					if( part.Enable == false )
					{
						part.UpdateLayout();
						continue;
					}

					let y_pos = 0;

					let x_fix = this.get_x_fix( part );
					let x_rel = x_rem * ( part.Rel / x_rel_total ) || 0;
					let x_span = x_fix + x_rel;
					
					let y_fix = this.get_y_fix( part );
					let y_span = ( y_fix < 0 ? y_cont : y_fix );

					//pane.Test && console.log( Math.floor( x_pos ), Math.floor( x_span ), part.Rel );
					this.set_area( part, x_pos, y_pos, x_span, y_span );
					x_pos += x_span + this.Sep;
				}
			};

			this.get_total_sep = function( pane )
			{
				let len = pane.PartNodes.length;
				return len > 1 ? this.Sep * ( len - 1 ) : 0;
			};
		}
	);

	this.Horiz = class_def
	(
		Bridge,
		function()
		{
			this.get_x_cont = function( pane ) { return pane.e.clientWidth; };
			this.get_y_cont = function( pane ) { return pane.e.clientHeight; };
			this.get_x_fix = function( part ) { return part.Width };
			this.get_y_fix = function( part ) { return part.Height };
			this.set_area = function( part, xpos, ypos, xspan, yspan ) { part.SetArea( xpos, ypos, xspan, yspan ); };
		}
	);

	this.Vert = class_def
	(
		Bridge,
		function()
		{
			this.get_x_cont = function( pane ) { return pane.e.clientHeight; };
			this.get_y_cont = function( pane ) { return pane.e.clientWidth; };
			this.get_x_fix = function( part ) { return part.Height };
			this.get_y_fix = function( part ) { return part.Width };
			this.set_area = function( part, xpos, ypos, xspan, yspan ) { part.SetArea( ypos, xpos, yspan, xspan ); };
		}
	);
};
