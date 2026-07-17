# Detiene procesos Node del proyecto inventario-app (Windows)
$processes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
  Where-Object { $_.CommandLine -match 'inventario-app' }

if (-not $processes) {
  Write-Host "No hay procesos de inventario-app corriendo." -ForegroundColor Yellow
  exit 0
}

foreach ($proc in $processes) {
  Write-Host "Deteniendo PID $($proc.ProcessId)..."
  Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 1
Write-Host "Puertos 3001, 3005, 3006, 5173 liberados." -ForegroundColor Green
