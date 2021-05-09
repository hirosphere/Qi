@Echo Off
Cls

rem SET PATH "%PATH%;C:\Program Files (x86)\GnuWin32\bin"
rem Echo %PATH%

CD build
"C:\Program Files (x86)\GnuWin32\bin\make.exe" -j4
CD ..\
