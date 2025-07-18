@echo off
echo ====================================
echo  Paroquia Perto - Backend Local
echo ====================================
echo.
echo Iniciando backend com perfil local...
echo Base de dados: PostgreSQL Local
echo Porta: 9090
echo.

cd /d "%~dp0"
java -jar -Dspring.profiles.active=local "target\backend-1.0.0.jar"

pause
