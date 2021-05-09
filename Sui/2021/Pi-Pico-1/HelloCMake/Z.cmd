@Echo Off
Cls

RmDir build
MkDir build
CD build
CMake ..
CD ..\
