import { RU } from "./RU.js";
import { Leaf } from "./Leaf.js";
const log = console.log;

export class Selector < V extends RU >
{
	public readonly current;

	protected readonly refs = new Map < symbol, Ref < V > >;

	constructor()
	{
		const rel = ( newV : V | null, oldV ? : V | null ) => this.update( newV, oldV );

		this.current = new Leaf < V | null > ( null, { rel } );
	}

	makeRef( value : V )
	{
		if( ! this.refs.has( value.__ru ) )
		{
			this.refs.set( value.__ru, new Ref( this, value ) );
		}
		return this.refs.get( value.__ru );
	}

	protected update( newV : V | null, oldV ? : V | null )
	{
		oldV  &&  this.makeRef( oldV ) ?.selected.set( false );
		newV  &&  this.makeRef( newV ) ?.selected.set( true );
	}
}

class Ref < V extends RU >
{
	public readonly selected = new Leaf.Boolean( false );

	constructor
	(
		protected readonly selector : Selector < V >,
		public readonly value : V
	)
	{}

	select()
	{
		log( this.value );
		this.selector.current.value = this.value;
	}
}

