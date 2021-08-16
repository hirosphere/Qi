@Echo Off
Cls

Rem Set Args=-o a.exe 601-11.cpp
Set Args=-o s.exe 603-Init-List.cpp


Echo Begin Compile --  g++ %Args%
g++ %Args%
Rem g++ 603-Init-List.cpp
Rem g++ 601-11.cpp
Echo End Compile
