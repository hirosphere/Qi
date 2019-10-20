
const モデル群 = new function()
{
	const この実体 = this;

	この実体.型を作成 = ( 名称, 定義 ) =>
	{
		;
	};
	
};

モデル群.型を作成
(
	"HSL",
	{
		省略値: [ 0, 0, 100 ],
		メソッド:
		{
			HTML属性値を取得: function()
			{
				const 値 = this.値を取得();
				return "hsl(" + 値[ 0 ] + "," + 値[ 1 ] + "%," + 値[ 2 ] + "%)";
			}
		}
	}
);
