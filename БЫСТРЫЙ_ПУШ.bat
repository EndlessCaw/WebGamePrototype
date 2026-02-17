@echo off
chcp 65001 >nul
echo ========================================
echo  Быстрый пуш в EndlessCow.github.io-WebGamePrototype
echo ========================================
echo.

cd /d "%~dp0"

echo Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ОШИБКА] Git не установлен!
    echo.
    echo Установите Git с https://git-scm.com/download/win
    echo Или используйте GitHub Desktop: https://desktop.github.com/
    echo.
    pause
    exit /b 1
)

echo Git найден!
echo.

REM Инициализация
if not exist .git (
    echo Инициализация git...
    git init
)

REM Настройка remote
echo Настройка репозитория...
git remote remove origin 2>nul
git remote add origin https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype.git

REM Добавление файлов
echo.
echo Добавление файлов...
git add .

REM Коммит
echo.
echo Создание коммита...
git commit -m "Initial commit: Telegram dungeon raid game" 2>nul || git commit -m "Update game files"

REM Переименование ветки
echo.
echo Настройка ветки main...
git branch -M main 2>nul

REM Пуш
echo.
echo ========================================
echo  Пуш на GitHub...
echo ========================================
echo.
echo ВАЖНО: Если попросит авторизацию:
echo   - Логин: ваш GitHub username
echo   - Пароль: используйте Personal Access Token (НЕ обычный пароль!)
echo.
echo Как получить токен:
echo   1. GitHub.com → Settings → Developer settings
echo   2. Personal access tokens → Tokens (classic)
echo   3. Generate new token → выберите "repo" → Generate
echo   4. Скопируйте токен и используйте его как пароль
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
    echo   1. Нужна авторизация (см. инструкцию выше про токен)
    echo   2. Репозиторий не существует на GitHub
    echo   3. Нет прав на запись в репозиторий
    echo.
    echo Проверьте:
    echo   - Репозиторий создан: https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype
    echo   - Вы авторизованы в Git (git config --global user.name и user.email)
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
    echo   4. Игра будет доступна по адресу:
    echo      https://endlesscow.github.io/EndlessCow.github.io-WebGamePrototype/
    echo.
)

pause
