#include "App.h"
#include "hardware/gpio.h"
#include "hardware/pwm.h"
#include "hardware/dma.h"
#include "hardware/irq.h"

Powers::Powers()
{
	for( int i = 0; i < Output_Count; i ++ ) output[ i ].zero_buff = zero_buff;
}

void Powers::Canvas::Render( int cur_index )
{
	if( rend ) rend->Render( buffer[ cur_index ] );
}

void Powers::Set_Renderer( int canv_i, Renderer & rend )
{
	if( canv_i < 0 || canv_i > Canvas_Count )  return;
	canvas[ canv_i ].rend = & rend;
}

void Powers::Init_Output( int out_i, int a_pin, void ( on_dma_complete )() )
{
	if( out_i < 0 || out_i > Output_Count )  return;
	output[ out_i ].Init( this, a_pin, on_dma_complete );
}

void Powers::Select_Output_Source( int out_i, int canv_i )
{
	if( out_i < 0 || out_i > Output_Count )  return;
	if( canv_i < 0 || canv_i > Canvas_Count )  return;
	output[ out_i ].src = & canvas[ canv_i ];
}

void Powers::Trigger_PWMs()
{
	pwm_set_mask_enabled( pwm_trigger_bits );
}

void Powers::Render()
{
	for( int i = 0; i < Canvas_Count; i ++ )
	{
		canvas[ i ].Render( cur_index );
	}
}

void Powers::Trigger_DMAs()
{
	for( int i = 0; i < Output_Count; i ++ )
	{
		output[ i ].Set_DMA_Start( cur_index );
	}
	dma_start_channel_mask( dma_trigger_bits );
	// cur_index = cur_index == 0 ? 1 : 0;
	cur_index ^= 1;
}

void Powers::Clear_DMA_IRQ()
{
	dma_hw->ints0 = dma_irq_clear_bits;
}

//    //

void Powers::Output::Init( Powers * pows, int a_pin, void ( on_dma_complete )() )
{
	//  PWM  //
	
	gpio_set_function( a_pin + 0, GPIO_FUNC_PWM );
	gpio_set_function( a_pin + 1, GPIO_FUNC_PWM );

	int slice = pwm_gpio_to_slice_num( a_pin );
	pwm_set_wrap( slice, PWM_Range - 1 );
	pwm_set_output_polarity( slice, true, true );
	pows->  pwm_trigger_bits |= 1u << slice;

	//  DMA  //

	dma_ch = dma_claim_unused_channel( true );
	pows-> dma_trigger_bits |= 1u << dma_ch;

	dma_channel_config c = dma_channel_get_default_config( dma_ch );
	channel_config_set_transfer_data_size( &c, DMA_SIZE_32 );
	channel_config_set_read_increment( &c, true );
	channel_config_set_write_increment( &c, false );
	channel_config_set_dreq( &c, DREQ_PWM_WRAP0 + slice );

	dma_channel_configure
	(
		dma_ch,
		&c,
		&pwm_hw->slice[ slice ].cc,
		nullptr,
		Buffer_Len,
		false
	);

	if( on_dma_complete != nullptr )
	{
		pows-> dma_irq_clear_bits = 1u << dma_ch;  // IRQ解除用 //
	    dma_channel_set_irq0_enabled( dma_ch, true );
		irq_set_exclusive_handler( DMA_IRQ_0, on_dma_complete );
		irq_set_enabled( DMA_IRQ_0, true );
	}
}

void Powers::Output::Set_DMA_Start( int cur_index )
{
	if( dma_ch < 0 ) return;

	dma_channel_set_read_addr
	(
		dma_ch,
		src != nullptr ? src-> buffer[ cur_index ] : zero_buff,
		false
	);
}
