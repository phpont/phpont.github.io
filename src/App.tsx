import { Hero } from './hero/Hero';
import { ComplexityStatement } from './sections/ComplexityStatement';
import { OperationalSurfaces } from './sections/OperationalSurfaces';
import { SelectedEvidence } from './sections/SelectedEvidence';
import { ConfidentialRecord } from './sections/ConfidentialRecord';
import { ContactSection } from './sections/ContactSection';
import './styles/globals.css';

function App() {
  return (
    <>
      <div className="heroWrapper">
        <Hero />
      </div>
      <ComplexityStatement />
      <OperationalSurfaces />
      <SelectedEvidence />
      <ConfidentialRecord />
      <ContactSection />
    </>
  );
}

export default App;

