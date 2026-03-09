import './index.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import AssessmentModal from './components/ui/AssessmentModal';
import Navbar from './components/ui/Navbar';
import Footer from './components/sections/Footer';
import Home from './pages/Home';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import CommunityPage from './pages/CommunityPage';
import PricingPage from './pages/PricingPage';

export default function App() {
  return (
    <HashRouter>
      <ModalProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>
        <Footer />
        <AssessmentModal />
      </ModalProvider>
    </HashRouter>
  );
}
