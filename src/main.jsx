import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Инициализация Telegram Web App при открытии внутри Telegram
try {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand()
    window.Telegram.WebApp.ready()
  }
} catch (_) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
