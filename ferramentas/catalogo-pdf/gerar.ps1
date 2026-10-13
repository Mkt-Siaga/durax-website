# Gera assets/catalogo/catalogo-durax-2026.pdf a partir de catalogo.html (dados de js/catalogo.js)
# e atualiza em js/catalogo.js a página de cada produto (link "Ver no catálogo" do site).
# Uso:  powershell -ExecutionPolicy Bypass -File ferramentas\catalogo-pdf\gerar.ps1
param([switch]$SoPdf)
$ErrorActionPreference = 'Continue'  # o Edge escreve avisos no stderr; não são erros
$raiz = (Resolve-Path "$PSScriptRoot\..\..").Path
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | ? { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Microsoft Edge não encontrado' }
$url = 'file:///' + ("$raiz\ferramentas\catalogo-pdf\catalogo.html" -replace '\\', '/')
$saida = "$raiz\assets\catalogo\catalogo-durax-2026.pdf"
$tmp = Join-Path $env:TEMP 'durax-catalogo'; New-Item -ItemType Directory -Force $tmp | Out-Null
$flags = @('--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files', '--virtual-time-budget=30000', "--user-data-dir=$tmp\perfil")

# 1) Mapa item -> página (mesmo motor e mesma paginação do PDF)
if (-not $SoPdf) {
  $dom = & $edge @flags --dump-dom $url 2>$null | Out-String
  $m = [regex]::Match($dom, '<script type="application/json" id="mapa">(.*?)</script>', 'Singleline')
  if (-not $m.Success) { throw 'Não consegui ler o mapa de páginas (o catálogo não terminou de montar?)' }
  $mapa = $m.Groups[1].Value | ConvertFrom-Json
  $utf8 = New-Object Text.UTF8Encoding $false
  $js = [IO.File]::ReadAllText("$raiz\js\catalogo.js", $utf8)
  $i = $js.IndexOf('DURAX_CATALOGO = ') + 17
  $cab = $js.Substring(0, $i); $resto = $js.Substring($i)
  # troca as páginas item a item, na ordem do arquivo (cada item aparece uma vez por categoria)
  $pos = 0; $n = 0
  foreach ($it in $mapa.itens) {
    $chave = '{"name":' + ($it.name | ConvertTo-Json) + ','
    $k = $resto.IndexOf($chave, $pos); if ($k -lt 0) { Write-Warning "não achei: $($it.name)"; continue }
    $ini = $resto.IndexOf('"pages":[', $k) + 9; $fim = $resto.IndexOf(']', $ini)
    $resto = $resto.Substring(0, $ini) + $it.page + $resto.Substring($fim); $pos = $ini; $n++
  }
  $cab = $cab -replace 'Catálogo Durax 2026 \(PDF, \d+ págs\.\)', "Catálogo Durax 2026 (PDF, $($mapa.total) págs.)"
  [IO.File]::WriteAllText("$raiz\js\catalogo.js", $cab + $resto, $utf8)
  "páginas atualizadas: $n itens · PDF com $($mapa.total) páginas"
}

# 2) PDF
& $edge @flags "--print-to-pdf=$saida" $url 2>$null | Out-Null
Start-Sleep 2
"PDF: $saida ({0:N1} MB)" -f ((Get-Item $saida).Length / 1MB)
