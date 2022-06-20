import { Leaf } from "../../../../base/model.js";
import { create } from "../../../../base/ht-dom.js";


//  //

const Unit = ( args, self, dec ) =>
{
	dec.init = () =>
	{
		self.es.input.setAttribute( "value", "Yyyy Yyy" );
	};

	const keydown = ev =>
	{
		if( ev.ctrlKey && ev.key == "Enter" )
		{
			execute();
			ev.preventDefault();
		}
	};

	const execute = () =>
	{
		const es = self.es;
		const code = es.code.value;
		const output = es.output;
		const input = es.input.value;
		const display = es.display;

		try { output.value = eval( code ); }
		catch( exc ) { output.value = exc; }
	};

	const eval_button = { type: "button", text: "Eval", events: { click: ev => execute() } };
	const bar = { type: "div", class: "bar", parts: [ eval_button ] };

	const sample = `const r = [];
for( let i = 0; i <= 12; i ++ )
{
	r[ i ] = Math.pow( 2, i / 12 ) * 440;
}
r.join( "\\n" );
`;

	const parts =
	[
		bar,
		{ type: "textarea", name: "code", props: { value: sample }, events: { keydown } },
		{ type: "textarea", name: "output" },
		{ type: "textarea", name: "input", props: { value: "\t" } },
		{ type: "div", class: "display", name: "display", },
	];

	return { type: "div", class: "Unit", parts };
};


//  //

const post = async( path, args, failv ) =>
{
	try
	{
		const res = await fetch( path, { method: "post", headers: { "Content-Type": "application/json" }, body: JSON.stringify( args ) } );
		return res.ok ? await res.json() : failv;
	}
	catch( err )
	{
		return failv || err;
	}
}


//  //

export const Eval = args =>
{
	const { index } = args;

	const parts =
	[
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
		{ type: Unit },
	];

	return { type: "div", class: "Eval", parts };
};

