# Fakestore Manager Fullstack

Менеджер товаров на React + TypeScript + Material UI + Redux Toolkit с локальным Node.js/Express API.

##Особенности

Material UI + Notistack для уведомлений
React Hook Form для добавления/редактирования
RTK Query для работы с API
Сортировка по цене и рейтингу

## Структура
- `frontend/` — React приложение
- `backend/` — Node.js + Express локальный сервер с JSON-хранилищем

## Запуск локально

### Backend
```bash
cd backend
npm install
npm run dev  
 # запускает сервер на http://localhost:3001

cd frontend
npm install
npm run dev  
 # запускает на http://localhost:5173

