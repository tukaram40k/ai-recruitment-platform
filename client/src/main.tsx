import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router'
import './index.css'
import App from './components/App.tsx'
import LoginSelector from "./components/auth/LoginSelector.tsx";
import Placeholder from "./components/Placeholder.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<LoginSelector />} />
      <Route path='/login/candidate' element={<LoginPage />} />
      <Route path='/login/recruiter' element={<LoginPage />} />
      <Route path='/placeholder' element={<Placeholder />} />
    </Routes>
  </BrowserRouter>,
)
