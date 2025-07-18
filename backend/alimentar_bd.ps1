# Script PowerShell para alimentar a base de dados
# Certifique-se de que o backen# 3. Inserir Eventos
Write-Host "Inserindo Eventos..." -ForegroundColor Yellow

foreach ($evento in $dados.eventos) {
    # Criar objeto com estrutura correta do EventoDTO
    $eventoObj = @{
        titulo = $evento.nome
        descricao = $evento.descricao
        dataHoraInicio = $evento.dataHora
        local = $evento.local
        paroquiaId = $evento.paroquiaId
    }
    
    Write-Host "Inserindo evento: $($evento.nome) - Paroquia ID: $($evento.paroquiaId)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/eventos" -Body $eventoObj
}

$baseUrl = "http://localhost:9090/api"

# Função para fazer requisições POST
function Invoke-PostRequest {
    param(
        [string]$Url,
        [object]$Body
    )
    
    $jsonBody = $Body | ConvertTo-Json -Depth 10
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method POST -Body $jsonBody -Headers $headers
        Write-Host "Sucesso: $($response | ConvertTo-Json -Compress)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Erro ao inserir dados em $Url" -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Corpo da requisição: $jsonBody" -ForegroundColor Yellow
        return $null
    }
}

Write-Host "Iniciando alimentacao da base de dados..." -ForegroundColor Cyan
Write-Host ""

# Ler dados do arquivo JSON
$dadosPath = "c:\Users\jessi\ws-paroquia-perto\paroquiaperto\backend\dados_exemplo.json"
if (-not (Test-Path $dadosPath)) {
    Write-Host "Arquivo de dados nao encontrado: $dadosPath" -ForegroundColor Red
    exit 1
}

$dados = Get-Content $dadosPath | ConvertFrom-Json

# 1. Inserir Paróquias primeiro (pois missas e eventos dependem delas)
Write-Host "Inserindo Paroquias..." -ForegroundColor Yellow
$paroquiasInseridas = @()

foreach ($paroquia in $dados.paroquias) {
    Write-Host "Inserindo paróquia: $($paroquia.nome)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/paroquias" -Body $paroquia
    if ($resultado) {
        $paroquiasInseridas += $resultado
    }
}

Write-Host ""
Write-Host "Paroquias inseridas: $($paroquiasInseridas.Count)" -ForegroundColor Green
Write-Host ""

# Aguardar um pouco antes de inserir missas
Start-Sleep -Seconds 2

# 2. Inserir Missas
Write-Host "Inserindo Missas..." -ForegroundColor Yellow

foreach ($missa in $dados.missas) {
    # Criar objeto com estrutura esperada pelo controller
    $missaObj = @{
        horario = $missa.horario
        descricao = $missa.descricao
        paroquia = @{
            id = $missa.paroquiaId
        }
    }
    
    Write-Host "Inserindo missa: $($missa.descricao) - Paróquia ID: $($missa.paroquiaId)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/missas" -Body $missaObj
}

Write-Host ""

# Aguardar um pouco antes de inserir eventos
Start-Sleep -Seconds 2

# 3. Inserir Eventos
Write-Host "Inserindo Eventos..." -ForegroundColor Yellow

foreach ($evento in $dados.eventos) {
    # Criar objeto correto para o EventoDTO
    $eventoObj = @{
        titulo = $evento.nome
        descricao = $evento.descricao
        dataHoraInicio = $evento.dataHora
        dataHoraFim = $null
        local = $evento.local
        imagemUrl = $null
        paroquiaId = $evento.paroquiaId
    } | ConvertTo-Json -Depth 10
    
    Write-Host "Inserindo evento: $($evento.nome) - Paróquia ID: $($evento.paroquiaId)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/eventos" -Body $eventoObj
}

Write-Host ""
Write-Host "Alimentacao da base de dados concluida!" -ForegroundColor Cyan
Write-Host ""

# Verificar se os dados foram inseridos corretamente
Write-Host "Verificando dados inseridos..." -ForegroundColor Yellow

try {
    $paroquias = Invoke-RestMethod -Uri "$baseUrl/paroquias" -Method GET
    $missas = Invoke-RestMethod -Uri "$baseUrl/missas" -Method GET
    $eventos = Invoke-RestMethod -Uri "$baseUrl/eventos" -Method GET
    
    Write-Host "Total de paroquias na base: $($paroquias.Count)" -ForegroundColor Green
    Write-Host "Total de missas na base: $($missas.Count)" -ForegroundColor Green
    Write-Host "Total de eventos na base: $($eventos.Count)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Primeiras 3 paroquias inseridas:" -ForegroundColor Cyan
    $paroquias | Select-Object -First 3 | ForEach-Object {
        Write-Host "  - ID: $($_.id), Nome: $($_.nome)" -ForegroundColor White
    }
}
catch {
    Write-Host "Erro ao verificar dados: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Script concluido! Verifique o frontend para ver os dados." -ForegroundColor Green
