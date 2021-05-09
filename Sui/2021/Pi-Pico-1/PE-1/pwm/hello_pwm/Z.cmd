@Echo Off
Cls

Set PICO_SDK_PATH=C:\17\D\Pi-Pico\pico-sdk-master

Echo "build フォルダを削除"
RmDir /s/q build
Echo "build フォルダを作成"
MkDir build

CD .\build
CMake ..

CD ..\
