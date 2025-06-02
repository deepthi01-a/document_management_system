@echo off
for /l %%i in (1,1,50) do (
    curl http://localhost:3000/health
    curl http://localhost:3000/api/documents
    curl http://localhost:3000/metrics
    timeout /t 1 /nobreak >nul
)
