#include <arduino.h>

struct Field
{
	Field( String name ) : name( name ) {}
	String name = "Field";
	virtual String full_string() { return name; };
};

struct float_prof
{
	String unit;
	float init , min , max , steps[ 4 ];
};

struct Float : public Field
{
	Float( String name, float_prof & prof ): Field( name ), prof( prof )
	{
		value = prof.init;
	}

	String full_string() override
	{
		
		return name + " " + String( value ) + prof.unit;
	}

	float value;
	float_prof & prof;
};

struct
{
	float_prof idle    { "V",    0.8f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	float_prof bias    { "V",    1.2f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	float_prof voltage { "V",    0.0f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	float_prof max     { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
}
profs;

struct Train
{
	Float  idle  { "Idle",  profs.idle    };
	Float  bias  { "Bias",  profs.bias    };
	Float  max   { "Max",   profs.max     };
	Float  cv    { "CV",    profs.voltage };


	Train() : items { & idle, & bias, & max, & cv } {}

	typedef enum { Idle, Bias, Max, CV, Index_Count } index_t;
	Field * items[ Index_Count ];

	Field & get_field( String name )
	{
		Field * field = NULL;
		for( int i = 0; i < Index_Count; i ++ )
		{
			field = items[ i ];
			if( field -> name == name ) return * field;
		}
		return idle;
	}
};

struct KSO { virtual void key_stroke( char key ) = 0; };
struct Trains_KSO : public KSO
{
	Trains_KSO( Train * trains ) : trains( trains ) {}

	Train * trains;
	int cur_train_num = 0;
	inline Train & cur_train() {  return trains[ cur_train_num ];  }
	inline Field & cur_field() {  return trains[ cur_train_num ].get_field( cur_field_name );  }
	
	String cur_field_name = "CV";

	void key_stroke( char key )  override
	{
		switch( key )
		{
			case 'q':  cur_train_num = 0;  break;
			case 'w':  cur_train_num = 1;  break;
			case 'e':  cur_train_num = 2;  break;
			case 'r':  cur_train_num = 3;  break;

			case 'a':  cur_field_name = "Idle";  break;
			case 's':  cur_field_name = "Bias";  break;
			case 'd':  cur_field_name = "Max";  break;
			case 'f':  cur_field_name = "CV";  break;

			default:  return;  break;
		}

		//std::cout << " - "
		//	<< "Train " << std::to_string( cur_train_num )
		//	<< " " << cur_field().full_string() << std::endl
		;
	}
};

int quest_main()
{
	Train trains[ 4 ];
	Trains_KSO tacc { trains };
		tacc.key_stroke( ch );
	return 0;
}
