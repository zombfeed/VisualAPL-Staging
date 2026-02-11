import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FlowWithProvider from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter basename={"/VisualAPL/"}> */}
      <FlowWithProvider />
    {/* </BrowserRouter> */}
  </StrictMode>,
)
