@echo off
chcp 65001 >nul
echo =======================================================
echo PREPARANDO ARQUIVOS PARA DEPLOY (NETLIFY)
echo =======================================================
echo.

if exist "OUT" (
    echo Limpando pasta OUT antiga...
    rmdir /s /q "OUT"
)
mkdir "OUT"

echo Copiando arquivos para a pasta OUT...
echo Por favor, aguarde...
robocopy "%~dp0." "%~dp0OUT" /E /XD "OUT" ".git" ".vscode" "node_modules" /XF "server.js" "start.bat" "prepara_deploy.bat" "package-lock.json" "*.log" >nul

echo.
echo =======================================================
echo SUCESSO! 
echo A pasta "OUT" foi criada na raiz do seu projeto com os 
echo arquivos prontos para o deploy.
echo. 
echo Agora basta arrastar a pasta "OUT" inteira para o Netlify!
echo =======================================================
pause
