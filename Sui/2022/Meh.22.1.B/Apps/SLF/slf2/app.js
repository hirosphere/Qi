const log = console.log;
import GUI from "./gui.js";
import Sound from "./sound.js";
import Meh from "../../../Meh/meh.js";
const { HTDOM } = Meh;

// GUI //

const AppPane = args =>
{
	return {
		type: "div", class: "App",
		text: "SLF-2 App",
		parts:[
			{ type: GUI.PropListItem, title: "周波数" },
			{ type: GUI.PropListItem, title: "波形" },
		],
	};
};


//  //

export default () =>
{
	log( "SLF2-App main" );

	HTDOM.create( { type: AppPane }, document.body );
};
