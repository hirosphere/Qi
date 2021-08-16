#include "hardware/pwm.h"
#include "hardware/dma.h"
#include "arduino.h"
#include "App.h"


static Canvas::Buffer test_buffer;

Power_Channels::Power_Channels( Canvas & canvas )  :  canvas( canvas )
{
	uint32_t * p = test_buffer;
	for( int i = 0; i < Canvas_Buffer_Size; i ++ )
	{
		* p ++ = random( - PWM_Range, PWM_Range );
	}
}

String Power_Channels::Monitor()
{
	String rt = "";
	rt += "DMA ";  for( int i = 0; i < Power_Channel_Count; i ++ )  rt += String( dma_channels[ i ] ) + " ";
	rt += "Src ";  for( int i = 0; i < Power_Channel_Count; i ++ )  rt += String( sources[ i ] ) + " ";
	return rt;
}

void Power_Channels::Init_Channel( int ch, int a_pin, void( * dma_handler )() )
{
	//  PWM  //
	
	gpio_set_function( a_pin + 0, GPIO_FUNC_PWM );
	gpio_set_function( a_pin + 1, GPIO_FUNC_PWM );

	int slice = pwm_gpio_to_slice_num( a_pin );
	pwm_set_wrap( slice, PWM_Range - 1 );	
	slices[ ch ] = slice;
	slices_mask |= 1u << slice;

	//  DMA  //

	int dma_ch = dma_channels[ ch ] = dma_claim_unused_channel( true );
	dma_mask |= 1u << dma_ch;

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
		test_buffer,
		Canvas_Buffer_Size,
		false
	);

	if( dma_handler != NULL )
	{
		prime_dma_ch_mask = 1u << dma_ch;  // IRQ解除用 //
	    dma_channel_set_irq0_enabled( dma_ch, true );
		irq_set_exclusive_handler( DMA_IRQ_0, dma_handler );
		irq_set_enabled( DMA_IRQ_0, true );
	}
}

void Power_Channels::Select_Src( int ch, int src )
{
	sources[ ch ] = src;
}

void Power_Channels::Start_Slices()
{
	pwm_set_mask_enabled( slices_mask );
}

void Power_Channels::DMA_Trigger()
{
	for( int i = 0; i < Power_Channel_Count; i ++  )
	{
		int dma_ch = dma_channels[ i ];
		int src = sources[ i ];

		if( dma_ch >= 0 )
		{
			dma_channel_set_read_addr( dma_ch, canvas.Get_Channel( src ), false );
		}
	}
	dma_start_channel_mask( dma_mask );
}

void Power_Channels::Clear_DMA_IRQ()
{
	dma_hw->ints0 = prime_dma_ch_mask;
}


void Power_Channels::Immudiate( int ch, float value )
{
	int slice = slices[ ch ];
	int a_value = ( int ) ( value * PWM_Range );
	pwm_set_chan_level( slice, PWM_CHAN_A, a_value >= 0 ? a_value : 0 );
	pwm_set_chan_level( slice, PWM_CHAN_B, a_value >= 0 ? 0 : - a_value );
}

