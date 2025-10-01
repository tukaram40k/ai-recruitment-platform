import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router'
import './index.css'
import App from './pages/App.tsx'
import LoginSelector from "./pages/auth/LoginSelector.tsx";
import Placeholder from "./pages/Placeholder.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import PersonalCabinet from "./pages/PersonalCabinet.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<LoginSelector />} />
      <Route path='/login/candidate' element={<LoginPage user_role="candidate"/>} />
      <Route path='/login/recruiter' element={<LoginPage user_role="recruiter"/>} />
      <Route path='/signup/candidate' element={<SignupPage user_role="candidate"/>} />
      <Route path='/signup/recruiter' element={<SignupPage user_role="recruiter"/>} />
      <Route path='/personal-cabinet' element={<PersonalCabinet user_role="candidate"/>} />
      <Route path='/personal-cabinet/recruiter' element={<PersonalCabinet user_role="recruiter"/>} />
      <Route path='/placeholder' element={<Placeholder />} />
    </Routes>
  </BrowserRouter>,
)
