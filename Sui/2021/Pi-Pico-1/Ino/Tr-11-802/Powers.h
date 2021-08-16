#ifndef _POWERS_H_
#define _POWERS_H_

#include <stdint.h>

void powers_init_periph
(
	const int16_t pwm_range,
	const int buffer_len,
	uint32_t & slice_fields,
	uint32_t & dma_fields,
	uint32_t & dma_irq_fields,
	uint32_t & dma_ch,
	int a_pin,
	void( dma_complete )()
);

void powers_start_pwm_slices( uint32_t slice_fields );
void powers_set_dma_start( uint32_t dma_ch, void * addr );
void powers_trigger_dma( uint32_t dma_fields );
void powers_clear_dma_irq( uint32_t dma_irq_fields );



template< int Canvas_Count, int Output_Count, int Buffer_Len, int16_t PWM_Range > struct PowersTemplate
{
	const int buffer_len = Buffer_Len;

	struct Renderer
	{
		virtual void Render( uint32_t * output, int len ) = 0;
	};

	struct Canvas
	{
		uint32_t buffer[ 2 ][ Buffer_Len ] {};
		Renderer * renderer = nullptr;

		void Render( int cur_index )
		{
			if( renderer ) renderer->Render( buffer[ cur_index ], Buffer_Len );
		}
	};

	struct Output
	{
		uint32_t dma_ch;
		Canvas * source = nullptr;

		void InitPeriph( PowersTemplate * pows, int a_pin, void( dma_complete )() )
		{
			powers_init_periph
			(
				PWM_Range,
				Buffer_Len,
				pows->slice_fields,
				pows->dma_fields,
				pows->dma_irq_fields,
				dma_ch,
				a_pin,
				dma_complete
			);
		}

		void SetDMAStart( int cur_index )
		{
			if( source ) powers_set_dma_start( dma_ch, source->buffer[ cur_index ] );
		}
	};


	//  Powers  //
	
	Canvas canvases[ Canvas_Count ];
	Output outputs[ Output_Count ];
	int cur_index = 0;

	uint32_t slice_fields = 0;
	uint32_t dma_fields = 0;
	uint32_t dma_irq_fields = 0;

	void SetRenderer( int cnvs_i, Renderer & r )
	{
		if( cnvs_i < 0 || cnvs_i >= Canvas_Count ) return;
		canvases[ cnvs_i ].renderer = & r;
	}

	void InitOutputPeriph( int out_i, int a_pin, void( dma_complete )() = nullptr )
	{
		if( out_i < 0 || out_i > Output_Count ) return;
		outputs[ out_i ].InitOutputPeriph( this, a_pin, dma_complete );
	}
	
	void SelectOutputSrc( int out_i, int cnvs_i )
	{
		if( out_i < 0 || out_i > Output_Count ) return;
		if( cnvs_i < 0 || cnvs_i >= Canvas_Count ) return;
		outputs[ out_i ].src = & canvases[ cnvs_i ];
	}

	void StartPWMSlices()
	{
		powers_start_pwm_slices( slice_fields );
	}

	void TriggerDMA()
	{
		for( int i = 0; i < Output_Count; i ++ )  outputs[ i ].SetDMAStart( cur_index );
		powers_trigger_dma( dma_fields );
		cur_index = ( cur_index == 0 ? 1 : 0 );
	}

	void ISRClearDMAIRQ()
	{
		powers_clear_dma_irq( dma_irq_fields );
	}

	void Render()
	{
		for( int i = 0; i < Canvas_Count; i ++ )  canvases[ i ].Render();
	}

	//
};


#endif
