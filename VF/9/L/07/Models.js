
const モデル群 = new function()
{
	const この実体 = this;

	この実体.型を作成 = ( 名称, 定義 ) =>
	{
		const 型 = function()
		{
			const この実体 = this;

			この実体.値を設定 = () =>
			{
				;
			};
		};

		return この実体;
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

モデル群.型を作成
(
	"EG",
	{
		基底型: "Array",
		省略値: [ "adsr", "cdd", 0, 0, 100, 0 ],
		メソッド:
		{
			ToneJS値を取得: function()
			{
				const 値 = this.値を取得();
				return "hsl(" + 値[ 0 ] + "," + 値[ 1 ] + "%," + 値[ 2 ] + "%)";
			}
		}
	}
);

モデル群.型を作成
(
	"G1",
	{
		省略値: { Color: [ 90, 45, 45 ], Area: [ 10, 10, 300, 300 ] },
		要素定義: { Title: [ "String" ], Color: "HSL", Area: "Area" }
	}
);

モデル群.型を作成
(
	"SVG1",
	{
		省略値: {},
		要素定義:
		{
			Title: [ "String" ],
			Size: [ "Size" ],
			Content: [ "SVGItem" ]
		}
	}
);

モデル群.型を作成
(
	"SVG_Node",
	{
		省略値: {},
		要素定義:
		{
			Type: "String",
			Attrs: "Object",
			PartNodes: "Array"
		}
	}
);

