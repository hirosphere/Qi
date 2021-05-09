@Echo Off
Cls

Rem Set Path=%Path%;C:\Program Files (x86)\GNU Arm Embedded Toolchain\10 2020-q4-major
Set Path=%Path%;C:\Program Files\CMake\bin
Set PICO_SDK_PATH=C:\17\D\Pi-Pico\pico-sdk-master

Rem arm-none-eabi-gcc App.c -o 03-22-Blink.uf2

Rem arm-none-eabi-gcc --version

CMake CMakeLists.txt
