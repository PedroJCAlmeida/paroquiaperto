# Script para inserir eventos em inglês (teste)
$baseUrl = "http://localhost:9090/api"

function Invoke-PostRequest {
    param (
        [string]$Url,
        [string]$Body
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Post -ContentType "application/json; charset=utf-8" -Body $Body
        Write-Host "Sucesso: $($response.titulo) - ID: $($response.id)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Eventos de teste em inglês
$eventos = @(
    @{
        titulo = "Christmas Festival"
        descricao = "Annual Christmas celebration with mass and community activities."
        dataHoraInicio = "2025-12-25T15:00:00"
        dataHoraFim = $null
        local = "Church Square"
        imagemUrl = $null
        paroquiaId = 1
    },
    @{
        titulo = "Youth Meeting"
        descricao = "Monthly meeting for parish youth group."
        dataHoraInicio = "2025-08-15T19:00:00"
        dataHoraFim = $null
        local = "Parish Hall"
        imagemUrl = $null
        paroquiaId = 2
    }
)

Write-Host "Inserindo eventos de teste..." -ForegroundColor Yellow

foreach ($evento in $eventos) {
    $eventoJson = $evento | ConvertTo-Json -Depth 10
    Write-Host "Inserindo: $($evento.titulo)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/eventos" -Body $eventoJson
}

# Verificar total
try {
    $totalEventos = Invoke-RestMethod -Uri "$baseUrl/eventos" -Method GET
    Write-Host "Total de eventos: $($totalEventos.Count)" -ForegroundColor Green
} catch {
    Write-Host "Erro ao verificar eventos" -ForegroundColor Red
}
