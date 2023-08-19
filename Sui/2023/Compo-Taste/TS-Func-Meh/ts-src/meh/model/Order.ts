import { RU } from "./RU.js";


export class Order < T extends RU >
{
	protected _items = new Array < T > ;
	protected orders = new Map < symbol, number > ;
	protected refs = new Map < symbol, Ref < T > > ;

	//  //

	get items() { return this._items; }

	add( item : RU )
	{
		if( ! this.orders.has( item.__ru ) )
		{
			const order = this._items.length;
			this.orders.set( item.__ru, order );
		}
	}

	remove() {}

	//  //

	getOrder( item : T )
	{
		return this.orders.get( item.__ru );
	}
}

class Ref < T extends RU > extends RU
{
	update() {}
}

interface Notify
{
	add : number[] ;
}
