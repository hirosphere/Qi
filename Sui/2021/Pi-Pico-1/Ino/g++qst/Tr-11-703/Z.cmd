@Echo Off
Cls

Set Args=-o a.exe qst-1.cpp

Echo -
Echo Begin Compile --  g++ %Args%
Echo -

g++ %Args%
Echo End Compile
