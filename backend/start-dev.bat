@echo off
echo ====================================
echo  Paroquia Perto - Backend DEV
echo ====================================
echo.
echo Iniciando backend com perfil de desenvolvimento...
echo Base de dados: H2 (em memória)
echo Porta: 9090
echo Console H2: http://localhost:9090/h2-console
echo.
echo Dados de conexão H2:
echo URL: jdbc:h2:mem:paroquiaperto
echo Username: sa
echo Password: (deixar vazio)
echo.

cd /d "%~dp0"
java -jar -Dspring.profiles.active=dev "target\backend-1.0.0.jar"

pause
