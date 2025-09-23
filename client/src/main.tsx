import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router'
import './index.css'
import App from './components/App.tsx'
import LoginPage from "./components/LoginPage.tsx";
import Placeholder from "./components/Placeholder.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/login/candidate' element={<Placeholder />} />
      <Route path='/login/recruiter' element={<Placeholder />} />
    </Routes>
  </BrowserRouter>,
)
