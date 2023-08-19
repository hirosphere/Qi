import { DOM, ef, EA, Leaf } from "./meh/index.js";
import { Range } from "./range.js";
import * as VF from "./apps/VF/index.js";
import { Rail } from "./apps/rail-1.js";
import * as Map from "./apps/EQ/Map.js";

const log = console.log;



( e : HTMLAnchorElement ) =>
{
	e.setAttribute( "href", "" );
}


//  //

const App = () =>
{
	const ac = new AudioContext();

	document.addEventListener( "keydown", () => ac.resume() )
	document.addEventListener( "mousedown", () => ac.resume() )

	const applets =
	[
		Map.APP.UI(),
		VF.Wind.UI( ac ),
		Rail.UI( new Rail.UIM( new Rail.Value( "A線" ) ) ),
		Rail.UI( new Rail.UIM( new Rail.Value( "B線" ) ) ),
		Rail.UI( new Rail.UIM( new Rail.Value( "C線" ) ) ),
		Rail.UI( new Rail.UIM( new Rail.Value( "D線" ) ) ),
	];
	const cc = { type: "div", class: "applets", parts: applets };

	return ef.div( { class: "app", parts: [ cc ] } );
};


//

DOM.create( App(), "body" );
