@echo off
REM Instala as skills BPM no diretório local do Hermes
REM Execute este script sempre que atualizar os SKILL.md do projeto

set HERMES_SKILLS=%USERPROFILE%\.hermes\skills\local

echo Instalando skills BPM...

xcopy /E /I /Y "skills\bpm-pre-reuniao" "%HERMES_SKILLS%\bpm-pre-reuniao"
xcopy /E /I /Y "skills\bpm-transcricao" "%HERMES_SKILLS%\bpm-transcricao"
xcopy /E /I /Y "skills\bpm-revisao" "%HERMES_SKILLS%\bpm-revisao"
xcopy /E /I /Y "skills\bpm-pipeline" "%HERMES_SKILLS%\bpm-pipeline"

echo.
echo Skills instaladas. Verificando...
hermes skills list

pause
