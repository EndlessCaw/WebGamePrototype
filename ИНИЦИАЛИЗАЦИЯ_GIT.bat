@echo off
chcp 65001 >nul
echo ========================================
echo  Инициализация Git репозитория
echo ========================================
echo.

cd /d "%~dp0"

echo Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ОШИБКА] Git не установлен!
    echo.
    echo Установите Git одним из способов:
    echo.
    echo 1. Git для Windows: https://git-scm.com/download/win
    echo    (После установки перезапустите этот файл)
    echo.
    echo 2. GitHub Desktop: https://desktop.github.com/
    echo    (GitHub Desktop включает Git автоматически)
    echo.
    pause
    exit /b 1
)

echo Git найден!
echo.

REM Проверка, инициализирован ли уже git
if exist .git (
    echo Репозиторий уже инициализирован.
    echo.
    git status
) else (
    echo Инициализация нового репозитория...
    git init
    
    echo.
    echo Настройка пользователя Git (если ещё не настроено)...
    git config user.name >nul 2>&1
    if errorlevel 1 (
        echo.
        set /p GIT_NAME="Введите ваше имя для Git: "
        git config --global user.name "%GIT_NAME%"
    )
    
    git config user.email >nul 2>&1
    if errorlevel 1 (
        echo.
        set /p GIT_EMAIL="Введите ваш email для Git: "
        git config --global user.email "%GIT_EMAIL%"
    )
    
    echo.
    echo Репозиторий инициализирован!
)

echo.
echo Настройка удалённого репозитория...
git remote remove origin 2>nul
git remote add origin https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype.git

echo.
echo Проверка подключения...
git remote -v

echo.
echo ========================================
echo  Готово!
echo ========================================
echo.
echo Теперь можно:
echo   1. Запустить БЫСТРЫЙ_ПУШ.bat для пуша на GitHub
echo   2. Или использовать GitHub Desktop для пуша
echo.
pause
