const log = console.log;

abstract class LeafBase < T >
{
	protected _value : T ;
	private _rel ? : Leaf.Update < T >;
	protected nextRefId : number = 1;
	protected refs = new Map < RefId, Leaf.Ref < T > > ();

	constructor( initv : T, args ? : Args < T > )
	{
		this._value = initv;
		this._rel = args?.rel;
	}

	protected _setvalue( newValue : T, sender ? : Ref )
	{
		if( newValue === this._value )  return;

		const oldValue = this._value;
		this._value = newValue;

		this._rel ?.( newValue, oldValue );
		this.refs.forEach( ref => ref != sender && ref.update( newValue, oldValue ) );
	}
}

type RefId = number;

interface Args < T >
{
	rel ? : Leaf.Update < T >;
}

export interface Ref
{
	release() : void ;
	readonly id : RefId ;
}

type iref = Ref;

export class Leaf< T > extends LeafBase< T >
{
	static make< T > ( lol : Leaf.LoL< T > ) : Leaf < T >
	{
		if( lol instanceof Leaf ) return lol;
		return new Leaf < T > ( lol );
	}

	static set< T > ( lol : Leaf.LoL < T > | undefined, newValue : T )
	{
		if( lol instanceof Leaf ) lol.value = newValue;
	}

	public createRef( update : Leaf.Update < T > )
	{
		const id = this.nextRefId ++;
		const ref = new Leaf.Ref < T > ( this, id, update );
		this.refs.set( id, ref );
		return ref;
	}

	public releaseRef( ref : Leaf.Ref < T > )
	{
		this.refs.delete( ref.id );
	}

	public get value() { return this._value; }
	public set value( newValue : T ) { this._setvalue( newValue ); }

	public set( value : T, sender ? : Leaf.Ref < T > ) { this._setvalue( value, sender ); }

}

export namespace Leaf
{
	//  //

	export class String extends Leaf < string > {}
	export class Number extends Leaf < number > {}
	export class Boolean extends Leaf < boolean > {}

	export type LoL < T > = Leaf < T > | T;
	export namespace LoL
	{
		export type String = LoL < string > ;
		export type Number = LoL < number > ;
		export type Boolean = LoL < boolean > ;
	}

	//  //

	export type Update < T > = ( newV : T, oldV ? : T ) => void;

	export class Ref < T > implements iref
	{
		protected refs = new Map < RefId, Ref < T > > ();
		
		constructor
		(
			private source : Leaf < T > | null,
			public readonly id : RefId,
			public readonly update : Update < T >
		)
		{
			if( this.source ) this.update( this.source?.value );
		}

		public release()
		{
			this.source ?.releaseRef( this );
			this.source = null;
		}
	}
}
