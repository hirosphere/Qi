@Echo Off
Cls

Set PICO_SDK_PATH=C:\17\D\Pi-Pico\pico-sdk

Echo "build �t�H���_���폜"
RmDir /s/q build
Echo "build �t�H���_���쐬"
MkDir build

CD .\build
CMake ..

CD ..\
