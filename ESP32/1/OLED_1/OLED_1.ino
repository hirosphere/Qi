#include <SPI.h>
//自動で VSPI となる。SCLK= #18 , MOSI= #23 は自動アサイン。
const uint8_t cs_OLED = 17; //CS (Chip Select)
const uint8_t DCpin =  16; //OLED DC(Data/Command)
const uint8_t RSTpin =  4; //OLED Reset
 
uint32_t rand_sr = 0xace1;
uint8_t rand_match = 0;

struct
{
  int count = 0;
  int time = 180 * 50;
  int time_count = 1;
} cc;


void setup()
{
  pinMode( 0, INPUT_PULLUP );
  Serial.begin( 115200 );
  Serial.println( "OLED_1" );
  
  SSD1331_Init(cs_OLED, DCpin, RSTpin);
  int i, j;
  for(j=0; j<64; j++){ //画面黒塗りつぶし
    for(i=0; i<96; i++){
      DataWrite(0);
    }
  }
 
}

uint8_t rgb( uint8_t r, uint8_t g, uint8_t b )
{
  return r << 5 | g << 2 | b ;
}

uint8_t color_1 = rgb( 2, 2, 1 ), color_2 = rgb( 0, 0, 1 );

void loop()
{
  int i, j;

  if( digitalRead( 0 ) == LOW )
  {
    while( true )
    {
      delay( 1 );
      rand( 1 );
      if( digitalRead( 0 ) == HIGH )
      {
        cc.time_count = 0;
        break;
      }
    }
  }
  
  if( -- cc.time_count <= 0 )
  {
    cc.time_count = cc.time;

    color_1 = rgb( 0, 0, 0 ) ;
    color_2 = rand( 8 );

    Serial.print( cc.count ++ );
    Serial.print( " " );
    Serial.print( color_1, HEX );
    Serial.print( " " );
    Serial.print( color_2, HEX );
    Serial.print( " " );
    Serial.print( rand_match );
    Serial.print( "\r\n" );
  }
   
  for( j = 0; j < 64; j ++ )
  {
    byte buff[ 96 ];
    int bi = 0;
    for( i = 0; i < 96; i ++ )
    {
      uint8_t color = rand( 1 ) ? color_2 : color_1 ;
      buff[ bi ++ ] = color ;
    }
    OLED_WriteBytes( buff, 96 );
  }

  delay( 10 );
}

uint32_t rand( uint8_t bits )
{
  uint32_t mask = 1;
  while( bits -- )
  {
    rand_sr <<= 1;
    rand_sr |= 1 &
    (
      ( rand_sr >> 16 ) ^
      ( rand_sr >> 19 ) ^
      ( rand_sr >> 20 ) ^
      ( rand_sr >> 25 )
    );
    mask <<= 1;
  }
  if( ( rand_sr & 0xffff ) == 0xace1 )  rand_match ++;
  return rand_sr & ( mask - 1 );
}
 
//*********** SSD1331 初期化 ****************************
void SSD1331_Init(uint8_t CS, uint8_t DC, uint8_t RST){  
  pinMode(RST, OUTPUT);
  pinMode(DC, OUTPUT);
  pinMode(CS, OUTPUT);
 
  digitalWrite(RST, HIGH);
  digitalWrite(RST, LOW);
  delay(1);
  digitalWrite(RST, HIGH);
 
  digitalWrite(CS, HIGH);
  digitalWrite(DC, HIGH);
 
  SPI.begin(); //VSPI
  SPI.setFrequency(5000000); //SSD1331 のSPI Clock Cycle Time 最低150ns
  SPI.setDataMode(SPI_MODE2); //オシロで測ると、ESP32のSPI_MODE2はMODE3だったので要注意
 
  CommandWrite(0xAE); //Set Display Off
  CommandWrite(0xA0); //Remap & Color Depth setting　
    CommandWrite(0b00110010); //A[7:6] = 00; 256 color. A[7:6] = 01; 65k color format
  CommandWrite(0xA1); //Set Display Start Line
    CommandWrite(0);
  CommandWrite(0xA2); //Set Display Offset
    CommandWrite(0);
  CommandWrite(0xA4); //Set Display Mode (Normal)
  CommandWrite(0xA8); //Set Multiplex Ratio
    CommandWrite(63); //15-63
  CommandWrite(0xAD); //Set Master Configration
    CommandWrite(0b10001110); //a[0]=0 Select external Vcc supply, a[0]=1 Reserved(reset)
  CommandWrite(0xB0); //Power Save Mode
    CommandWrite(0x1A); //0x1A Enable power save mode. 0x00 Disable
  CommandWrite(0xB1); //Phase 1 and 2 period adjustment
    CommandWrite(0x74);
  CommandWrite(0xB3); //Display Clock DIV
    CommandWrite(0xF0);
  CommandWrite(0x8A); //Pre Charge A
    CommandWrite(0x81);
  CommandWrite(0x8B); //Pre Charge B
    CommandWrite(0x82);
  CommandWrite(0x8C); //Pre Charge C
    CommandWrite(0x83);
  CommandWrite(0xBB); //Set Pre-charge level
    CommandWrite(0x3A);
  CommandWrite(0xBE); //Set VcomH
    CommandWrite(0x3E);
  CommandWrite(0x87); //Set Master Current Control
    CommandWrite(0x06);
  CommandWrite(0x15); //Set Column Address
    CommandWrite(0);
    CommandWrite(95);
  CommandWrite(0x75); //Set Row Address
    CommandWrite(0);
    CommandWrite(63);
  CommandWrite(0x81); //Set Contrast for Color A
    CommandWrite(255);
  CommandWrite(0x82); //Set Contrast for Color B
    CommandWrite(255);
  CommandWrite(0x83); //Set Contrast for Color C
    CommandWrite(255);
  CommandWrite(0xAF); //Set Display On
  delay(110); //0xAFコマンド後最低100ms必要
}
//********** SPI コマンド出力 ****************************
void CommandWrite(uint8_t b){  
  digitalWrite(cs_OLED, LOW);
  digitalWrite(DCpin, LOW);//DC
  SPI.write(b);
  digitalWrite(cs_OLED, HIGH);
}
//********** SPI データ出力 ****************************
void DataWrite(uint8_t b){  
  digitalWrite(cs_OLED, LOW);
  digitalWrite(DCpin, HIGH);//DC
  SPI.write(b);
  digitalWrite(cs_OLED, HIGH);
}

void OLED_WriteBytes( uint8_t buff[], int len )
{  
  digitalWrite(cs_OLED, LOW);
  digitalWrite(DCpin, HIGH);//DC
  SPI.writeBytes( buff, len );
  digitalWrite(cs_OLED, HIGH);
}