import React, { useState } from 'react';
import './QuotationDisplay.css';
import './QuotationDisplayPrint.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const notes = [
  'This quotation includes camera setup, DVR rack, installation, wiring (~200m), and full configuration.',
  'Brand: Hikvision (Original Products)',
  'Validity: 14 days from the quotation date.',
  'Prices may vary slightly based on actual site conditions.'
];

const QuotationDisplay = ({ quotation }) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  // Ref for the quotation display element
  const quotationRef = React.createRef();

  if (!quotation) return null;

  const currencySymbol = {
    LKR: 'LKR', // Assuming 'Rs' might cause issues in some fonts in PDF
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: '$',
    CAD: '$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: '$',
    SGD: '$',
    HKD: '$',
    NOK: 'kr',
    KRW: '₩',
    TRY: '₺',
    RUB: '₽',
    BRL: 'R$',
    ZAR: 'R',
    // Add symbols for other currencies added in the form if needed
  }[quotation.currency] || quotation.currency;

  const getTotal = (item) => item.quantity * item.unitPrice;
  const grandTotal = quotation.items.reduce((sum, item) => sum + getTotal(item), 0);

   const generatePdf = () => {
        setShowDownloadMenu(false);
        if (quotationRef.current) {
            html2canvas(quotationRef.current, {
                scale: 2, // Increase scale for better resolution
                logging: true, // Enable logging for debugging
                useCORS: true // Enable CORS if images are from external sources
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait', // or 'landscape'
                    unit: 'px', // unit of measurement
                    format: [canvas.width, canvas.height] // page size
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`quotation-${quotation.customerName || 'document'}.pdf`);
            }).catch(err => {
                console.error('Error generating PDF:', err);
                alert('Could not generate PDF.');
            });
        }
    };

  // Download handlers
  const handleDownload = (type) => {
    if (type === 'PDF') {
        generatePdf();
    } else if (type === 'Excel') {
        setShowDownloadMenu(false);
        alert('Download as Excel coming soon!');
        // TODO: Implement Excel download logic
    } else if (type === 'Word') {
        setShowDownloadMenu(false);
        alert('Download as Word coming soon!');
        // TODO: Implement Word download logic
    }
  };

  return (
    <div className="quotation-display" ref={quotationRef}> {/* Attach ref to the element to capture */}
      <div className="quotation-header-flex">
        {quotation.logo && (
          <div className="logo-container">
            <img src={quotation.logo} alt="Shop Logo" className="shop-logo" />
          </div>
        )}
        <div className="quotation-header-content">
          <h2 style={{ color: '#ffffff', marginBottom: '0.4rem' }}>{quotation.shopName}</h2>
          <div style={{ marginBottom: '1rem', color: '#e3f2fd' }}>
            <div>{quotation.shopAddress}</div>
            <div>Contact: {quotation.shopContact}</div>
          </div>
        </div>
      </div>
      <h3 style={{ color: '#495057', textAlign: 'center', marginBottom: '2rem' }}>CCTV System Quotation</h3>
      <div style={{ marginBottom: '1rem' }}>
        <div><strong>Date:</strong> {quotation.date}</div>
        <div><strong>Client:</strong> {quotation.customerName}</div>
        <div><strong>Location:</strong> {quotation.location}</div>
      </div>
      <table className="quotation-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Item Description</th>
            <th>Quantity</th>
            <th>Unit Price ({currencySymbol})</th>
            <th>Total ({currencySymbol})</th>
          </tr>
        </thead>
        <tbody>
          {quotation.items.map((item, idx) => (
            <tr key={item.key}>
              <td>{idx + 1}</td>
              <td>{item.label}</td>
              <td>{item.quantity}</td>
              <td>{item.unitPrice.toLocaleString()}</td>
              <td>{getTotal(item).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total</td>
            <td style={{ fontWeight: 'bold' }}>{grandTotal.toLocaleString()} {currencySymbol}</td>
          </tr>
        </tfoot>
      </table>
      <div className="quotation-notes">
        <strong>Note:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{quotation.notes}</pre>
      </div>
      <div className="quotation-footer">
        {quotation.footerText}
      </div>
      <div className="download-group">
        <button
          className="download-button"
          onClick={() => setShowDownloadMenu((v) => !v)}
          type="button"
        >
          Download ▼
        </button>
        {showDownloadMenu && (
          <div className="download-menu">
            <button onClick={() => handleDownload('PDF')}>PDF</button>
            <button onClick={() => handleDownload('Excel')}>Excel</button>
            <button onClick={() => handleDownload('Word')}>Word</button>
          </div>
        )}
      </div>
      <button className="print-button" onClick={() => window.print()}>
        Print Quotation
      </button>
    </div>
  );
};

export default QuotationDisplay; 