
import { Tree, Node } from "./model.js";

//  //

class Index extends Node
{
	constructor( args, work )
	{
		super( args, work );
	}
}

//  //

class Selector extends Tree
{
	constructor( args )
	{
		super( args );
	}
}

//  //

export { Selector };
export default { Selector };
