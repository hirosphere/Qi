
const CU = {};

CU.Main = class
{
	constructor( com, model )
	{
		const e = ecr( "div", com, { class: "Ctrl" } );
		{
			const con = ecr( "div", e, { class: "Div" } );
			new CU.Slide( con, model.Volume, { class: "-1", title: "Volume" } );
		}
		{
			const con = ecr( "div", e, { class: "Div" } );
			new CU.Env( e, model.Channels.Melody.AEnv );
			new CU.Tone( e, model.Channels.Melody.Tone );
		}
	}	
}

CU.Base = class
{
	constructor( com, model, args )
	{
		this.build( com );
	}

	build() {}
}

CU.Tone = class
{
	constructor( com, model )
	{
		const e = ecr( "div", com, { class: "Tone" } );
		new CU.Wave( e, model.Waves[ 0 ] );
		new CU.Wave( e, model.Waves[ 1 ] );
		new CU.Wave( e, model.Waves[ 2 ] );
		new CU.Wave( e, model.Waves[ 3 ] );
		new CU.Wave( e, model.Waves[ 4 ] );
	}
}

CU.Wave = class
{
	constructor( com, model )
	{
		const e = ecr( "div", com, { class: "Wave" } );
		new CU.Slide( e, model.Level,  { title: "Level", min: 0, max: 100 } );
		new CU.Slide( e, model.Att,  { title: "Att", min: 0, max: 100 } );
	}
}

CU.Env = class
{
	constructor( com, model )
	{
		const e = ecr( "div", com, { class: "Env" } );
		new CU.Slide( e, model.Attack,  { title: "A", min: 0, max: 100 } );
		new CU.Slide( e, model.Decay,   { title: "D", min: 0, max: 100 } );
		new CU.Slide( e, model.Sustain, { title: "S", min: 0, max: 100 } );
		new CU.Slide( e, model.Release, { title: "R", min: 0, max: 100 } );
	}
}

//  //

CU.Slide = class
{
	constructor( com, model, args )
	{
		args = args || {};
		this.model = model;
		const e = ecr( "span", com, { class: "Sl " + ( args.class ) } );
		ecr( "span", e, { class: "-title", text: args.title || "" } )
		this.label = ecr( "span", e, { class: "-value" } )
		this.inp = ecr( "input", e, { attr: { type: "range", min: args.min || 0, max: args.max != null ? args.max : 100 } } );

		this.inp.addEventListener( "input", ev => model.SetValue( this.inp.value ), false );
		model.AddOnChanged( value => this.update() );
		this.update();
	}

	update()
	{
		this.label.innerText = this.model.Value;
		this.inp.value = this.model.Value;
	}
}

CU.Input = class
{
	constructor( com, model, args )
	{
		args = args || {};
		this.model = model;
		const e = ecr( "span", com, { class: "Sl " + ( args.class ) } );
		ecr( "span", e, { class: "-title", text: args.title || "" } )
		this.label = ecr( "span", e, { class: "-value" } )
		this.inp = ecr( "input", e, { attr: { type: "range", min: args.min || 0, max: args.max != null ? args.max : 100 } } );

		this.inp.addEventListener( "input", ev => model.SetValue( this.inp.value ), false );
		model.AddOnChanged( value => this.update() );
		this.update();
	}

	update()
	{
		this.label.innerText = this.model.Value;
		this.inp.value = this.model.Value;
	}
}
