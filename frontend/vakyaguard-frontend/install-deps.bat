@echo off
echo Installing VAKYAGUARD Frontend dependencies...
cd /d "%~dp0"
npm install --no-audit --no-fund
echo Installation complete!
pause