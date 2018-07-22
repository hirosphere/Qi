let Hash = new function()
{
	this.Load = async function( doc )
	{
		let args = location.hash.toString().replace( /^#/, "" ).split( "&" );
		let specs = {};
		for( var arg of args )
		{
			let kv = arg.split( "=" );
			specs[ kv[ 0 ] ] = kv[ 1 ];
		}

		let root = doc.RootIndex;
		var index = root;

		if( specs.EQ && specs.Wave )
		{
			let values = EQFS.GetEQSpecValues( specs.EQ );
			index = values && await root.GetMicro( [ values.Y, specs.EQ, specs.Wave ] ) || root;
		}

		else if( specs.EQ )
		{
			let values = EQFS.GetEQSpecValues( specs.EQ );
			index = values && await root.GetMicro( [ values.Y, specs.EQ ] ) || root;
		}

		else if( specs.Year )
		{
			index = await root.GetMicro( [ specs.Year ] );
		}

		doc.CurrentIndex.Set( index );
	};

	this.Save = function( doc )
	{
		let index = doc.CurrentIndex.Get();
		let makeHash = ( index && MakeHash[ index.Type ] ) || MakeHash.Default;
		location.hash = makeHash( doc, index );
	};

	let MakeHash =
	{
		Root: function( doc, index ) { return ""; },
		Year: function( doc, index ) { return `#Year=${ index.Spec }`; },
		EQ: function( doc, index ) { return `EQ=${ index.Spec }` },
		Wave: function( doc, index ) { return `#EQ=${ index.EQSpec }&Wave=${ index.Spec }` },
		Default: function() { return "" },
	};
};
