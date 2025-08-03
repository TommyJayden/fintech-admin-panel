import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Import icons
import { 
  FaUsers, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaCoins, 
  FaHandHoldingUsd, 
  FaHourglassHalf, 
  FaWallet,
  FaSpinner 
} from 'react-icons/fa';

const INITIAL_STATS = {
  totalUsers: 0,
  pendingKYC: 0,
  totalLoans: 0,
  pendingLoans: 0,
  totalDeposits: 0,
  pendingWithdrawals: 0,
  totalUSDT: 0,
  totalGold: 0,
  totalBank: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let totalUsers = 0;
      let pendingKYC = 0;
      let totalLoans = 0;
      let pendingLoans = 0;
      let totalDeposits = 0;
      let pendingWithdrawals = 0;
      let totalUSDT = 0;
      let totalGold = 0;
      let totalBank = 0;

      // Fetch users data
      const usersSnap = await getDocs(collection(db, 'users'));
      totalUsers = usersSnap.size;
      
      usersSnap.forEach(doc => {
        const user = doc.data();
        if (user.kycStatus !== 'completed') {
          pendingKYC++;
        }

        if (user.balances) {
          totalUSDT += user.balances.usdt || 0;
          totalGold += user.balances.gold || 0;
          totalBank += user.balances.bank || 0;
        }
      });

      // Fetch loans data
      const loansSnap = await getDocs(collection(db, 'loans'));
      totalLoans = loansSnap.size;
      
      loansSnap.forEach(doc => {
        const loan = doc.data();
        if (loan.status === 'pending') {
          pendingLoans++;
        }
      });

      // Fetch deposits data
      const depositsSnap = await getDocs(collection(db, 'deposits'));
      depositsSnap.forEach(doc => {
        const deposit = doc.data();
        if (typeof deposit.amount === 'number') {
          totalDeposits += deposit.amount;
        }
      });

      // Fetch withdrawals data
      const withdrawalsSnap = await getDocs(collection(db, 'withdrawals'));
      withdrawalsSnap.forEach(doc => {
        const withdrawal = doc.data();
        if (withdrawal.status === 'pending') {
          pendingWithdrawals++;
        }
      });

      setStats({
        totalUsers,
        pendingKYC,
        totalLoans,
        pendingLoans,
        totalDeposits,
        pendingWithdrawals,
        totalUSDT,
        totalGold,
        totalBank,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return navigate('/login');
      }
      await fetchDashboardStats();
    });

    return () => unsubscribe();
  }, [navigate, fetchDashboardStats]);

  const handleQuickAction = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDashboardStats} />;
  }

  return (
    <div className="min-h-screen bg-[#f1eadd] text-[#101920] p-6">
      <DashboardHeader />
      
      <AdminAccountBalance balance={stats.totalBank} />
      
      <div className="space-y-8">
        <PlatformOverviewSection stats={stats} />
        <WalletBalancesSection stats={stats} />
        <QuickActionsSection stats={stats} onAction={handleQuickAction} />
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-[#101920] mb-2">
        Dashboard Overview
      </h1>
      <p className="text-[#8A8F9A]">
        Welcome back, Admin 👋 Here's what's happening with your platform today.
      </p>
    </header>
  );
}

function AdminAccountBalance({ balance }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-lg mb-8">
      <div className="text-center">
        <p className="text-sm font-medium text-[#8A8F9A] mb-2">
          Admin Account Balance
        </p>
        <p className="text-5xl font-bold text-[#F6B800] mb-2">
          ${balance.toLocaleString()}
        </p>
        <p className="text-xs text-[#8A8F9A]">
          Total platform funds under management
        </p>
      </div>
    </div>
  );
}

function PlatformOverviewSection({ stats }) {
  const overviewStats = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: <FaUsers />,
      description: 'Registered platform users'
    },
    { 
      label: 'Pending KYC', 
      value: `${stats.pendingKYC}`, 
      icon: <FaCreditCard />,
      description: 'Users awaiting verification'
    },
    { 
      label: 'Total Deposits', 
      value: `$${stats.totalDeposits.toLocaleString()}`, 
      icon: <FaMoneyBillWave />,
      description: 'Cumulative platform deposits'
    },
    { 
      label: 'Total Loans', 
      value: stats.totalLoans.toLocaleString(), 
      icon: <FaHandHoldingUsd />,
      description: 'All loan applications'
    },
    { 
      label: 'Pending Loans', 
      value: `${stats.pendingLoans}`, 
      icon: <FaHourglassHalf />,
      description: 'Loans awaiting approval'
    },
    { 
      label: 'Pending Withdrawals', 
      value: `${stats.pendingWithdrawals}`, 
      icon: <FaHourglassHalf />,
      description: 'Withdrawal requests to process'
    }
  ];

  return (
    <section>
      <SectionHeader 
        title="Platform Overview" 
        subtitle="Key metrics and platform performance indicators"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}

function WalletBalancesSection({ stats }) {
  const walletStats = [
    { 
      label: 'USDT Wallet', 
      value: `${stats.totalUSDT.toLocaleString()} USDT`, 
      icon: <FaWallet />,
      description: 'Total USDT holdings'
    },
    { 
      label: 'Gold Wallet', 
      value: `${stats.totalGold.toLocaleString()}g`, 
      icon: <FaCoins />,
      description: 'Total gold reserves'
    }
  ];

  return (
    <section>
      <SectionHeader 
        title="Wallet Balances" 
        subtitle="Current asset holdings across all wallets"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {walletStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}

function QuickActionsSection({ stats, onAction }) {
  const actions = [
    {
      label: `Pending Withdrawals (${stats.pendingWithdrawals})`,
      path: '/withdrawals',
      priority: stats.pendingWithdrawals > 0 ? 'high' : 'normal'
    },
    {
      label: `Pending KYC (${stats.pendingKYC})`,
      path: '/kyc-requests',
      priority: stats.pendingKYC > 0 ? 'high' : 'normal'
    },
    {
      label: `Pending Loans (${stats.pendingLoans})`,
      path: '/loans',
      priority: stats.pendingLoans > 0 ? 'high' : 'normal'
    },
    {
      label: 'View All Reports',
      path: '/reports',
      priority: 'normal'
    }
  ];

  return (
    <section>
      <SectionHeader 
        title="Quick Actions" 
        subtitle="Manage pending requests and view reports"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <ActionButton 
            key={index} 
            {...action} 
            onClick={() => onAction(action.path)}
          />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#101920] mb-1">{title}</h2>
      <p className="text-sm text-[#8A8F9A]">{subtitle}</p>
    </div>
  );
}

function StatCard({ label, value, icon, description }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FBEBCE] to-[#f5e4bb]">
            {React.cloneElement(icon, { 
              className: 'w-5 h-5 text-[#F6B800]' 
            })}
          </div>
          <div>
            <p className="text-sm font-medium text-[#101920]">{label}</p>
            <p className="text-xs text-[#8A8F9A] mt-1">{description}</p>
          </div>
        </div>
      </div>
      <p className="text-2xl font-bold text-[#101920]">
        {value}
      </p>
    </div>
  );
}

function ActionButton({ label, priority, onClick }) {
  const baseClasses = "w-full py-4 px-6 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f1eadd]";
  const priorityClasses = priority === 'high' 
    ? "bg-[#F6B800] text-[#0B0F1C] hover:brightness-105 focus:ring-[#F6B800]" 
    : "bg-white/90 backdrop-blur-sm text-[#101920] border border-gray-100 hover:bg-white hover:shadow-md focus:ring-gray-300";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${priorityClasses}`}
    >
      {label}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#f1eadd] flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="w-8 h-8 text-[#F6B800] animate-spin mx-auto mb-4" />
        <p className="text-[#8A8F9A]">Loading dashboard...</p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="min-h-screen bg-[#f1eadd] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center max-w-md">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-[#F6B800] text-gray-900 px-6 py-2 rounded-lg font-semibold hover:brightness-105 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}