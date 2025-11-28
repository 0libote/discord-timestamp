import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import DiscordTimestampGenerator from './DiscordTimestampGenerator'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <DiscordTimestampGenerator />
    </ThemeProvider>
  </React.StrictMode>,
)
