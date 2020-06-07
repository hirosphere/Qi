
const G = {};

// 設定情報 //

G.Props = function( def, base )
{
	const c = {};
	def = def ||
	{
		BC: [ 230, 65, 75 ]
	};

	this.GetHSL = ( name ) =>
	{
		const p = this.Get( name );
		if( p && p.constructor == Array )
		{
			return `hsl( ${ p[0] }, ${ p[1] }%, ${ p[2] }% )`;
		}
		return "hsl( 0, 0%, 0% )";
	};

	this.Get = ( name ) =>
	{
		return name in c ? c[ name ] : name in def ? def[ name ] : base && base.Get( name );
	};
};


// レイアウト枠 //

G.Frame = function( com, canvas, props )
{
	console.log( "G.Frame" );
	
	this.Layers = [];
	const my = { canvas: canvas };
	props = props || new G.Props();
	const context = canvas.getContext( "2d" );

	this.Update = ( w, h ) =>
	{
		;
	};

	this.Draw = () =>
	{
		if( ! com )
		{
			context.fillStyle = props.GetHSL( "BC" );
			context.fillRect( 0, 0, canvas.width, canvas.height );
		}
		;
	};
};


// レイヤー //

G.Layer = function()
{
	this.Draw = ( canvas ) =>
	{
		;
	};
};

G.WaveLayer = function( args )
{
	;
};

// 描画 //

G.StrokeWave = (  ) =>
{
	;
};
