
let Value = class_def
(
	null,
	function()
	{
		this.Initiate = function( initValue, onUpdate )
		{
			this.Value = initValue;
			this.Views = [];
			onUpdate && this.AddView( onUpdate );
		};

		this.AddView = function( onUpdate, mute )
		{
			this.Views.push( onUpdate );
			! mute && onUpdate( this );
		};

		this.Set = this.SetValue = function( value )
		{
			if( value == this.Value )  return;
			let oldValue = this.Value;
			this.Value = value;
			for( var fnc of this.Views )  fnc( value, oldValue );
		};

		this.Get = this.GetValue = function()
		{
			return this.Value;
		};
	}
);
