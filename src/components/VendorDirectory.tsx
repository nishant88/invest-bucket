import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency } from '../utils/calculations';

export const VendorDirectory: React.FC = () => {
  const { t } = useTranslation();
  const { expenses } = useBucket();

  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique vendors from approved expenses
  const approvedExpenses = expenses.filter(e => e.approvalStatus === 'Approved');

  const vendorMap: Record<string, { totalPaid: number; lastDate: string; count: number }> = {};
  
  approvedExpenses.forEach(e => {
    const name = e.vendorName;
    if (!vendorMap[name]) {
      vendorMap[name] = { totalPaid: 0, lastDate: e.timestamp, count: 0 };
    }
    vendorMap[name].totalPaid += e.amount;
    vendorMap[name].count += 1;
    if (new Date(e.timestamp) > new Date(vendorMap[name].lastDate)) {
      vendorMap[name].lastDate = e.timestamp;
    }
  });

  const vendors = Object.entries(vendorMap)
    .map(([name, stats]) => ({
      name,
      totalPaid: stats.totalPaid,
      count: stats.count,
      lastDate: stats.lastDate,
      upiId: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@okaxis`
    }))
    .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('vendors.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Merchant details and total payment histories logged in the ledger.</p>
      </section>

      {/* Search Input Box */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-outline select-none">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant or UPI handles..."
            className="w-full bg-surface-container-low rounded-full pl-12 pr-4 py-2.5 text-body-sm outline-none border border-outline-variant/30 focus:border-primary"
          />
        </div>
      </section>

      {/* List display */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Merchant Logs ({vendors.length})</h3>

        <div className="space-y-4 divide-y divide-outline-variant/30">
          {vendors.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant py-4 text-center italic">No matching merchants registered yet.</p>
          ) : (
            vendors.map((v, idx) => (
              <div key={v.name} className={`flex justify-between items-center pt-3.5 ${idx === 0 ? 'pt-0' : ''}`}>
                <div>
                  <h4 className="font-bold text-body-sm text-on-surface">{v.name}</h4>
                  <p className="text-[10px] text-primary font-bold mt-0.5">{v.upiId}</p>
                  <p className="text-[9px] text-outline mt-1 font-medium">
                    {v.count} payments logged • Last date:{' '}
                    {new Date(v.lastDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-body-sm text-primary">{formatIndianCurrency(v.totalPaid)}</span>
                  <p className="text-[9px] text-on-surface-variant mt-0.5">Total Paid</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
