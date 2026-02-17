# Как запушить проект на GitHub

## Проблема: "this directory does not appear to be a git repository"

Эта ошибка означает, что Git не инициализирован в папке проекта.

---

## Решение

### Вариант 1: Автоматическая инициализация (рекомендуется)

1. **Установите Git** (если ещё не установлен):
   - Скачайте: https://git-scm.com/download/win
   - Установите с настройками по умолчанию

2. **Запустите файл `ИНИЦИАЛИЗАЦИЯ_GIT.bat`** в папке проекта
   - Он проверит Git, инициализирует репозиторий и настроит подключение к GitHub

3. **Затем запустите `БЫСТРЫЙ_ПУШ.bat`** для пуша на GitHub

---

### Вариант 2: Через GitHub Desktop (проще, без командной строки)

1. **Установите GitHub Desktop**: https://desktop.github.com/
   - Он автоматически установит Git

2. **В GitHub Desktop**:
   - **File** → **Add Local Repository**
   - Выберите папку: `f:\WebGamePrototype`
   - Если появится ошибка "not a git repository":
     - Нажмите **"create a repository"** или
     - В терминале GitHub Desktop выполните: `git init`

3. **Опубликуйте репозиторий**:
   - Нажмите **Publish repository**
   - Выберите: `EndlessCow/EndlessCow.github.io-WebGamePrototype`
   - Нажмите **Publish**

---

### Вариант 3: Вручную в терминале

Если Git установлен, выполните в терминале (PowerShell или CMD):

```bash
cd f:\WebGamePrototype

# Инициализация
git init

# Настройка пользователя (если ещё не настроено)
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"

# Настройка удалённого репозитория
git remote add origin https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype.git

# Добавление файлов
git add .

# Коммит
git commit -m "Initial commit"

# Пуш
git push -u origin main
```

---

## После пуша

1. Откройте: https://github.com/EndlessCow/EndlessCow.github.io-WebGamePrototype
2. **Settings** → **Pages** → **Source: GitHub Actions**
3. Дождитесь деплоя в **Actions**
4. Игра будет доступна: https://endlesscow.github.io/EndlessCow.github.io-WebGamePrototype/
