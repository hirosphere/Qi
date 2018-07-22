
let MapPane = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, className )
		{
			let center = { "lat": 36, "lng": 138 };
			this.e = q.vert( com, { "class": className } );
			this.eInfo = q.div( this.e, { style: { height: "1.6em" }, text: "Info" } );
			this.eMap = q.div( this.e );
			this.Gmap = new google.maps.Map
			(
				this.eMap,
				{
					center: center, zoom: 9, "scaleControl": true,
					styleOptions:
					[
						{ featureType: "all", stylers: { saturation: 0 } }
					],
					mapTypeId: google.maps.MapTypeId.TERRAIN
				}
			);

			let self = this;
			function updateSize() { self.UpdateSize(); };
			this.Gmap.addListener( "drag", function() { self.UpdateInfo(); } );

			window.addEventListener( "resize", updateSize );
		};

		//  //

		this.SetCenter = function( site )
		{
		};

		this.UpdateSize = function()
		{
			this.eMap.style.width = this.e.clientWidth + "px"
			this.eMap.style.height = this.e.clientHeight + "px"
		};

		this.UpdateInfo = function()
		{
		};

		function f( v, d ) { d = d || 100; return Math.round( v * d ) / d; }
	}
);

let MapList = class_def
(
	null,
	function()
	{
		this.Initiate = function( map, indexSel )
		{
			this.Map = map;
			this.Selector = indexSel;
			this.Index = null;
			this.Current = null;
			this.Items = {};

			const self = this;
		};

		this.SetWaveList = async function( index )
		{
		};

		this.SetCurrent = function( index )
		{
			this.SetWaveList( index.Com );
			if( index == this.Current )  return;
			this.UpdateItem( this.Current );
			this.Current = index;
			this.UpdateItem( this.Current );
		};

		this.UpdateItem = function( index )
		{
		};

		this.UpdateItems = function()
		{
			for( let fn in this.Items ) this.Items[ fn ].Update();
		};
	}
);

MapList.Item = class_def
(
	null,
	function()
	{
		this.Initiate = function( index, selector )
		{
			this.Index = index;
			this.Selector = selector;
			this.Update();
		};

		this.Update = function()
		{
		};

		this.Terminate = function()
		{
		};
	}
);
