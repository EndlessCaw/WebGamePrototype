@echo off
chcp 65001 >nul
echo ========================================
echo  Добавление package-lock.json и пуш
echo ========================================
echo.

cd /d "%~dp0"

echo Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Git не установлен!
    pause
    exit /b 1
)

echo.
echo Добавление package-lock.json в git...
git add package-lock.json

echo.
echo Проверка статуса...
git status --short package-lock.json

echo.
echo Создание коммита...
git commit -m "Add package-lock.json for GitHub Actions"

echo.
echo Пуш на GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo Ошибка при пуше. Проверьте авторизацию.
) else (
    echo.
    echo ========================================
    echo  УСПЕХ! package-lock.json добавлен!
    echo ========================================
    echo.
    echo GitHub Actions теперь сможет собрать проект.
    echo Проверьте вкладку Actions в репозитории.
    echo.
)

pause
