import { Routes, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Signup } from './pages/Signup';
import { OnboardingProgress } from './pages/OnboardingProgress';
import { Sobre } from './pages/Sobre';
import { Privacidade } from './pages/Privacidade';
import { Termos } from './pages/Termos';
import { ContactUs } from './pages/ContactUs';
import { Lgpd } from './pages/Lgpd';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<OnboardingProgress />} />
      <Route path="/about" element={<Sobre />} />
      <Route path="/privacy-policy" element={<Privacidade />} />
      <Route path="/terms-and-conditions" element={<Termos />} />
      <Route path="/data-protection" element={<Lgpd />} />
      <Route path="/contact-us" element={<ContactUs />} />
    </Routes>
  );
}

export default App;
