import { Selector, GUI } from "../../../Meh/meh.js";

const RailAppletA = args =>
{
	const listSrc =
	{
		"chuo": { title: "中央線", selected: true },
		"sobu": { title: "総武線" },
		"yamanote": { title: "山手線" },
		"keihin-tohoku": { title: "京浜東北線" },
		"joban-rapid": { title: "常磐線快速" },
	};

	const selector = new Selector( { parts: listSrc } );

	return {
		typr: "div", class: "Applet",
		text: "RailAppletA",
		parts:[
			{ type: GUI.List, index: selector.root },
		]
	};
};

export { RailAppletA };

