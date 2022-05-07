
const api =
{
	title: "Book API",
	name: "book-api",
	parts:
	[
		{
			title: "Navi",
			name: "navi",
			parts:
			[
				{
					title: "Index",
					name: "index",
					parts:
					[
						{
							title: "値",
							name: "value"
						},
						{
							title: "構造",
							name: "struct"
						}
					],
				},
				{
					title: "Tree",
					name: "tree",
					parts:
					[
						{
							title: "値",
							name: "value"
						},
						{
							title: "構造",
							name: "struct"
						}
					],
				},
				{
					title: "IndexView",
					name: "index-view",
					parts:
					[
						{ title: "selected : Leaf", name: "selected" },
						{ title: "index", name: "" },
					],
				},
				{
					title: "Selection",
					name: "selection",
					parts:
					[
						{ title: "load_url()", name: "load_url" },
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
	title: "Top", name: "top", type: "Top",
	parts:
	[
		{ title: "運転", name: "train", type: "Train", parts: [
			{ title: "動力の設定", name: "motor" },
			{ title: "走路の設定", name: "section" },
			{ title: "編成の管理", name: "group" },
		]},
		{ title: "Eval", name: "eval", type: "Eval" },
		{ title: "気象", name: "wether", type: "Wether" },
		{ title: "UIスケッチ", name: "sketch", type: "UI-Sketch" },
		api,
		{ title: "Dyndex", name: "dyndex", type: "Dyndex" },
		{ title: "路線", name: "rail", type: "Eki" },
	]
};

