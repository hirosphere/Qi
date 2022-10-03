
import Model from "./model.js";
import HTDOM from "./ht-dom.js";
import GUI from "./gui.js";
import Navi from "./navi.js";
import Sound from "./sound.js";

const { Leaf, Branch, Tree, Node } = Model;
const { Selector, Index } = Navi;
const DOM = HTDOM;
const { create } = DOM;
const { Range } = GUI;

//  //

const log = console.log;

export
{
	Model, Leaf, Branch, Tree, Node,
	Navi, Selector, Index,
	HTDOM, DOM, create,
	GUI, Range,
	log
}

export default
{
	Model, Leaf, Branch, Tree, Node,
	Navi, Selector, Index,
	HTDOM, DOM, create,
	GUI, Range,
	Sound,
	log
}
