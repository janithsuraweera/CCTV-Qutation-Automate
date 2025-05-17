// QuotationForm.js (Updated - Corrected Import)
import React, { useState } from 'react';
import './QuotationForm.css';
import { MdStorefront, MdPerson, MdLocationOn, MdCalendarToday, MdAttachMoney, MdAdd, MdDelete, MdNotes, MdTextFields } from 'react-icons/md';
import { BiImage } from 'react-icons/bi';

const defaultItems = [
    { key: 'camera', label: 'Hikvision Analog CCTV Camera (2MP)', quantity: 8, unitPrice: 6000 },
    { key: 'dvr', label: '4/8 Channel DVR', quantity: 1, unitPrice: 12000 },
    { key: 'hdd', label: '1TB Surveillance Hard Disk', quantity: 1, unitPrice: 10000 },
    { key: 'adapters', label: 'Power Adapters + Connectors', quantity: 8, unitPrice: 500 },
    { key: 'cables', label: 'CCTV Cables + Accessories (~200m)', quantity: 1, unitPrice: 20000 },
    { key: 'rack', label: 'DVR Rack with Cooling Fan', quantity: 1, unitPrice: 5000 },
    { key: 'installation', label: 'Installation & Configuration (Full System)', quantity: 1, unitPrice: 15000 },
];

const currencyOptions = [
    { code: 'LKR', symbol: 'LKR' },
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
];

const defaultNotes = `- This quotation includes camera setup, DVR rack, installation, wiring (~200m), and full configuration.\n- Brand: Hikvision (Original Products)\n- Validity: 14 days from the quotation date.\n- Prices may vary slightly based on actual site conditions.`;
const defaultFooter = 'Thank you for your business!';

const QuotationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        shopName: '',
        shopAddress: '',
        shopContact: '',
        logo: '',
        customerName: '',
        location: '',
        date: new Date().toISOString().slice(0, 10),
        currency: 'LKR',
        items: defaultItems,
        notes: defaultNotes,
        footerText: defaultFooter,
    });

    const [newItem, setNewItem] = useState({ label: '', quantity: 1, unitPrice: 0 });
    const [errors, setErrors] = useState({});

    const validatePhone = (value) => {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Phone number is required.';
        if (digits.length < 10) return 'Phone number must be at least 10 digits.';
        if (!/^\d+$/.test(digits)) return 'Phone number must contain only numbers.';
        return '';
    };

    const validateNumber = (value, fieldName = 'Value') => {
        if (value === '' || value === null) return `${fieldName} is required.`;
        if (isNaN(value) || Number(value) < 0) return `${fieldName} must be a positive number.`;
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'shopContact') {
            setErrors(prev => ({ ...prev, shopContact: validatePhone(value) }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleItemChange = (idx, field, value) => {
        setFormData(prev => {
            const items = prev.items.map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
            );
            return { ...prev, items };
        });
        if (field === 'quantity' || field === 'unitPrice') {
            setErrors(prev => ({
                ...prev,
                [`item-${idx}-${field}`]: validateNumber(value, field === 'quantity' ? 'Quantity' : 'Unit Price')
            }));
        }
    };

    const handleRemoveItem = (idx) => {
        setFormData(prev => {
            const items = prev.items.filter((_, i) => i !== idx);
            return { ...prev, items };
        });
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
        if (name === 'quantity' || name === 'unitPrice') {
            setErrors(prev => ({
                ...prev,
                [`newItem-${name}`]: validateNumber(value, name === 'quantity' ? 'Quantity' : 'Unit Price')
            }));
        }
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        const quantityError = validateNumber(newItem.quantity, 'Quantity');
        const priceError = validateNumber(newItem.unitPrice, 'Unit Price');
        if (!newItem.label.trim() || quantityError || priceError) {
            setErrors(prev => ({
                ...prev,
                'newItem-quantity': quantityError,
                'newItem-unitPrice': priceError,
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { ...newItem, key: `${newItem.label}-${Date.now()}` }
            ]
        }));
        setNewItem({ label: '', quantity: 1, unitPrice: 0 });
        setErrors(prev => ({ ...prev, 'newItem-quantity': '', 'newItem-unitPrice': '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const phoneError = validatePhone(formData.shopContact);
        let itemErrors = {};
        formData.items.forEach((item, idx) => {
            itemErrors[`item-${idx}-quantity`] = validateNumber(item.quantity, 'Quantity');
            itemErrors[`item-${idx}-unitPrice`] = validateNumber(item.unitPrice, 'Unit Price');
        });
        setErrors({ shopContact: phoneError, ...itemErrors });
        const hasErrors = phoneError || Object.values(itemErrors).some(Boolean);
        if (hasErrors) return;
        onSubmit(formData);
    };

    return (
        <div className="quotation-form">
            <h2>📝 CCTV System Quotation Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-section-title"><MdStorefront className="icon" /> Shop Information</div>
                    <div className="form-group">
                        <label><MdTextFields className="icon" /> Shop Name:</label>
                        <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} required placeholder="e.g. ABC Electronics" />
                    </div>
                    <div className="form-group">
                        <label><MdLocationOn className="icon" /> Shop Address:</label>
                        <input type="text" name="shopAddress" value={formData.shopAddress} onChange={handleChange} required placeholder="e.g. 123 Main St, Colombo" />
                    </div>
                    <div className="form-group">
                        <label><MdPerson className="icon" /> Shop Contact <span title="Only numbers, at least 10 digits">📞</span>:</label>
                        <input type="text" name="shopContact" value={formData.shopContact} onChange={handleChange} required maxLength={15} pattern="[0-9]*" inputMode="numeric" placeholder="e.g. 0771234567" />
                        {errors.shopContact && <span className="helper-text" style={{ color: '#e74c3c' }}>{errors.shopContact}</span>}
                    </div>
                    <div className="form-group">
                        <label><BiImage className="icon" /> Shop Logo <span title="Upload your shop logo">🖼️</span>:</label>
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                        {formData.logo && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img src={formData.logo} alt="Shop Logo Preview" style={{ maxHeight: 60, maxWidth: 180, objectFit: 'contain', border: '1px solid #eee', borderRadius: 4 }} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-section">
                    <div className="form-section-title"><MdPerson className="icon" /> Customer Information</div>
                    <div className="form-group">
                        <label><MdPerson className="icon" /> Customer Name:</label>
                        <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="e.g. John Doe" />
                    </div>
                    <div className="form-group">
                        <label><MdLocationOn className="icon" /> Location <span title="Customer's location">📍</span>:</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Galle" />
                    </div>
                    <div className="form-group">
                        <label><MdCalendarToday className="icon" /> Date <span title="Quotation date">📅</span>:</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-section">
                    <div className="form-section-title"><MdAttachMoney className="icon" /> Quotation Items</div>
                    <div className="form-group">
                        <label><MdAttachMoney className="icon" /> Currency <span title="Quotation currency">💱</span>:</label>
                        <select name="currency" value={formData.currency} onChange={handleChange}>
                            {currencyOptions.map(opt => (
                                <option key={opt.code} value={opt.code}>{opt.symbol} ({opt.code})</option>
                            ))}
                        </select>
                    </div>
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Item Description</th>
                                <th>Quantity</th>
                                <th>Unit Price ({formData.currency})</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, idx) => (
                                <tr key={item.key}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.label}
                                            onChange={e => handleItemChange(idx, 'label', e.target.value)}
                                            required
                                            placeholder="Item description"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                                            required
                                            placeholder="Qty"
                                        />
                                        {errors[`item-${idx}-quantity`] && <span className="helper-text" style={{ color: '#e74c3c' }}>{errors[`item-${idx}-quantity`]}</span>}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.unitPrice}
                                            onChange={e => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                                            required
                                            placeholder="Unit price"
                                        />
                                        {errors[`item-${idx}-unitPrice`] && <span className="helper-text" style={{ color: '#e74c3c' }}>{errors[`item-${idx}-unitPrice`]}</span>}
                                    </td>
                                    <td>
                                        <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem(idx)} title="Remove Item"><MdDelete /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form className="add-item-row" onSubmit={handleAddItem}>
                        <input
                            type="text"
                            name="label"
                            value={newItem.label}
                            onChange={handleNewItemChange}
                            placeholder="New item description"
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            value={newItem.quantity}
                            onChange={handleNewItemChange}
                            placeholder="Qty"
                            required
                        />
                        <input
                            type="number"
                            name="unitPrice"
                            min="0"
                            value={newItem.unitPrice}
                            onChange={handleNewItemChange}
                            placeholder="Unit price"
                            required
                        />
                        <button type="submit" className="add-item-btn"><MdAdd /> Add Item</button>
                    </form>
                </div>
                <div className="form-section">
                    <div className="form-section-title"><MdNotes className="icon" /> Notes & Footer</div>
                    <div className="form-group">
                        <label><MdNotes className="icon" /> Notes <span title="Special notes for the quotation">💡</span>:</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows="5" placeholder="Add any special notes here..." />
                    </div>
                    <div className="form-group">
                        <label><MdTextFields className="icon" /> Footer Text <span title="Footer message">🎉</span>:</label>
                        <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} placeholder="e.g. Thank you for your business!" />
                    </div>
                </div>
                <button type="submit" className="submit-button">🚀 Generate Quotation</button>
            </form>
        </div>
    );
};

export default QuotationForm;