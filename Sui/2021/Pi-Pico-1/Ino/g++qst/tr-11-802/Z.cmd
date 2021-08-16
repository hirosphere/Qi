@Echo Off
Cls

Rem   Set Args=-o s.exe Fields-qst.cpp  arduino.cpp  ../src/field.cpp    -I../lib -I../g++test
Rem   Set Args=-o s.exe String-qst.cpp   arduino.cpp  ../src/field.cpp    -I../lib -I../g++test
Rem   Set Args=-o s.exe Buffer-qst.cpp    arduino.cpp  ../src/field.cpp ../src/Power.cpp   -I../lib -I../g++test

Set Args=-o a.exe field-prof-qst.cpp


Echo -
Echo Begin Compile --  g++ %Args%
Echo -

g++ %Args%
Echo End Compile
