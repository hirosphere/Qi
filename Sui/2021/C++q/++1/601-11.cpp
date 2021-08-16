#include "601-11.h"

void Float_Prof::value_oper( float & value, int step_class )
{
	if( step_class == 0 ) { value = init; return; }
	if( step_class > 0 )  value += steps[ step_class - 1 ];
	else                  value -= steps[ -1 - step_class ];

	if( value > max ) value = max; else if( value < min ) value = min;
}

String Float_Prof::value_string( float & value )
{
	return std::to_string( value ) + unit;
}


String Float::Full_String()
{
	return name + " " + prof.value_string( value );
}

void Float::Up_Down( int step_class ) {  prof.value_oper( value, step_class );  }

struct
{
	Float_Prof idle    { "V",    0.8f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	Float_Prof bias    { "V",    1.2f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	Float_Prof voltage { "V",    0.0f, 0.f, 12.f, { 0.01f, 0.1f, 0.5f, 1.f } };
	Float_Prof max     { "km/h", 240.f, 0.f, 1200.f, { 1.f, 5.f, 10.f, 50.f } };
}
profs;

Train::Train() :

	idle  { "Idle",  profs.idle    },
	bias  { "Bias",  profs.bias    },
	max   { "Max",   profs.max     },
	cv    { "CV",    profs.voltage },

	items { & idle, & bias, & max, & cv }
	
{}

Field & Train::Get_Field( String name )
{
	Field * field = NULL;
	for( int i = 0; i < Index_Count; i ++ )
	{
		field = items[ i ];
		if( field -> name == name ) return * field;
	}
	return idle;
}

struct Trains_KSO : public KSO
{
	Trains_KSO( Train * trains ) : trains( trains ) {}

	Train * trains;
	int cur_train_num = 0;
	inline Train & cur_train() {  return trains[ cur_train_num ];  }
	inline Field & cur_field() {  return cur_train().Get_Field( cur_field_name );  }
	
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

			case 'Z':  cur_field().Up_Down( -1 );  break;
			case 'X':  cur_field().Up_Down(  1 );  break;
			case 'z':  cur_field().Up_Down( -2 );  break;
			case 'x':  cur_field().Up_Down(  2 );  break;
			case 'c':  cur_field().Up_Down( -3 );  break;
			case 'v':  cur_field().Up_Down(  3 );  break;
			case 'C':  cur_field().Up_Down( -4 );  break;
			case 'V':  cur_field().Up_Down(  4 );  break;
			case 'b':  cur_field().Up_Down(  0 );  break;

			default:  return;  break;
		}

		std::cout << " - "
			<< "Train " << std::to_string( cur_train_num )
			<< " " << cur_field().Full_String() << std::endl
		;
	}
};

int main()
{
	std::cout << "KSO\n";

	Train trains[ 4 ];
	Trains_KSO tacc { trains };

	while( 1 )
	{
		char ch;
		std::cin.get( ch );
		tacc.key_stroke( ch );
	}

	return 0;
}
