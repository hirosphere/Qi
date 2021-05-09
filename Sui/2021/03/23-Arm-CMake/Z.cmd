@Echo Off
Cls

Set Path=%Path%;C:\Program Files (x86)\GNU Arm Embedded Toolchain\10 2020-q4-major\bin
Set Path=%Path%;C:\Program Files\CMake\bin

rem Set CMAKE_C_COMPILER=
Rem Set PICO_SDK_PATH=C:\17\D\Pi-Pico\pico-sdk-master

Rem arm-none-eabi-gcc --version

CMake CMakeLists.txt
