@echo off
echo ====================================
echo    Teste PostgreSQL Instalação
echo ====================================
echo.

REM Definir senha (altere aqui)
set PGPASSWORD=123456

echo Testando conexão PostgreSQL...
echo Senha atual definida: 123456
echo.

REM Testar conexão
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "SELECT version();"

if %errorlevel% == 0 (
    echo.
    echo ✅ PostgreSQL funcionando!
    echo.
    echo Criando base de dados 'paroquiaperto'...
    "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE paroquiaperto;"
    
    if %errorlevel% == 0 (
        echo ✅ Base de dados criada com sucesso!
    ) else (
        echo ⚠️  Base de dados já existe ou erro na criação
    )
) else (
    echo ❌ Erro na conexão. Verifique a senha.
    echo.
    echo Tente alterar a senha no início deste script.
)

echo.
pause
