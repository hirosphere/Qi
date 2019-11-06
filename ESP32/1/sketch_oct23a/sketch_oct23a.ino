#include "esp32-hal-ledc.h"
#include "WiFi.h"

const int L1_Pin = A4;
const int L1_Ch = 0;

void setup()
{
  WiFi.mode( WIFI_OFF );
  ledcSetup( L1_Ch, 12800, 8 );
  ledcAttachPin( L1_Pin, L1_Ch );
}

int L1_V = 255;

void loop()
{
  ledcWrite( L1_Ch, L1_V );
  delay( 10 );
  if( -- L1_V == 0 )  L1_V = 255;
}
