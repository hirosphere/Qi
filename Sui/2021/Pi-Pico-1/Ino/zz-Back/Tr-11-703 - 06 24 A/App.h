#ifndef _APP_H_
#define _APP_H_

#include <stdint.h>

const int Train_Count = 8;
const int Canvas_Count = 8;
const int Output_Count = 8;

const int16_t PWM_Range = 5000;
const float Sample_Rate = 25000.f;   //  125MHz / 5000 = 25kHz  //
const int Buffer_Len = 250;
const float Tick_Rate = 100.f;       //  25kHz / 250 = 100Hz  //

const float PWM_Range_f = PWM_Range;

struct Renderer
{
	virtual void Render( uint32_t * output, int len ) = 0;
};

struct Powers
{
	struct Canvas
	{
		Renderer * rend = nullptr;
		void Render( int cur_index );
		uint32_t buffer[ 2 ][ Buffer_Len ];
	};

	struct Output
	{
		void Init( Powers * pows, int a_pin, void ( on_dma_complete )() );
		void Set_DMA_Start( int cur_index,  uint32_t * zero_buff );
		int dma_ch = -1;
		Canvas * src = nullptr;
	};

	void Set_Renderer( int canv_i, Renderer & rend );
	void Init_Output( int out_i, int a_pin, void ( on_dma_complete )() = nullptr );
	void Select_Output_Source( int out_i, int canv_i );
	void Trigger_PWMs();

	void Render();
	void Trigger_DMAs();
	void Clear_DMA_IRQ();

	Canvas canvas[ Canvas_Count ];
	Output output[ Output_Count ];
	uint32_t zero_buff[ Buffer_Len ] {};

	int cur_index = 0;

	uint32_t pwm_trigger_bits = 0;
	uint32_t dma_triger_bits = 0;
	uint32_t dma_irq_clear_bits = 0;
};


//    //

struct App
{
	void Setup();
	void Loop();
	void ISR_DMA_Tick();

	Powers powers;
};

//    //

void ISR_DMA_Tick();

#endif
