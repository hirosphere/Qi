//  //

import { Leaf } from "../../base/model.js";


//  //

export class EG
{
	attack = new Leaf( 100 );
	decay = new Leaf( 50 );
	sustain = new Leaf( 70 );
	release = new Leaf( 50 );
};


//  //

export class Synth
{
	eg1 = new EG(  );
	eg2 = new EG(  );
}


//  //

export default { Synth };

