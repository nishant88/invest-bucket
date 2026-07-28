import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { calculateSummaryStats, formatIndianCurrency } from '../utils/calculations';
import Tesseract from 'tesseract.js';

export const ExpenseLogger: React.FC = () => {
  const { t } = useTranslation();
  const { partners, expenses, drawings, milestones, addExpense } = useBucket();

  const [amount, setAmount] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('Lease & Deposit');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'UPI' | 'card'>('UPI');
  const [milestoneId, setMilestoneId] = useState<string | null>(null);
  const [isOutOfPocket, setIsOutOfPocket] = useState(true);

  // Real OCR & Simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const stats = React.useMemo(() => calculateSummaryStats(partners, expenses, drawings), [partners, expenses, drawings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setPreviewImage(dataUrl);
      runRealOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runRealOCR = (imageDataUrl: string) => {
    setIsScanning(true);
    setScanProgress(0);

    Tesseract.recognize(
      imageDataUrl,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        }
      }
    ).then(({ data: { text } }) => {
      setIsScanning(false);
      parseReceiptText(text);
    }).catch(err => {
      console.error("OCR Error:", err);
      setIsScanning(false);
      alert("Failed to process OCR. You can still input receipt details manually.");
    });
  };

  const parseReceiptText = (text: string) => {
    const lowercaseText = text.toLowerCase();
    
    // 1. Extract Amount
    let parsedAmount = '';
    const totalRegex = /(?:total|net|due|amount|amt|sum|balance)[:\s]*[₹$]?\s*([\d,]+\.?\d*)/i;
    const match = text.match(totalRegex);
    if (match && match[1]) {
      parsedAmount = match[1].replace(/,/g, '');
    } else {
      const numbers = text.match(/\b\d+[\.,]\d{2}\b/g);
      if (numbers) {
        const cleanNumbers = numbers.map(num => parseFloat(num.replace(/,/g, '')));
        const maxNumber = Math.max(...cleanNumbers);
        if (maxNumber > 0) {
          parsedAmount = maxNumber.toString();
        }
      }
    }
    if (parsedAmount) setAmount(Math.round(parseFloat(parsedAmount)).toString());

    // 2. Extract Vendor Name
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
    if (lines.length > 0) {
      const potentialVendor = lines[0];
      if (!potentialVendor.toLowerCase().includes('receipt') && !potentialVendor.toLowerCase().includes('tax invoice')) {
        setVendorName(potentialVendor);
      } else if (lines[1]) {
        setVendorName(lines[1]);
      } else {
        setVendorName("Audited Vendor");
      }
    } else {
      setVendorName("Audited Vendor");
    }

    // 3. Extract Category
    if (lowercaseText.includes('rent') || lowercaseText.includes('deposit') || lowercaseText.includes('lease') || lowercaseText.includes('property')) {
      setCategory('Lease & Deposit');
    } else if (lowercaseText.includes('interior') || lowercaseText.includes('decor') || lowercaseText.includes('ply') || lowercaseText.includes('paint') || lowercaseText.includes('furniture') || lowercaseText.includes('wood') || lowercaseText.includes('spare')) {
      setCategory('Interiors');
    } else if (lowercaseText.includes('raw') || lowercaseText.includes('grocery') || lowercaseText.includes('inventory') || lowercaseText.includes('food') || lowercaseText.includes('fresh') || lowercaseText.includes('store')) {
      setCategory('Inventory');
    } else if (lowercaseText.includes('license') || lowercaseText.includes('tax') || lowercaseText.includes('fee') || lowercaseText.includes('municipal') || lowercaseText.includes('govt') || lowercaseText.includes('corporation')) {
      setCategory('Licenses');
    } else if (lowercaseText.includes('marketing') || lowercaseText.includes('print') || lowercaseText.includes('flex') || lowercaseText.includes('ad') || lowercaseText.includes('facebook') || lowercaseText.includes('google') || lowercaseText.includes('flyer') || lowercaseText.includes('brochure')) {
      setCategory('Marketing');
    }

    // 4. Extract Payment Mode
    if (lowercaseText.includes('upi') || lowercaseText.includes('gpay') || lowercaseText.includes('phonepe') || lowercaseText.includes('paytm') || lowercaseText.includes('bhim')) {
      setPaymentMode('UPI');
    } else if (lowercaseText.includes('card') || lowercaseText.includes('visa') || lowercaseText.includes('mastercard') || lowercaseText.includes('credit') || lowercaseText.includes('debit')) {
      setPaymentMode('card');
    } else if (lowercaseText.includes('cash') || lowercaseText.includes('change')) {
      setPaymentMode('cash');
    }

    alert("Real WebAssembly OCR Scan Complete! Parsed merchant, amount, category, and payment mode. Please review details.");
  };

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          const mockReceipts = [
            { vendor: 'Vaidya Kitchen Spares Ltd', amt: '48500', cat: 'Interiors', mode: 'card' as const, milestone: 'm2' },
            { vendor: 'Super Fresh Groceries', amt: '8400', cat: 'Inventory', mode: 'cash' as const, milestone: 'm3' },
            { vendor: 'Municipal Health Corporation', amt: '35000', cat: 'Licenses', mode: 'UPI' as const, milestone: 'm4' }
          ];
          const randomMock = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
          setVendorName(randomMock.vendor);
          setAmount(randomMock.amt);
          setCategory(randomMock.cat);
          setPaymentMode(randomMock.mode);
          setMilestoneId(randomMock.milestone);
          setPreviewImage(null);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmt = Number(amount);
    if (!numericAmt || numericAmt <= 0) {
      alert("Please enter a valid expense amount.");
      return;
    }
    if (!vendorName.trim()) {
      alert("Please enter a vendor name.");
      return;
    }

    // Milestone locking check
    if (milestoneId) {
      const selectedMilestone = milestones.find(m => m.id === milestoneId);
      if (selectedMilestone && selectedMilestone.isLocked) {
        alert(`Cannot log expense. The phase budget for "${selectedMilestone.name}" is locked. Please unlock the milestone in the Milestone Vault before logging expenses under it.`);
        return;
      }
    }

    // Cash balance check
    if (paymentMode === 'cash' && numericAmt > stats.runningBalance) {
      alert(`Warning: Out of cash reserves! This expense of ₹${numericAmt} exceeds the running cash balance of ${formatIndianCurrency(stats.runningBalance)}.`);
      return;
    }

    addExpense(numericAmt, vendorName.trim(), category, paymentMode, milestoneId, isOutOfPocket);
    
    // Reset form fields
    setAmount('');
    setVendorName('');
    setMilestoneId(null);
    setIsOutOfPocket(true);
    setPreviewImage(null);
    alert("Expense logged successfully and queued for approval.");
  };

  const categories = ['Lease & Deposit', 'Interiors', 'Inventory', 'Licenses', 'Marketing'];

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('expense.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Verify co-founder spendings by scanning bill receipts.</p>
      </section>

      {/* OCR Viewfinder Box */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('expense.scanReceipt')}</h3>
        
        <div className="relative h-44 bg-surface rounded-2xl border-2 border-dashed border-primary/25 overflow-hidden flex flex-col items-center justify-center">
          {previewImage && (
            <img src={previewImage} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />
          )}
          {isScanning ? (
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center z-10">
              {/* Sweeping scan line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#b2ee4a] shadow-[0_0_8px_#b2ee4a] scanning-line" />
              <p className="font-display text-body-sm font-bold text-primary animate-pulse">Scanning Receipt OCR... {scanProgress}%</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center z-10">
              <input
                type="file"
                id="receipt-file-input"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button 
                type="button"
                onClick={() => document.getElementById('receipt-file-input')?.click()}
                className="w-full h-full flex flex-col items-center justify-center p-4 hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[36px] text-primary mb-1">photo_camera</span>
                <p className="font-display text-body-sm font-bold text-primary">Camera & Paper Scan Device</p>
                <p className="text-[10px] text-outline mt-1">Capture receipt using device camera or upload image</p>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] text-outline">WebAssembly-driven local Tesseract OCR</span>
          <button
            type="button"
            onClick={handleSimulateOCR}
            className="text-[10px] text-primary font-extrabold hover:underline"
          >
            🧪 Simulate Test Scan
          </button>
        </div>
      </section>

      {/* Forms Logger */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40">
        <form onSubmit={handleLogExpense} className="space-y-4 pt-1">
          
          {/* Vendor */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('expense.vendor')}</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder={t('expense.placeholderVendor')}
              required
              className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('expense.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('expense.placeholderAmount')}
              required
              className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('expense.category')}</label>
            <div className="flex flex-wrap gap-2.5">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    category === cat
                      ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                      : 'bg-surface border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Switch */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('expense.paymentMode')}</label>
            <div className="flex gap-2">
              {(['UPI', 'card', 'cash'] as const).map(mode => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-body-sm transition-all border ${
                    paymentMode === mode
                      ? 'bg-primary border-primary text-on-primary font-bold shadow-sm'
                      : 'bg-surface border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Funding Source Toggle */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">Funding Source</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOutOfPocket(true)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-[11px] transition-all border ${
                  isOutOfPocket
                    ? 'bg-primary border-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Personal Out-Of-Pocket
              </button>
              <button
                type="button"
                onClick={() => setIsOutOfPocket(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-[11px] transition-all border ${
                  !isOutOfPocket
                    ? 'bg-primary border-primary text-on-primary font-bold shadow-sm'
                    : 'bg-surface border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                Corporate Bucket Cash
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">
              {isOutOfPocket 
                ? "You paid from personal funds. This will add to your equity/capital contribution." 
                : "Paid from company funds (UPI/card/cash bucket). Deducts from cash reserves without changing equity splits."}
            </p>
          </div>

          {/* Milestone Tag */}
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('expense.milestone')}</label>
            <div className="flex flex-wrap gap-2.5">
              {milestones.map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    if (m.isLocked) {
                      alert(`"${m.name}" phase budget is locked in the Milestone Vault. Please unlock it to submit expenses under this budget.`);
                      return;
                    }
                    setMilestoneId(milestoneId === m.id ? null : m.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] border transition-all flex items-center gap-1 ${
                    m.isLocked
                      ? 'opacity-50 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : milestoneId === m.id
                      ? 'bg-secondary-container/20 border-secondary-container/40 text-on-secondary-container font-bold'
                      : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {m.isLocked && <span className="material-symbols-outlined text-[12px]">lock</span>}
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cash balance warnings */}
          {paymentMode === 'cash' && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl border border-error/20 text-left animate-fade-in">
              <p className="text-[11px] leading-relaxed font-semibold">{t('expense.cashWarning')}</p>
              <p className="text-[11px] font-bold mt-1">Available cash: {formatIndianCurrency(stats.runningBalance)}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-[52px] bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all hover-scale flex items-center justify-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined">save</span>
            {t('expense.logBtn')}
          </button>
        </form>
      </section>
    </div>
  );
};
