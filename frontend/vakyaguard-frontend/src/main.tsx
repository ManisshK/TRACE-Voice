import React from 'react'
import ReactDOM from 'react-dom/client'
import TraceApp from './TraceApp.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TraceApp />
  </React.StrictMode>,
)