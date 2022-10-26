const log = console.log;
import Meh from "../../../Meh/meh.js";
const { HTDOM, Leaf, Sound } = Meh;

// Model * SUI //

const Model = {};

Model.Main = class
{
	static ctrls =
	{
		pitch: Leaf.Number,
	};
};

// GUI //

const GUI = {};

GUI.App = args =>
{
	;
};


//  //

export default ce =>
{
	log( "SLF2-App main" );
};
