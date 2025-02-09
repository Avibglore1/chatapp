import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Context from './Components/examples/Context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    
    <Context></Context>
  </BrowserRouter>
)
