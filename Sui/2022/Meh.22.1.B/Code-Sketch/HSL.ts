class Branch
{
	static regist( cc : Function ) { cc(); }
}

//

class HSL extends Branch
{
	sat : number
	hue : number
	light : number

	css : string
	cssRGB : string

	static rels =
	{
		css: ( { hue, sat, light } ) => `hsl( ${ hue }, ${ sat }%, ${ light }% )`,
	}
}

Branch.regist( HSL );

