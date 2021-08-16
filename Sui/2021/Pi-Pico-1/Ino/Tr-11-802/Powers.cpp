#include "Powers.h"

#include "hardware/gpio.h"
#include "hardware/pwm.h"
#include "hardware/dma.h"
#include "hardware/irq.h"

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
)
{
	//  PWM  //
	
	gpio_set_function( a_pin + 0, GPIO_FUNC_PWM );
	gpio_set_function( a_pin + 1, GPIO_FUNC_PWM );

	int slice = pwm_gpio_to_slice_num( a_pin );
	pwm_set_wrap( slice, pwm_range - 1 );
	slice_fields |= 1u << slice;

	//  DMA  //

	dma_ch = dma_claim_unused_channel( true );
	dma_fields |= 1u << dma_ch;

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
		buffer_len,
		false
	);

	if( dma_complete != NULL )
	{
		dma_fields = 1u << dma_ch;  // IRQ解除用 //
	    dma_channel_set_irq0_enabled( dma_ch, true );
		irq_set_exclusive_handler( DMA_IRQ_0, dma_complete );
		irq_set_enabled( DMA_IRQ_0, true );
	}
}

void powers_start_pwm_slices( uint32_t slice_fields )
{
	pwm_set_mask_enabled( slice_fields );
}


void powers_set_dma_start( uint32_t dma_ch, void * addr )
{
	dma_channel_set_read_addr( dma_ch, addr, false );
}

void powers_trigger_dma( uint32_t dma_fields )
{
	dma_start_channel_mask( dma_fields );
}

void powers_clear_dma_irq( uint32_t dma_irq_fields )
{
	dma_hw->ints0 = dma_irq_fields;
}
