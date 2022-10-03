const log = console.log;

import { Selector, GUI } from "../../../Meh/meh.js";
import HSL from "./hsl.js";

const RailAppletA = args =>
{
	const listSrc =
	{
		"chuo": { title: "中央線" },
		"sobu": { title: "総武線" },
		"yamanote": { title: "山手線" },
		"keihin-tohoku": { title: "京浜東北線" },
		"joban-rapid": { title: "常磐線快速", selected: true },
	};

	const selector = new Selector( { parts: listSrc } );
	log( selector.current );

	return {
		typr: "div", class: "Applet",
		text: "RailAppletA",
		parts:[
			{ type: GUI.List, class: "Tabs", index: selector.root },
			{ type: "div",
				partSw: selector.current,
				parts:{
					model: selector.root.parts,
					part( index ) { return { type: Content, index }; },
				},
			},
		]
	};
};

const Content = args =>
{
	const { index } = args;
	const model = new HSL.Model.HSL( { hue: 0, sat: 80, light: 96 } );

	return {
		type: "div", class: "Applet",
		parts:[
			{ type: HSL.UI.RailAppletA, model, },
			{ type: "h2", text: index.title },
		]
	};
};

export { RailAppletA };

