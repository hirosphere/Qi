@Echo Off
Cls

Rem Set Path=%Path%;C:\Program Files (x86)\GNU Arm Embedded Toolchain\10 2020-q4-major
Rem Set Path=%Path%;C:\Program Files\CMake\bin
Set PICO_SDK_PATH=C:\17\D\Pi-Pico\pico-sdk-master

Echo "build フォルダを削除"
RmDir /s/q build
Echo "build フォルダを作成"
MkDir build

CD .\build
CMake ^
	-G "NMake Makefiles" ^
	-DPICO_SDK_PATH="C:/17/D/Pi-Pico/pico-sdk-master" ^
	-DCMAKE_C_COMPILER="C:/Program Files (x86)/GNU Arm Embedded Toolchain/10 2020-q4-major/arm-none-eabi-gcc" ^
	-DCMAKE_CXX_COMPILER="C:/Program Files (x86)/GNU Arm Embedded Toolchain/10 2020-q4-major/arm-none-eabi-g++" ^
	..

CD ..\
