import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"
import App from './App.jsx'
import "normalize.css"
import './index.css'
import ErrorPage from './error-page.jsx'
import Guide from './guide.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="guide" element={<Guide />} />

      {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
