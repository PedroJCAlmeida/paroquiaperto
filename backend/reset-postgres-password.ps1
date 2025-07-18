# Script para redefinir senha do PostgreSQL
# Execute como Administrador

Write-Host "=== Redefinir Senha PostgreSQL ===" -ForegroundColor Green
Write-Host

# Parar o serviço PostgreSQL
Write-Host "1. Parando serviço PostgreSQL..." -ForegroundColor Yellow
net stop postgresql-x64-17

# Iniciar PostgreSQL em modo single-user
Write-Host "2. Iniciando PostgreSQL em modo seguro..." -ForegroundColor Yellow
$pgPath = "C:\Program Files\PostgreSQL\17\bin"
$dataPath = "C:\Program Files\PostgreSQL\17\data"

# Criar script SQL para redefinir senha
@"
ALTER USER postgres PASSWORD 'postgres';
"@ | Out-File -FilePath "C:\temp\reset_password.sql" -Encoding UTF8

Write-Host "3. Redefinindo senha..." -ForegroundColor Yellow
& "$pgPath\postgres.exe" --single -D "$dataPath" postgres < "C:\temp\reset_password.sql"

# Reiniciar serviço
Write-Host "4. Reiniciando serviço..." -ForegroundColor Yellow
net start postgresql-x64-17

Write-Host "5. Senha redefinida para 'postgres'" -ForegroundColor Green
Write-Host "6. Testando conexão..." -ForegroundColor Yellow

# Testar conexão
$env:PGPASSWORD = "postgres"
& "$pgPath\psql.exe" -U postgres -c "SELECT version();"

Write-Host "Concluído!" -ForegroundColor Green
pause
