#include <stdio.h> //C言語の標準ライブラリ読み込み
#include "pico/stdlib.h" //Raspberry Pi Picoのライブラリ読み込み

int main() {
    const uint LED_PIN = 25; //GPIO25番を"LED_PIN"として設定

    stdio_init_all(); //stdioの初期化
    gpio_init(LED_PIN); //GPIOの初期化
    gpio_set_dir(LED_PIN, GPIO_OUT); //設定したGPIOを出力にする

    while (true) {
        gpio_put(LED_PIN, 1); //LEDを点ける
        printf("ごきげんよう\n"); //「ごきげんよう」と表示
        sleep_ms(1000); //1000ms = 1s待機
        gpio_put(LED_PIN, 0); //LEDを消す
        sleep_ms(1000); //1000ms = 1s待機
    }
}
