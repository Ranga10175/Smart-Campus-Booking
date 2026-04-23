$ErrorActionPreference = "Stop"

$port = 8090

Write-Host "Checking port $port..." -ForegroundColor Cyan

$lines = netstat -ano | Select-String ":$port\s+.*LISTENING\s+\d+$" | ForEach-Object { $_.ToString() }
$pids = @()

foreach ($line in $lines) {
  $parts = ($line -split "\s+") | Where-Object { $_ -ne "" }
  $processId = $parts[-1]
  if ($processId -match "^\d+$") {
    $pids += [int]$processId
  }
}

$pids = $pids | Sort-Object -Unique

if ($pids.Count -gt 0) {
  Write-Host "Port $port is in use by PID(s): $($pids -join ', '). Stopping..." -ForegroundColor Yellow
  foreach ($processId in $pids) {
    try {
      taskkill /PID $processId /F | Out-Null
      Write-Host "Stopped PID $processId" -ForegroundColor Green
    } catch {
      Write-Host "Failed to stop PID ${processId}: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
} else {
  Write-Host "Port $port is free." -ForegroundColor Green
}

Write-Host "Starting backend on port $port..." -ForegroundColor Cyan
./mvnw -DskipTests spring-boot:run

