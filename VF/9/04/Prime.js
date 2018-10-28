
let 型を作成 = function( 典型装飾関数 )
{
	let 型 = function(){};

	典型装飾関数.call( 型.prototype );

	if( 型.prototype.開始する == undefined )
	{
		型.prototype.開始する = function(){};
	}

	型.作成 = function()
	{
		let 実体 = new 型();
		型.prototype.開始する.apply( 実体, arguments );
		return 実体;
	};

	return 型;
}

