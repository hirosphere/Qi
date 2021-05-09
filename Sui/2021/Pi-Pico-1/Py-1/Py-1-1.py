import machine
import utime

print( "Pythonで鉄道模型制御 !!" )

lamp = machine.Pin( 25, machine.Pin.OUT )
led_1_a = machine.Pin( 18, machine.Pin.OUT )
led_1_b = machine.Pin( 19, machine.Pin.OUT )
led_2_a = machine.Pin( 20, machine.Pin.OUT )
led_2_b = machine.Pin( 21, machine.Pin.OUT )


def Blink( lamp, rate, loop ):
    time = 1 / rate
    for i in range( 0, loop ):
        lamp.value( 1 )
        utime.sleep( time * 0.5 )

        lamp.value( 0 )
        utime.sleep( time * 0.5 )

Blink( lamp, 10, 10 )
ct = 1
while True:
    print( str( ct ) + "回め" )
    Blink( led_1_a, 8, 1 )
    Blink( led_1_b, 8, 1 )
    Blink( led_2_a, 8, 1 )
    Blink( led_2_b, 8, 1 )
    Blink( lamp, 0.5, 1 )
    ct += 1
