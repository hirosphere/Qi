import { Leaf } from "../../../../base/model.js";
import { Tree } from "../../navi-index.js";

//  //

const Tab = args =>
{
	const { text } = args;
	const label = { type: "span", class: "label", text };
	return { type: "li", parts: [ label ] };
};


//  //

const Tabs = args =>
{
	const { listSrc, key = new Leaf( 0 ) } = args;
	
	const parts = { model: listSrc, def: item => ( { type: Tab, text: item } ) };

	return { type: "ul", class: "Tabs", parts, switchKey: key };
};


//  //

const ArraySwitch = args =>
{
	const switchKey = new Leaf( 0 );

	const parts = [];

	return { type: "div", parts, switchKey };
};

//  //

const tabListSrc =
[
	{ name: "chuo",     title: "中央線" },
	{ name: "sobu",     title: "総武線" },
	{ name: "yamanote", title: "山手線" },
	{ name: "keihin",   title: "京浜東北線" },
	{ name: "joban",    title: "常磐線" },
];

const listSrc = [ "中央線", "総武線", "山手線", "京浜東北線", "常磐線" ];

const Main = args =>
{
	const { index } = args;
	const tree = new Tree( { listSrc } );

	//  //

	const h1 = { type: "h1", text: index.title };
	const tabs1 = { type: Tabs, listSrc };
	const content = { type: "div", class: "page-content", parts: [ tabs1 ] };

	return { type: "div", class: "page", parts: [ h1, content ] };
};


//  //

export default Main;
