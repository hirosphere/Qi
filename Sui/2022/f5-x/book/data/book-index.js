
const api =
{
	title: "Book API",
	name: "book-api",
	parts:
	[
		{
			title: "Navi モジュール",
			name: "navi",
			parts:
			[
				{
					title: "Index クラス",
					name: "index",
					parts:
					[
						{ title: "title", name: "title" },
						{ title: "name", name: "name" },
						{ title: "path", name: "path" },
						{ title: "composition", name: "composition" },
						{ title: "parts", name: "parts" },
						{ title: "load_parts()", name: "load_parts()" },
					],
				},
				{
					title: "Tree クラス",
					name: "tree",
					parts:
					[
						{ title: "new_selection()", name: "new_selection()" },
						{ title: "create_index()", name: "create_index()" },
					],
				},
				{
					title: "Location クラス",
					name: "location",
					parts:
					[
						{ title: "load_url()", name: "load_url" },
						{ title: "get_link( index )", name: "get_link" },
						{ title: "url : Leaf<string>", name: "url" },
						{ title: "curr_page : Leaf<Index>", name: "curr_page" },
						{ title: "curr_head : Leaf<Index>", name: "curr_head" },
						{
							title: "内部メンバ",
							name: "inner",
							parts:
							[
								{ title: "tree : Tree", name: "tree" },
							]
						}
					],
				},
			],
		}
	]
};


export const index_src =
{
	title: "Vite DHTML", name: "top", type: "Top",
	parts:
	[
		{ title: "Nゲージ列車制御", name: "train", type: "Train", parts: [
			{ title: "動力の設定", name: "motor" },
			{ title: "走路の設定", name: "section" },
			{ title: "編成の管理", name: "group" },
		]},
		{ title: "Eval", name: "eval", type: "Eval", parts:
		[
			{ title: "シリアル", name: "serial" },
		] },
		{ title: "気象", name: "wether", type: "Wether" },
		{ title: "UIスケッチ", name: "sketch", type: "UI-Sketch", parts:
		[
			{ title: "HSL", name: "hsl" },
		] },
		api,
		{ title: "HeartRails 路線と駅", name: "HeartRails", type: "Eki" },
	]
};

