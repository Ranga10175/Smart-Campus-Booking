@echo off
setlocal enabledelayedexpansion

set PORT=8090
echo Checking port %PORT%...

for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  echo Stopping PID %%p on port %PORT%...
  taskkill /PID %%p /F >NUL 2>&1
)

echo Starting backend...
call mvnw -DskipTests spring-boot:run

