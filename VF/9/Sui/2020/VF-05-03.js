
const VF = {};

VF.Train = function()
{
};

VF.SoundGen = function()
{
	const context = new AudioContext();
	this.Volume = 70;
	this.IsPlay = false;

	//

	const master_volume = context.createGain();
	const test_oscillator = context.createOscillator();

	//
	master_volume.connect( context.destination );
		test_oscillator.connect( master_volume );

	//

	test_oscillator.frequency.value = 300;
	test_oscillator.type = "triangle";
	test_oscillator.start();

	//

	const pwm = new VF.PWM( context );

	this.Start = function()
	{
		this.IsPlay = true;
		this.Update();
	};

	this.Stop = function()
	{
		this.IsPlay = false;
		this.Update();
	};
	
	this.Update = function()
	{
		master_volume.gain.value = this.IsPlay ? this.Volume / 100 : 0;
	};

	this.Play = function( doc, vf )
	{
		;
	};

	this.Update();
};

VF.PWM = function( context )
{
	this.SetScadule = function()
	{
		;
	};
};
