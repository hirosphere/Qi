#include "App.h"

//  static  //

uint32_t PWM_Channel::slices_mask = 0;
uint32_t PWM_Channel::dma_ch_mask = 0;
uint32_t PWM_Channel::prime_dma_chan_mask = 0;


//  dynamic  //

void PWM_Channel::Init( int a_pin, Wave_Canvas * canvas, void( * dma_handler )() )
{
	this->canvas = canvas;

	gpio_set_function( a_pin + 0, GPIO_FUNC_PWM );
	gpio_set_function( a_pin + 1, GPIO_FUNC_PWM );

	slice = pwm_gpio_to_slice_num( a_pin );
	pwm_set_wrap( slice, PWM_Range - 1 );	
	//pwm_set_enabled( slice, true );
	PWM_Channel::slices_mask |= 1u << slice;

	dma_init( dma_handler );
}

void PWM_Channel::Test()
{
	Test_Out( 1.f );  delay( 50 );
	Test_Out( -1.f );  delay( 50 );
	Test_Out( .1f );  delay( 50 );
	Test_Out( -.1f );  delay( 50 );
	Test_Out( 0.f );
}

void PWM_Channel::dma_init( void( * dma_handler )() )
{
	dma_chan = dma_claim_unused_channel( true );
	PWM_Channel::dma_ch_mask |= 1u << dma_chan;

	dma_channel_config c = dma_channel_get_default_config( dma_chan );
	channel_config_set_transfer_data_size( &c, DMA_SIZE_32 );
	channel_config_set_read_increment( &c, true );
	channel_config_set_write_increment( &c, false );
	channel_config_set_dreq( &c, DREQ_PWM_WRAP0 + slice );

	dma_channel_configure
	(
		dma_chan,
		&c,
		&pwm_hw->slice[ slice ].cc,
		canvas->Buffers[ 0 ][ 0 ],
		Canvas_Buffer_Size,
		false
	);

	if( dma_handler != NULL )
	{
		PWM_Channel::prime_dma_chan_mask = 1u << dma_chan;  // IRQ解除用 //
	    dma_channel_set_irq0_enabled( dma_chan, true );
		irq_set_exclusive_handler( DMA_IRQ_0, dma_handler );
		irq_set_enabled( DMA_IRQ_0, true );
	}
}

void PWM_Channel::Select_Source( int ch )
{
	buff[ 0 ] = canvas->Buffers[ ch ][ 0 ];
	buff[ 1 ] = canvas->Buffers[ ch ][ 1 ];
}

void PWM_Channel::Test_Out( float value )
{
	int a_value = ( int ) ( value * ( float ) PWM_Range );
	pwm_set_chan_level( slice, PWM_CHAN_A, a_value >= 0 ? a_value : 0 );
	pwm_set_chan_level( slice, PWM_CHAN_B, a_value >= 0 ? 0 : - a_value );
}

