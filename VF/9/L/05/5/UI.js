
const UI = {};

UI.モニター型 = 型を作成
(
	function()
	{
		const 典型 = this;

		典型.初期化 = function( 包枝, ドキュメント )
		{
			const これ = this;
			これ.ドキュメント = ドキュメント;

			const e = Divを作成( なし, { クラス: "Monitor", 文: "モニター" } );
			{
				const horiz = Divを作成( e );
				これ.JSON = Textareaを作成( horiz, { クラス: "JSON" } )
			}

			包枝.支枝を追加( e );
		};

		典型.更新 = function()
		{
			const これ = this;
			const v = これ.ドキュメント.保存値を取得();
			const j = JSON.stringify( v );
			const h = URLハッシュ.変換( v );
			これ.JSON.value = `Hash   ${ h.length }文字\n${ h }\n\nJSON   ${ j.length }文字\n${ j }`;
		};
	}
);

