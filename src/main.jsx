import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PopupProvider } from './Components/PopupContext.jsx'
import App from './App.jsx'
import './Styles/index.css'



createRoot(document.getElementById('root')).render(
    <StrictMode>
        <PopupProvider>
            <App />
        </PopupProvider>
    </StrictMode>,
)
