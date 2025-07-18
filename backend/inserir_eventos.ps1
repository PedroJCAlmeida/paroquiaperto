# Script PowerShell simplificado para testar apenas os eventos
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
        Write-Host "Sucesso: $($Body.titulo)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Erro ao inserir evento: $($Body.titulo)" -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "Inserindo eventos com campos corretos..." -ForegroundColor Yellow

# Eventos com estrutura correta do EventoDTO
$eventos = @(
    @{
        titulo = "Festa de Nossa Senhora de Fatima"
        descricao = "Celebracao anual em honra de Nossa Senhora de Fatima com procissao e festa popular."
        dataHoraInicio = "2025-05-13T15:00:00"
        local = "Adro da Igreja"
        paroquiaId = 1
    },
    @{
        titulo = "Catequese para Criancas"
        descricao = "Encontros semanais de catequese para preparacao dos sacramentos."
        dataHoraInicio = "2025-07-26T14:00:00"
        local = "Salao Paroquial"
        paroquiaId = 1
    },
    @{
        titulo = "Festa do Sagrado Coracao"
        descricao = "Festa tradicional com missa solene e atividades culturais."
        dataHoraInicio = "2025-06-28T16:00:00"
        local = "Igreja e Jardins"
        paroquiaId = 2
    },
    @{
        titulo = "Grupo de Jovens"
        descricao = "Encontro mensal do grupo de jovens da paroquia."
        dataHoraInicio = "2025-07-25T19:30:00"
        local = "Centro Paroquial"
        paroquiaId = 2
    },
    @{
        titulo = "Festa de Sao Joao"
        descricao = "Celebracao tradicional de Sao Joao com fogueira e sardinhas."
        dataHoraInicio = "2025-06-24T20:00:00"
        local = "Largo da Igreja"
        paroquiaId = 3
    }
)

foreach ($evento in $eventos) {
    Write-Host "Inserindo evento: $($evento.titulo) - Paroquia ID: $($evento.paroquiaId)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/eventos" -Body $evento
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "Verificando resultado final..." -ForegroundColor Cyan

try {
    $paroquias = Invoke-RestMethod -Uri "$baseUrl/paroquias" -Method GET
    $missas = Invoke-RestMethod -Uri "$baseUrl/missas" -Method GET
    $eventos = Invoke-RestMethod -Uri "$baseUrl/eventos" -Method GET
    
    Write-Host "Total de paroquias: $($paroquias.Count)" -ForegroundColor Green
    Write-Host "Total de missas: $($missas.Count)" -ForegroundColor Green
    Write-Host "Total de eventos: $($eventos.Count)" -ForegroundColor Green
}
catch {
    Write-Host "Erro ao verificar dados: $($_.Exception.Message)" -ForegroundColor Red
}
