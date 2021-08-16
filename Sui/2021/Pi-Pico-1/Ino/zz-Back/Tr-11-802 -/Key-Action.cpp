#include "App.h"

String Main_App::Key_Action::Act( char key )
{
	switch( key )
	{
		case 'q': train_sel = 0; break;
		case 'w': train_sel = 1; break;
		case 'e': train_sel = 2; break;
		case 'r': train_sel = 3; break;

		case 'A': field_sel = "Idle"; break;
		case 'S': field_sel = "Bias"; break;
		case 'D': field_sel = "Max"; break;

		case 'a': field_sel = "Speed"; break;
		case 's': field_sel = "Act"; break;
		case 'd': field_sel = "Target"; break;

		case 'X': field().Up_Down( 1 );  break;
		case 'x': field().Up_Down( 2 );  break;
		case 'v': field().Up_Down( 3 );  break;
		case 'V': field().Up_Down( 4 );  break;

		case 'Z': field().Up_Down( -1 );  break;
		case 'z': field().Up_Down( -2 );  break;
		case 'c': field().Up_Down( -3 );  break;
		case 'C': field().Up_Down( -4 );  break;

		case 'b': field().Up_Down( 0 );  break;

		case '9':  wm_isr_wait -= 1;  break;
		case '0':  wm_isr_wait += 1;  break;
		case ' ': break;
	}

	return	
		"Train " + String( train_sel )
		+ " " + field().Full_String()
		+ " ("
		+ " " + train().To_String()
			+ " - wait " + String( wm_isr_wait )
		+ " )"
	;
}
