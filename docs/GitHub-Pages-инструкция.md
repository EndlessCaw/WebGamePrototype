# Залить игру на GitHub Pages — пошагово

## Что уже настроено в проекте

- В **vite.config.js** при сборке подставляется правильный `base` (из имени репозитория).
- В **.github/workflows/deploy.yml** при каждом пуше в `main` или `master` запускается сборка и деплой на GitHub Pages.

Вам нужно только создать репозиторий, запушить код и один раз включить Pages.

---

## Шаг 1. Создать репозиторий на GitHub

1. Зайдите на [github.com](https://github.com) и войдите в аккаунт.
2. Нажмите **"+"** → **New repository**.
3. Укажите:
   - **Repository name:** например `WebGamePrototype` (или любое имя — от него будет зависеть адрес: `https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/`).
   - **Public**.
   - **НЕ** ставьте галочку "Add a README" (у вас уже есть проект).
4. Нажмите **Create repository**.

На следующей странице GitHub покажет команды для пуша. Они понадобятся в шаге 3.

---

## Шаг 2. Включить GitHub Pages (источник — GitHub Actions)

1. В созданном репозитории откройте **Settings** → в левом меню **Pages**.
2. В блоке **Build and deployment**:
   - **Source:** выберите **GitHub Actions**.
3. Сохранять ничего не нужно — просто запомните, что источник теперь **GitHub Actions**.

(Первый деплой появится после первого пуша и успешного запуска workflow.)

---

## Шаг 3. Запушить проект с компьютера

### Где открыть терминал?

**Вариант A — В Cursor (рекомендуется):**
- Нажмите **Ctrl+`** (обратная кавычка) или
- Меню: **Terminal** → **New Terminal**
- Терминал откроется внизу экрана в папке проекта

**Вариант B — В Windows:**
- Нажмите **Win+R**, введите `powershell`, нажмите Enter
- В PowerShell выполните: `cd f:\WebGamePrototype`

### Что выполнить в терминале

**Способ 1 — Через файл (проще):**
- Двойной клик на файл **`git-push.bat`** в папке проекта
- Следуйте инструкциям на экране

**Способ 2 — Вручную в терминале:**

Выполните команды **из папки вашего проекта** (`f:\WebGamePrototype`).

Инициализация git (если ещё не делали):

```bash
cd f:\WebGamePrototype
git init
```

Добавить удалённый репозиторий (подставьте **свой логин** и **имя репозитория**):

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git
```

Например:

```bash
git remote add origin https://github.com/misha/WebGamePrototype.git
```

Первый пуш:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

Если репозиторий создали с README и на GitHub уже есть коммиты, перед пушем может понадобиться:

```bash
git pull origin main --rebase
git push -u origin main
```

---

## Шаг 4. Дождаться деплоя

1. В репозитории откройте вкладку **Actions**.
2. Должен запуститься workflow **"Deploy to GitHub Pages"**. Дождитесь зелёной галочки (успешное выполнение).
3. После этого откройте **Settings** → **Pages**. Там будет написано что-то вроде: **"Your site is live at https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПО/"**.

---

## Шаг 5. Открыть игру

Перейдите по адресу:

**https://ВАШ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/**

Например: `https://misha.github.io/WebGamePrototype/`

Именно **этот URL** нужно указать в Telegram (BotFather → Menu Button → URL), чтобы открывать игру из бота на телефоне.

---

## Если что-то пошло не так

| Проблема | Что проверить |
|----------|----------------|
| Страница пустая или 404 | Убедитесь, что в Settings → Pages выбран источник **GitHub Actions**, а не "Deploy from a branch". Дождитесь успешного завершения workflow в Actions. |
| Ошибка в Actions | Откройте упавший workflow → шаг с ошибкой. Часто это `npm ci` (нет `package-lock.json`) — тогда в проекте выполните `npm install` и закоммитьте `package-lock.json`. |
| Неправильный base (битые ссылки/картинки) | В workflow уже задаётся `VITE_BASE_PATH: /${{ github.event.repository.name }}/`. Имя репозитория на GitHub должно совпадать с тем, что в URL (например `WebGamePrototype`). |

---

## Дальнейшие обновления

После любых изменений в коде достаточно сделать:

```bash
git add .
git commit -m "описание изменений"
git push origin main
```

Workflow снова запустится и обновит сайт на GitHub Pages через 1–2 минуты.
