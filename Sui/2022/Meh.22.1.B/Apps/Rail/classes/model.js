const log = console.log;
const lg = console.log;
const l = console.log;

import { Leaf, Branch } from "../../../Meh/meh.js";
log( "Rail.model" );

//  //

class Motion extends Branch { step( timeMS ) {} }

class Train extends Motion
{
	// params //

	act = new Leaf.Number();
	speed = new Leaf.Number();
	dir = new Leaf.Number();

	motor = new Motor();

	// rels //

	voltage = new Leaf.Number();
}

class Motor extends Motion
{
	// params //

	max = new Leaf.Number();
	bias = new Leaf.Number();
	idle = new Leaf.Number();
}

//  //

export { Train }
export default { Train }
