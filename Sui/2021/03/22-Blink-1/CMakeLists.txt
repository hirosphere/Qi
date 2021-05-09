#ここでは、お使いのCMakeのバージョンを指定します
cmake_minimum_required(VERSION 3.19) 

#.cmakeファイルを読み込みます
include(pico_sdk_import.cmake)

#プロジェクト名を書きます(ここでは、例として"TEST"としました)
project(TEST)

#SDKの初期化が行われます
pico_sdk_init()

#add_executable(プロジェクト名　C言語のソースコード名)と書きます
add_executable(TEST
        App.c
        )

#"pico_stdlib.h"が読み込めるようにしています
target_link_libraries(TEST pico_stdlib)

#USBによる通信を許可し、UART通信を許可しない設定だと思います
pico_enable_stdio_usb(TEST 1)
pico_enable_stdio_uart(TEST 0)

#ビルド実行結果などの色々なファイルを出力するのに必要な設定だと思います
pico_add_extra_outputs(TEST)
