@echo off
chcp 65001 >nul
echo ========================================
echo  Пуш проекта БЕЗ node_modules
echo ========================================
echo.
echo Этот скрипт добавит только нужные файлы,
echo исключая node_modules (12282+ файлов)
echo.

cd /d "%~dp0"

echo Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ОШИБКА] Git не установлен!
    echo Установите Git: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git найден!
echo.

REM Инициализация если нужно
if not exist .git (
    echo Инициализация git...
    git init
    
    echo.
    echo Настройка пользователя Git...
    git config user.name >nul 2>&1
    if errorlevel 1 (
        set /p GIT_NAME="Введите ваше имя для Git: "
        git config --global user.name "%GIT_NAME%"
    )
    
    git config user.email >nul 2>&1
    if errorlevel 1 (
        set /p GIT_EMAIL="Введите ваш email: "
        git config --global user.email "%GIT_EMAIL%"
    )
)

REM Настройка remote
echo Настройка репозитория...
git remote remove origin 2>nul
git remote add origin https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype.git

REM Добавление файлов (node_modules уже в .gitignore)
echo.
echo Добавление файлов (node_modules будет пропущен)...
git add .

REM Проверка что node_modules не добавлен
git status --porcelain | findstr /i "node_modules" >nul
if not errorlevel 1 (
    echo.
    echo [ПРЕДУПРЕЖДЕНИЕ] node_modules попал в индекс!
    echo Удаление из индекса...
    git rm -r --cached node_modules 2>nul
)

REM Коммит
echo.
echo Создание коммита...
git commit -m "Initial commit: Telegram dungeon raid game" 2>nul || git commit -m "Update game files"

REM Переименование ветки
echo.
echo Настройка ветки main...
git branch -M main 2>nul

REM Показываем что будет запушено
echo.
echo ========================================
echo  Файлы готовы к пушу:
echo ========================================
git ls-files | find /c /v ""
echo файлов будет запушено (без node_modules)
echo.

REM Пуш
echo ========================================
echo  Пуш на GitHub...
echo ========================================
echo.
echo ВАЖНО: Если попросит авторизацию:
echo   - Логин: ваш GitHub username
echo   - Пароль: Personal Access Token (НЕ обычный пароль!)
echo.
pause

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo  Ошибка при пуше
    echo ========================================
    echo.
    echo Возможные причины:
    echo   1. Нужна авторизация (см. инструкцию выше)
    echo   2. Репозиторий не существует на GitHub
    echo   3. Нет прав на запись
    echo.
) else (
    echo.
    echo ========================================
    echo  УСПЕХ! Код запушен на GitHub!
    echo ========================================
    echo.
    echo Следующие шаги:
    echo   1. Откройте: https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype
    echo   2. Settings → Pages → Source: GitHub Actions
    echo   3. Дождитесь деплоя в Actions
    echo   4. Игра: https://endlesscow.github.io/EndlessCow.github.io-WebGamePrototype/
    echo.
)

pause
