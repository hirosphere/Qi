
let ドキュメント = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function()
		{
			let この実体 = this;
		};
	}
);

let 列車の型 = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function()
		{
			let この実体 = this;

			この実体.時速 = 値の型.作成( 0 );
			この実体.加速度 = 値の型.作成( 0 );
		};
	}
);

let 動力の型 = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function()
		{
			let この実体 = this;
		};
	}
);

let 動力駆動の型 = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function()
		{
			let この実体 = this;
		};
	}
);

let 値の型 = 型を作成
(
	function()
	{
		let この型 = this;

		この型.開始する = function( 初期値 )
		{
			let この実体 = this;
			この実体.変更処理リスト = [];
		};

		この型.変更 = function( 処理 )
		{
			let この実体 = this;
			この実体.変更処理リスト.先頭に追加( 処理 );
		};

		この型.値を設定 = function( 値 )
		{
			let この実体 = this;
		};

		この型.値の変更を通知する = function()
		{
			let この実体 = this;
		};
	}
);
