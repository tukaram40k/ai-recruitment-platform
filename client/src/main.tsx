import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router'
import './index.css'
import App from './components/App.tsx'
import LoginSelector from "./components/auth/LoginSelector.tsx";
import Placeholder from "./components/Placeholder.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import SignupPage from "./components/auth/SignupPage.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<LoginSelector />} />
      <Route path='/login/candidate' element={<LoginPage user_role="candidate"/>} />
      <Route path='/login/recruiter' element={<LoginPage user_role="recruiter"/>} />
      <Route path='/signup/candidate' element={<SignupPage user_role="candidate"/>} />
      <Route path='/signup/recruiter' element={<SignupPage user_role="recruiter"/>} />
      <Route path='/placeholder' element={<Placeholder />} />
    </Routes>
  </BrowserRouter>,
)
