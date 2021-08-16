#include "hardware/gpio.h"
#include "hardware/pwm.h"
#include "hardware/dma.h"
#include "hardware/irq.h"
#include "Power.h"


//  Canvas , Channel  //


void Canvas::Set_Renderer( int i, Renderer & renderer )
{
	Channel * ch = Get_Channel( i );
	if( ch ) ch->renderer = & renderer;
}

void Canvas::Render()
{
	Channel * ch;
	for( int i = 0; ch = Get_Channel( i ); i ++ )
	{
		if( ch->renderer ) ch->renderer->Render( ch->Get_Buffer( cur_index ), buffer_len() );
	}
}

int Canvas::Next()
{
	int r = cur_index;
	cur_index = r == 0 ? 1 : 0;
	return r;
}


//  Powoers , Channel  //


Powers::Powers( Canvas & canvas, int32_t pwm_range ) :
	canvas( canvas ),
	pwm_period( pwm_range - 1 )
{
	;
}

void Powers::Init_Periph( int i, int a_pin, void( * dma_complete )( void ) )
{
	if( i >= 0 && i < Channel_Count )  channels[ i ].Init_Periph( * this, a_pin, dma_complete );
}

void Powers::Select_Source( int i, int srcch )
{
	if( i >= Channel_Count || i < 0 )  return;
	channels[ i ].src = canvas.Get_Channel( srcch );
}

void Powers::Start_PWMs()
{
	pwm_set_mask_enabled( slices_mask );
}

void Powers::Trigger_DMAs()
{
	int cur_index = canvas.Next();
	
	for( int i = 0; i < Channel_Count; i ++  )
	{
		channels[ i ].DMA_Next( cur_index );
	}
	
	dma_start_channel_mask( dmas_mask );
}

void Powers::Clear_DMA_IRQ()
{
	dma_hw->ints0 = dma_irq_mask;
}


//

void Powers::Channel::Init_Periph( Powers & pows, int a_pin, void( * dma_complete )( void ) )
{
	//  PWM  //
	
	gpio_set_function( a_pin + 0, GPIO_FUNC_PWM );
	gpio_set_function( a_pin + 1, GPIO_FUNC_PWM );

	slice_num = pwm_gpio_to_slice_num( a_pin );
	pwm_set_wrap( slice_num, pows.pwm_period );	
	pows.slices_mask |= 1u << slice_num;

	//  DMA  //

	dma_ch = dma_claim_unused_channel( true );
	if( dma_ch < 0 )  return;

	pows.dmas_mask |= 1u << dma_ch;

	dma_channel_config c = dma_channel_get_default_config( dma_ch );
	channel_config_set_transfer_data_size( &c, DMA_SIZE_32 );
	channel_config_set_read_increment( &c, true );
	channel_config_set_write_increment( &c, false );
	channel_config_set_dreq( &c, DREQ_PWM_WRAP0 + slice_num );

	dma_channel_configure
	(
		dma_ch,
		&c,
		&pwm_hw->slice[ slice_num ].cc,
		nullptr,
		pows.canvas.buffer_len(),
		false
	);

	if( dma_complete != nullptr )
	{
		pows.dma_irq_mask = 1u << dma_ch;  // IRQ解除用 //
		dma_channel_set_irq0_enabled( dma_ch, true );
		irq_set_exclusive_handler( DMA_IRQ_0, dma_complete );
		irq_set_enabled( DMA_IRQ_0, true );
	}
}

int dma_next_mon = 0;

void Powers::Channel::DMA_Next( int cur_index )
{
	if( dma_ch >= 0 && src != nullptr )
	{
		dma_channel_set_read_addr( dma_ch, src->Get_Buffer( cur_index ), false );
	}
}

