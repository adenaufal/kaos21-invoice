import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileSpreadsheet, Printer, List, FilePlus } from 'lucide-react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const InvoiceForm = ({ onSave }) => {
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal;
  };

  const handleSave = () => {
    const invoiceData = {
      number: invoiceNumber,
      date: invoiceDate,
      customer: customerName,
      items: items,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
      createdAt: new Date().toISOString()
    };
    onSave(invoiceData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md print:shadow-none">
      <div className="border-b-2 border-gray-300 pb-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kaos21 Pekanbaru</h1>
            <p className="text-gray-600 mt-1">Jl. Soekarno-Hatta (Arengka 1) No. 28</p>
            <p className="text-gray-600">Pekanbaru, Riau</p>
            <p className="text-gray-600">Telp: 0812-3456-7890</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-gray-600 font-semibold mb-4">Bill To:</h3>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Nama Customer"
          />
          <textarea
            className="w-full p-2 border rounded h-24"
            placeholder="Alamat Customer"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nomor Invoice
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0000001/K21/241122"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Item</h2>
          <button
            onClick={addItem}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item
          </button>
        </div>

        <table className="w-full border-t border-b">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left">Deskripsi</th>
            <th className="py-3 px-4 text-center w-24">Qty</th>
            <th className="py-3 px-4 text-right w-32">Harga</th>
            <th className="py-3 px-4 text-right w-32">Total</th>
            <th className="py-3 px-4 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Deskripsi Item"
                />
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded text-center"
                  placeholder="Qty"
                  min="1"
                />
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border rounded text-right"
                  placeholder="Harga"
                />
              </td>
              <td className="py-3 px-4 text-right">
                Rp {(item.quantity * item.price).toLocaleString('id-ID')}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </div>
      </div>

        </tbody>
      </table>

      <div className="mt-8 border-t pt-8">
        <div className="flex flex-col items-end space-y-4">
          <div className="flex w-64 justify-between text-lg">
            <span className="font-medium text-gray-600">Subtotal:</span>
            <span>Rp {calculateSubtotal().toLocaleString('id-ID')}</span>
          </div>
          <div className="flex w-64 justify-between text-xl font-bold text-blue-600 border-t pt-4">
            <span>Total:</span>
            <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Catatan:</h4>
            <textarea
              className="w-full p-2 border rounded h-24"
              placeholder="Tambahkan catatan invoice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="mt-8 text-sm text-gray-600">
            <p>Terima kasih atas kepercayaan Anda berbelanja di Kaos21 Pekanbaru.</p>
            <p>Pembayaran dapat dilakukan melalui transfer ke:</p>
            <p className="font-medium mt-2">Bank BCA: 1234567890 a.n. Kaos21 Pekanbaru</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4 print:hidden">
        <button 
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Printer className="w-5 h-5 mr-2" />
          Cetak Invoice
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Save className="w-5 h-5 mr-2" />
          Simpan Invoice
        </button>
      </div>
    </div>
  );
};

const InvoiceList = ({ invoices, onExport }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Invoice</h2>
        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FileSpreadsheet className="w-5 h-5 mr-2" />
          Export ke Excel
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">No. Invoice</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{invoice.number}</td>
                <td className="px-4 py-2">{new Date(invoice.date).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-2">{invoice.customer}</td>
                <td className="px-4 py-2 text-right">
                  Rp {invoice.total.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InvoiceGenerator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Load invoices from localStorage on component mount
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    setInvoices(savedInvoices);
  }, []);

  const handleSaveInvoice = (invoiceData) => {
    const updatedInvoices = [...invoices, invoiceData];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    alert('Invoice berhasil disimpan!');
  };

  const handleExportToExcel = () => {
    const data = invoices.map(invoice => ({
      'Nomor Invoice': invoice.number,
      'Tanggal': invoice.date,
      'Customer': invoice.customer,
      'Total': `Rp ${invoice.total.toLocaleString('id-ID')}`,
    }));
    
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'invoices.csv');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FilePlus className="w-5 h-5 mr-2" />
            Buat Invoice
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center px-4 py-2 rounded ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5 mr-2" />
            Daftar Invoice
          </button>
        </div>

        {activeTab === 'create' ? (
          <InvoiceForm onSave={handleSaveInvoice} />
        ) : (
          <InvoiceList 
            invoices={invoices}
            onExport={handleExportToExcel}
          />
        )}
      </div>

      {/* Styles untuk print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .bg-white, .bg-white * {
            visibility: visible;
          }
          .bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;