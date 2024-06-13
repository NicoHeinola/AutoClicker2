[Setup]
AppName=AutoClicker2
AppVersion=1.0
DefaultDirName=C:\AutoClicker2
DefaultGroupName=AutoClicker2
OutputDir=.\build
OutputBaseFilename=AutoClicker2Setup
Compression=lzma
SolidCompression=yes
SetupIconFile=C:\Users\NH\Desktop\Codes\Pythons\AutoClicker2\icon.ico

[Files]
Source: ".\build\AutoClicker2\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\AutoClicker2"; Filename: "{app}\AutoClicker2.exe"; IconFilename: "{app}\icon.ico"
Name: "{group}\{cm:UninstallProgram,AutoClicker2}"; Filename: "{uninstallexe}"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\*"