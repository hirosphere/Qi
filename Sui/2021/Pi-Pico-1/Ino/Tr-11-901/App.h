#ifndef _APP_H_
#define _APP_H_

#include "General.h"


//    //

#define App_Name  "Tr-11-901"
#define Serial_Addr  "Tr-1"

const int Power_Channel_Count = 8;
const float PWM_Range = 2500.f;              //  125MHz -> ( 2500 ) -> 50kHz  //

const int Canvas_Channel_Count = 8;
const float Canvas_Sample_Rate = 50000.f;    //  50kHz -> ( 500 ) -> 100Hz  //
const int   Canvas_Buffer_Size = 500;
const float Canvas_Render_Rate = 100.f;

const int Train_Count = 8;

//    //

void tw_mon_init();
void tw_mon_isr_ent();
void tw_mon_isr_ext();


//    //



//    //

class Power_Channels
{
 public:
	
	Power_Channels( class Canvas & );

	void Init_Channel( int ch, int a_pin, void( * dma_handler )() = NULL );
	void Select_Src( int ch, int src );

	void Start_Slices();
	void DMA_Trigger();
	void Clear_DMA_IRQ();

	void Immudiate( int ch, float value );
	String Monitor();

 protected:

	int slices[ Power_Channel_Count ] = { -1 };
	uint32_t slices_mask = 0;
	
	int dma_channels[ Power_Channel_Count ] = { -1 };
	uint32_t dma_mask = 0;
	uint32_t prime_dma_ch_mask = 0;

	class Canvas & canvas;
	int sources[ Power_Channel_Count ] = { 0 };
};


inline void pwm_i( uint32_t * & sample, int16_t value )
{
	* sample ++ = ( value >= 0 ? value : ( - value ) << 16 );
}

inline void pwm_f( uint32_t * & sample, float value )
{
	int32_t v = value * PWM_Range;
	* sample ++ = ( v >= 0 ? v : - ( v << 16 ) );
}

//    //

class Canvas
{
 public:

	typedef uint32_t Buffer[ Canvas_Buffer_Size ];
	typedef Buffer  Double_Buffer[ 2 ]; 

	Canvas();
	
	void Set_Renderer( int ch, class Renderer * r );
	Buffer & Get_Channel( int ch );
	void ISR_Render();

 protected:

	Double_Buffer channels[ Canvas_Channel_Count ];
	int cur_index = 0;

	class Renderer * renderers[ Canvas_Channel_Count ] = { NULL };

};

//    //

class Renderer
{
 public:

	virtual void Render( uint32_t * output ) = 0;
	virtual void testput( int cmd, float value ) {}
	virtual String Monitor() { return "Renderer"; }
};


//    //

struct Train : public Renderer
{
	Float  vf_type , vf_volume;

	Float  target, act;
	Float  speed;
	Float  idle , bias , max;

	Float  tv1;

	float motor_voltage();

	//  oper  //
	
	Train();

	void Render( uint32_t * output )  override;
	Renderer * vf_renderer;

	// fields  //

	Field & Get_Field( String name );
	typedef enum { Idle, Bias, Max, Speed, Limit, Act, TF1, VF_Type, VF_Volume, index_len } index_t;
	Field * fields[ index_len ];

};


//    //

class App
{
 public:

	virtual void Init() = 0;
	virtual void Loop() = 0;
	virtual void ISR_Canvas_Render( bool is_dma_irq = true ) = 0;

};

void ISR_Canvas_Render();

App * Create_Main_App();
App * Create_Sub_App();

Renderer * Create_Renderer( Train * train, int type, float a = 0, float b = 0, float c = 0, float d = 0 );

#endif
