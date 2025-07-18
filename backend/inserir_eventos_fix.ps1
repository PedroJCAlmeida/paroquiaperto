# Script para inserir apenas os eventos que faltam
# Executar com: .\inserir_eventos_fix.ps1

$baseUrl = "http://localhost:9090/api"

function Invoke-PostRequest {
    param (
        [string]$Url,
        [string]$Body
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Post -ContentType "application/json; charset=utf-8" -Body $Body -Encoding UTF8
        Write-Host "Sucesso: $($response.titulo) - ID: $($response.id)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Erro ao inserir dados em $Url" -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Corpo da requisição: $Body" -ForegroundColor Yellow
        return $false
    }
}

# Eventos para inserir
$eventos = @(
    @{
        titulo = "Festa de Nossa Senhora de Fátima"
        descricao = "Celebração anual em honra de Nossa Senhora de Fátima com procissão e festa popular."
        dataHoraInicio = "2025-05-13T15:00:00"
        dataHoraFim = $null
        local = "Adro da Igreja"
        imagemUrl = $null
        paroquiaId = 1
    },
    @{
        titulo = "Catequese para Crianças"
        descricao = "Encontros semanais de catequese para preparação dos sacramentos."
        dataHoraInicio = "2025-07-26T14:00:00"
        dataHoraFim = $null
        local = "Salão Paroquial"
        imagemUrl = $null
        paroquiaId = 1
    },
    @{
        titulo = "Festa do Sagrado Coração"
        descricao = "Festa tradicional com missa solene e atividades culturais."
        dataHoraInicio = "2025-06-28T16:00:00"
        dataHoraFim = $null
        local = "Igreja e Jardins"
        imagemUrl = $null
        paroquiaId = 2
    },
    @{
        titulo = "Grupo de Jovens"
        descricao = "Encontro mensal do grupo de jovens da paróquia."
        dataHoraInicio = "2025-07-25T19:30:00"
        dataHoraFim = $null
        local = "Centro Paroquial"
        imagemUrl = $null
        paroquiaId = 2
    },
    @{
        titulo = "Festa de São João"
        descricao = "Celebração tradicional de São João com fogueira e sardinhas."
        dataHoraInicio = "2025-06-24T20:00:00"
        dataHoraFim = $null
        local = "Largo da Igreja"
        imagemUrl = $null
        paroquiaId = 3
    },
    @{
        titulo = "Conferência sobre História Local"
        descricao = "Palestra sobre a história da paróquia e da cidade de Braga."
        dataHoraInicio = "2025-08-15T18:00:00"
        dataHoraFim = $null
        local = "Auditório Paroquial"
        imagemUrl = $null
        paroquiaId = 3
    },
    @{
        titulo = "Retiro Universitário"
        descricao = "Retiro espiritual destinado aos estudantes universitários."
        dataHoraInicio = "2025-09-15T09:00:00"
        dataHoraFim = $null
        local = "Casa de Retiros"
        imagemUrl = $null
        paroquiaId = 4
    },
    @{
        titulo = "Feira do Livro Religioso"
        descricao = "Exposição e venda de livros religiosos e de espiritualidade."
        dataHoraInicio = "2025-10-12T10:00:00"
        dataHoraFim = $null
        local = "Átrio da Igreja"
        imagemUrl = $null
        paroquiaId = 4
    },
    @{
        titulo = "Encontro de Casais"
        descricao = "Encontro mensal para casais da comunidade paroquial."
        dataHoraInicio = "2025-07-30T20:00:00"
        dataHoraFim = $null
        local = "Salão de Festas"
        imagemUrl = $null
        paroquiaId = 5
    },
    @{
        titulo = "Bazar Beneficente"
        descricao = "Bazar anual para angariação de fundos para obras sociais."
        dataHoraInicio = "2025-11-20T14:00:00"
        dataHoraFim = $null
        local = "Pavilhão Paroquial"
        imagemUrl = $null
        paroquiaId = 5
    }
)

Write-Host "Inserindo eventos corrigidos..." -ForegroundColor Yellow
$sucessos = 0

foreach ($evento in $eventos) {
    $eventoJson = $evento | ConvertTo-Json -Depth 10
    
    Write-Host "Inserindo: $($evento.titulo)"
    $resultado = Invoke-PostRequest -Url "$baseUrl/eventos" -Body $eventoJson
    
    if ($resultado) {
        $sucessos++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Inserção concluída! $sucessos de $($eventos.Count) eventos inseridos com sucesso." -ForegroundColor Cyan

# Verificar total
try {
    $totalEventos = Invoke-RestMethod -Uri "$baseUrl/eventos" -Method GET
    Write-Host "Total de eventos na base de dados: $($totalEventos.Count)" -ForegroundColor Green
} catch {
    Write-Host "Erro ao verificar total de eventos" -ForegroundColor Red
}
