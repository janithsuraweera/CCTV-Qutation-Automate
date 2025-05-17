import { useState, useEffect } from 'react'
import './App.css'
import QuotationForm from './components/QuotationForm'
import QuotationDisplay from './components/QuotationDisplay'
import Navbar from './components/Navbar'

function App() {
  const [quotation, setQuotation] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleQuotationSubmit = (formData) => {
    setQuotation({
      ...formData,
      cameraOptions: [
        { id: 'dome', name: 'Dome Camera', price: 150 },
        { id: 'bullet', name: 'Bullet Camera', price: 180 },
        { id: 'ptz', name: 'PTZ Camera', price: 350 },
        { id: 'thermal', name: 'Thermal Camera', price: 500 },
      ]
    });
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <header className="app-header">
        <h1>CCTV System Quotation Generator</h1>
      </header>
      <main className="app-main">
        <QuotationForm onSubmit={handleQuotationSubmit} />
        {quotation && <QuotationDisplay quotation={quotation} />}
      </main>
    </div>
  )
}

export default App
