
let MapPane = class_def
(
	null,
	function()
	{
		this.Initiate = function( com, className )
		{
			let center = { "lat": 36, "lng": 138 };
			let e = this.e = q.horiz( com, { "class": className } );
			let mapdiv = q.div( this.e );
			this.gmap = new google.maps.Map
			(
				mapdiv, { "center": center, "zoom": 7, "scaleControl": true,
					styleOptions:
					[
						{ featureType: "all", stylers: { saturation: 0 } }
					]
				}
			);

			window.addEventListener( "resize", update );

			function update()
			{
				mapdiv.style.width = e.clientWidth + "px"
				mapdiv.style.height = e.clientHeight + "px"
				//console.log( e.clientWidth, e.clientHeight );
				let s = getComputedStyle( mapdiv );
				console.log( s.width, s.height );
			}

			//mapdiv.style.width = 400 + "px"
			//mapdiv.style.height = 400 + "px"
			setTimeout( update, 10 );
		};
	}
);
