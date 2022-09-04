@Echo Off

Set Folder=Meh.22.1.B

Set Src=c:\W\Labo\%Folder%
Set Dest=C:\W\Github\Qi\Sui\2022\%Folder%

Cls
Echo Src : %Src%
Echo Dest : %Dest%

XCopy /e /y %Src% %dest%

Echo %date% %time%
