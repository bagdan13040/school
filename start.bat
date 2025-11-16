@echo off
echo Starting SPS v2...

cd /d "%~dp0"

:: Проверка наличия Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Проверка наличия Python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Python not found! Please install Python from https://python.org/
    pause
    exit /b 1
)

:: Установка зависимостей Node.js если node_modules не существует
if not exist "node_modules\" (
    echo Installing Node.js dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error installing Node.js dependencies!
        pause
        exit /b 1
    )
)

:: Установка зависимостей Python если requirements.txt существует
if exist "ai_modul\requirements.txt" (
    echo Installing Python dependencies...
    cd ai_modul
    pip install -r requirements.txt
    cd ..
)

:: Запуск приложения
echo Starting the application...
node app.js

pause