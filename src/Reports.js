// src/Reports.js
import React, { useState } from 'react';
import DepositsTable from './reports/DepositsTable';
import LoansTable from './reports/LoansTable';
import WithdrawalsTable from './reports/WithdrawalsTable';
import KycTable from './reports/KycTable';

export default function Reports() {
  const [active, setActive] = useState('deposits');

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Admin Reports</h2>

      <div className="flex gap-4 mb-6 flex-wrap">
        {['deposits', 'loans', 'withdrawals', 'kyc'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              active === tab
                ? 'bg-[#F6B800] text-[#0B0F1C]'
                : 'bg-white text-[#101920] border border-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Render the selected report table */}
      {active === 'deposits' && <DepositsTable />}
      {active === 'loans' && <LoansTable />}
      {active === 'withdrawals' && <WithdrawalsTable />}
      {active === 'kyc' && <KycTable />}
    </div>
  );
}
