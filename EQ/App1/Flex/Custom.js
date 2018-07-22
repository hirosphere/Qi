
let Cu = {};

Cu.Index = new function()
{
	this.Cap = function( index ) { return index ? GetType( index ).Std( index ) : "null"; };
	this.Path = function( index ) { return index ? GetType( index ).Path( index ) : "null"; };
	this.Peer = function( index ) { return index ? GetType( index ).Peer( index ) : "null"; };

	function GetType( index ) { return index && Types[ index.Type ] || Types.Default; }

	let Types =
	{
		Root:
		{
			Std: function( index ) { return "Root"; },
			Path: function( index ) { return "Root"; }
		},

		Year:
		{
			Std: function( index ) { return `${ index.Spec }年`; },
			Path: function( index ) { return `${ index.Spec }年`; }
		},

		EQ:
		{
			Std: function( index )
			{
				let mt = EQMatch( index );
				return mt ? `${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分` : index.Spec;
				return mt ? `${mt[2]}/${mt[3]} ${mt[4]}:${mt[5]}` : index.Spec;
			},
			Path: function( index )
			{
				let mt = EQMatch( index );
				return `${mt[2]}月${mt[3]}日 ${mt[4]}時${mt[5]}分`;
			}
		},

		Wave:
		{
			Std: function( index )
			{
				let s = index.Site || {};
				let kik = index.IsKiK ? ( index.IsUnder ? " (地中)" : " (地表)" ) : "";
				return `${ s.Code } ${ s.Name }${ kik }`;
			},
			Path: function( index )
			{
				let s = index.Site || {};
				let kik = index.IsKiK ? ( index.IsUnder ? " (地中)" : " (地表)" ) : "";
				return `${ s.Code } ${ s.Name } ${ s.Namer }${ kik }`;
			},
			Peer: function( index )
			{
				let kik = index.IsKiK ? ( index.IsUnder ? " (地中)" : " (地表)" ) : "";
				return `${ index.Site.Name }${ kik }`;
			}
		},

		Default: new function()
		{
			this.Std = this.Path = this.Peer =
			 function( index ) { return index.Spec; };
		},
	};

	function EQMatch( index )
	{
		let mt = index.Spec.match( /^(\d{4})\/(\d{2})\/(\d{2})\+(\d{2}):(\d{2})(:(\d{2}))?(.*)/ );
		if( mt ) mt[ 2 ] = mt[ 2 ].replace( /^0/, "" );
		if( mt ) mt[ 3 ] = mt[ 3 ].replace( /^0/, "" );
		if( mt ) mt[ 4 ] = mt[ 4 ].replace( /^0/, "" );
		return mt;
	}

};

Cu.Page = {};

Cu.Page.Wave =
{
	MapBt: [ "リスト", "マップ" ]
};

Cu.Tweet = function( index )
{
	return `${ Cu.Index.Cap( index ) } - #震These - 地震波形を「音」で聴くブラウザ画面アプリ。\n\n`;
};

