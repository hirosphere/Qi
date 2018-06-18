
let MapPane = class_def
(
	Pane,
	function()
	{
		this.Build = function( args )
		{
			let center = { "lat": 36, "lng": 138 };
			this.e = q.div( null, {} );
			this.e.style.background = "#def";
			this.gmap = new google.maps.Map
			(
				this.e, { "center": center, "zoom": 7, "scaleControl": true }
			);
		
		};
	}
);

