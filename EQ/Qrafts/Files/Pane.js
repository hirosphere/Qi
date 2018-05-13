let Pane = class_def
(
	null,
	function()
	{
		this.Width = 0;
		this.Height = 0;
		this.Rel = 0;
		this.Enable = true;

		let layfns = [ "Width", "Height", "Rel", "Enable" ];
	
		this.Initiate = function( com, args, edef )
		{
			this.Args = args || {};
			if( args ) for( var fn of layfns )
				if( args[ fn ] !== undefined ) this[ fn ] = args[ fn ];  

			this.Com = com;
			this.PartNodes = [];
			this.concretearea = { left: 0, top: 0, width: 0, height: 0 };
			
			if( edef ) this.e = q.e( edef.type, null, edef );
			else this.Build();

			com && com.Add( this );
		};

		this.Build = function() { this.e = q.div( null, { text: this.Args.Text } ); };

		//  layout  //

		this.Add = function( part )
		{
			this.PartNodes.push( part );
			part.e.style.position = "absolute";
			this.e.appendChild( part.e );
		};

		this.SetArea = function( left, top, width, height )
		{
			let c = this.concretearea = { left: left, top: top, width: width, height: height };
			this.UpdateArea();
			this.UpdateLayout();
		};

		this.UpdateArea = function()
		{
			let e = this.e;
			let s = e.style;
			let c = this.concretearea;
			s.top = c.top + "px";
			s.left = c.left + "px";
			s.width = c.width + "px";
			s.height = c.height + "px";

			if( e.offsetWidth > c.width )  s.width = ( c.width - ( e.offsetWidth - c.width ) ) + "px";
			if( e.offsetHeight > c.height )  s.height = ( c.height - ( e.offsetHeight - c.height ) ) + "px";
		};

		this.UpdateEnable = function()
		{
			this.e.style.display = this.Enable ? "block" : "none";
		}

		this.UpdateLayout = function() { this.Layout(); }
		this.Layout = function(){};
	}
);

let RootPane = class_def
(
	Pane,
	function( base )
	{
		this.Initiate = function()
		{
			base.Initiate.call( this, null );
			
			let self = this;
			window.addEventListener( "resize", function() { self.UpdateLayout(); } );
		};

		this.Build = function()
		{
			this.e = document.body;
		};

		this.Layout = function()
		{
			let part = this.PartNodes[ 0 ];
			if( part && this.e )
			{
				part.SetArea( 0, 0, this.e.clientWidth, this.e.clientHeight );
			}
		};
	}
);

let Layout = new function()
{
	this.Vert = function() { Bridge.call( this ); };

	function Bridge()
	{
		let e = this.e;
		var totalspan = 0;
		var totalrel = 0;
		for( var part of this.PartNodes )
		{
			if( ! part.Enable )  continue;

			totalspan += part.Height;
			totalrel += part.Rel;
		}
		let rem = e.clientHeight - totalspan;
	
		var pos = 0;
		for( var part of this.PartNodes )
		{
			part.UpdateEnable();
			if( ! part.Enable )  continue;

			let rel = ( totalrel ? rem * part.Rel / totalrel : 0 );
			let span = part.Height + rel;
			part.SetArea
			(
				0,
				pos,
				part.Width >= 0 ? part.Width : e.clientWidth,
				span
			);
			pos += span;
		}
	}

	let br_v =
	{
		get_span: function( pane ) { return pane.Height; },
		set_area: function( part, left, top, span, prop ) { part.SetArea( left, top, prop, span ); }
	};
};

Layout.v = new function()
{
}

Layout.Horiz = function()
{
	let e = this.e;
	var totalspan = 0;
	var totalrel = 0;
	for( var part of this.PartNodes )
	{
		if( ! part.Enable )  continue;
		totalspan += part.Width;
		totalrel += part.Rel;
	}
	let rem = e.clientWidth - totalspan;

	var pos = 0;
	for( var part of this.PartNodes )
	{
		part.UpdateEnable();
		if( ! part.Enable )  continue;
		let span = part.Width + ( rem * part.Rel / totalrel );
		part.SetArea
		(
			pos,
			0,
			span,
			part.Height >= 0 ? part.Height : e.clientHeight
		);
		pos += span;
	}
};

