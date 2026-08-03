/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  Wallet, 
  FileText, 
  PiggyBank, 
  Target, 
  Tv, 
  PieChart, 
  ShieldAlert, 
  Trophy, 
  Settings, 
  Sparkles, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// Import local subviews
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import AICoachView from './components/AICoachView';
import AccountsView from './components/AccountsView';
import TransactionsView from './components/TransactionsView';
import BudgetsView from './components/BudgetsView';
import GoalsView from './components/GoalsView';
import BillsView from './components/BillsView';
import AnalyticsView from './components/AnalyticsView';
import DebtsView from './components/DebtsView';
import GamificationView from './components/GamificationView';
import SettingsAndAdminView from './components/SettingsAndAdminView';

// Import initial seeded database state models
import { 
  INITIAL_USER, 
  INITIAL_ACCOUNTS, 
  INITIAL_CATEGORIES, 
  INITIAL_BUDGETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_GOALS, 
  INITIAL_BILLS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_INSIGHTS, 
  INITIAL_INVESTMENTS, 
  INITIAL_DEBTS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_CHALLENGES, 
  INITIAL_TICKETS 
} from './mockData';

import { Account, Transaction, Budget, Goal, Bill, Subscription, Challenge, Achievement, SupportTicket, UserProfile } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'coach' | 'accounts' | 'transactions' | 
    'budgets' | 'goals' | 'bills' | 'analytics' | 'debts' | 'gamification' | 'settings'
  >('landing');

  // Core App states seeded with high-fidelity realistic datasets
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // Responsive mobile menu drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global handlers to persist modifications
  const handleAddAccount = (newAcc: Omit<Account, 'id' | 'lastSynced'>) => {
    const acc: Account = {
      ...newAcc,
      id: `acc_${Date.now()}`,
      lastSynced: new Date().toISOString()
    };
    setAccounts(prev => [...prev, acc]);
    
    // Add transaction log representing deposit if checking or savings
    if (newAcc.balance > 0) {
      const initTx: Transaction = {
        id: `tx_init_${Date.now()}`,
        accountId: acc.id,
        accountName: acc.name,
        merchant: `Initial Funding Balance`,
        logo: 'Coins',
        category: 'Salary & Income',
        date: new Date().toISOString(),
        amount: newAcc.balance,
        type: 'income',
        status: 'completed',
        isRecurring: false
      };
      setTransactions(prev => [initTx, ...prev]);
    }
  };

  const handleSyncBanks = () => {
    // Simulated remote banking API syncer
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      lastSynced: new Date().toISOString()
    })));
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx_${Date.now()}`
    };
    setTransactions(prev => [tx, ...prev]);

    // Adjust corresponding bank account balance (dual-entry logic)
    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.accountId) {
        return {
          ...acc,
          balance: acc.balance + newTx.amount
        };
      }
      return acc;
    }));
  };

  const handleImportCSV = (importedTxs: Omit<Transaction, 'id'>[]) => {
    const prepared = importedTxs.map((t, idx) => ({
      ...t,
      id: `tx_imported_${Date.now()}_${idx}`
    }));
    setTransactions(prev => [...prepared, ...prev]);

    // Adjust corresponding accounts
    setAccounts(prev => prev.map(acc => {
      const relevant = prepared.filter(t => t.accountId === acc.id);
      const sumDiff = relevant.reduce((sum, t) => sum + t.amount, 0);
      return {
        ...acc,
        balance: acc.balance + sumDiff
      };
    }));
  };

  const handleAddBudget = (newBudget: Omit<Budget, 'id'>) => {
    const bud: Budget = {
      ...newBudget,
      id: `bud_${Date.now()}`
    };
    setBudgets(prev => [...prev, bud]);
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id'>) => {
    const goal: Goal = {
      ...newGoal,
      id: `goal_${Date.now()}`
    };
    setGoals(prev => [...prev, goal]);
  };

  const handleDepositToGoal = (goalId: string, amount: number, sourceAccountId: string) => {
    // Deduct from checking, add to goal balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === sourceAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      return acc;
    }));

    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

    // Log the transaction transfer
    const targetGoal = goals.find(g => g.id === goalId);
    const sourceAcc = accounts.find(a => a.id === sourceAccountId);

    const tx: Transaction = {
      id: `tx_transfer_${Date.now()}`,
      accountId: sourceAccountId,
      accountName: sourceAcc ? sourceAcc.name : 'Checking Account',
      merchant: `Transfer to ${targetGoal ? targetGoal.name : 'Goal Vault'}`,
      logo: 'Target',
      category: 'Savings & Investments',
      date: new Date().toISOString(),
      amount: -amount,
      type: 'expense',
      status: 'completed',
      isRecurring: false
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleAddBill = (newBill: Omit<Bill, 'id'>) => {
    const b: Bill = {
      ...newBill,
      id: `bill_${Date.now()}`
    };
    setBills(prev => [...prev, b]);
  };

  const handleAddSubscription = (newSub: Omit<Subscription, 'id'>) => {
    const sub: Subscription = {
      ...newSub,
      id: `sub_${Date.now()}`
    };
    setSubscriptions(prev => [...prev, sub]);
  };

  const handleCancelSubscription = (subId: string) => {
    const canceled = subscriptions.find(s => s.id === subId);
    setSubscriptions(prev => prev.filter(s => s.id !== subId));

    if (canceled) {
      // Log cancelled notification in transactions or alert
      alert(`Unused license for ${canceled.name} has been marked as Cancelled. You saved £${(canceled.amount * 12).toFixed(2)} annually!`);
    }
  };

  const handleClaimXPReward = (challengeId: string, xpReward: number) => {
    setUserProfile(prev => {
      let nextXp = prev.xp + xpReward;
      let nextLevel = prev.level;
      if (nextXp >= 2000) {
        nextXp -= 2000;
        nextLevel += 1;
      }
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel
      };
    });

    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return { ...c, progress: 100, completed: true };
      }
      return c;
    }));
  };

  const handleUpdatePreferences = (updatedPrefs: UserProfile['preferences']) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: updatedPrefs
    }));
  };

  const handleUpdateTickets = (updatedTickets: SupportTicket[]) => {
    setTickets(updatedTickets);
  };

  // Nav menu configuration list
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Advisor', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'accounts', label: 'Accounts', icon: <Wallet className="w-4 h-4" /> },
    { id: 'transactions', label: 'Statements', icon: <FileText className="w-4 h-4" /> },
    { id: 'budgets', label: 'Budget Caps', icon: <PiggyBank className="w-4 h-4" /> },
    { id: 'goals', label: 'Savings Vaults', icon: <Target className="w-4 h-4" /> },
    { id: 'bills', label: 'Subscriptions', icon: <Tv className="w-4 h-4" /> },
    { id: 'analytics', label: 'Intelligence', icon: <PieChart className="w-4 h-4" /> },
    { id: 'debts', label: 'Debt Repayments', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'gamification', label: 'Mastery Hub', icon: <Trophy className="w-4 h-4 text-indigo-400" /> },
    { id: 'settings', label: 'Control Tower', icon: <Settings className="w-4 h-4" /> }
  ] as const;

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView 
            user={userProfile}
            accounts={accounts}
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            insights={INITIAL_INSIGHTS}
            onNavigate={(view) => setCurrentView(view as any)}
            onSyncBanks={handleSyncBanks}
            onAddTransactionClick={() => setCurrentView('transactions')}
          />
        );
      case 'coach':
        return (
          <AICoachView 
            accounts={accounts}
            transactions={transactions}
            budgets={budgets}
            goals={goals}
            subscriptions={subscriptions}
          />
        );
      case 'accounts':
        return (
          <AccountsView 
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onSyncBanks={handleSyncBanks}
          />
        );
      case 'transactions':
        return (
          <TransactionsView 
            transactions={transactions}
            accounts={accounts}
            onAddTransaction={handleAddTransaction}
            onImportCSV={handleImportCSV}
          />
        );
      case 'budgets':
        return (
          <BudgetsView 
            budgets={budgets}
            categories={INITIAL_CATEGORIES}
            transactions={transactions}
            onAddBudget={handleAddBudget}
          />
        );
      case 'goals':
        return (
          <GoalsView 
            goals={goals}
            accounts={accounts}
            onAddGoal={handleAddGoal}
            onDepositToGoal={handleDepositToGoal}
          />
        );
      case 'bills':
        return (
          <BillsView 
            bills={bills}
            subscriptions={subscriptions}
            onAddBill={handleAddBill}
            onAddSubscription={handleAddSubscription}
            onCancelSubscription={handleCancelSubscription}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            transactions={transactions}
            accounts={accounts}
            categories={INITIAL_CATEGORIES}
          />
        );
      case 'debts':
        return (
          <DebtsView 
            debts={INITIAL_DEBTS}
          />
        );
      case 'gamification':
        return (
          <GamificationView 
            user={userProfile}
            achievements={achievements}
            challenges={challenges}
            onClaimXPReward={handleClaimXPReward}
          />
        );
      case 'settings':
        return (
          <SettingsAndAdminView 
            user={userProfile}
            tickets={tickets}
            onUpdatePreferences={handleUpdatePreferences}
            onUpdateTickets={handleUpdateTickets}
          />
        );
      default:
        return null;
    }
  };

  // If on landing page, display full-screen gorgeous presentation
  if (currentView === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setCurrentView('dashboard')} 
      />
    );
  }

  const activeTheme = userProfile.preferences.theme;

  return (
    <div data-theme={activeTheme} className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col md:flex-row antialiased transition-all duration-300">
      <style>{`
        /* Global theme variables and style rules */
        [data-theme="dark"] {
          --color-neutral-950: #0a0a0a;
          --color-neutral-900: #121212;
          --color-neutral-850: #1a1a1a;
          --color-neutral-800: #262626;
          --color-neutral-700: #404040;
          --color-neutral-600: #525252;
          --color-neutral-500: #737373;
          --color-neutral-400: #a3a3a3;
          --color-neutral-300: #d4d4d4;
          --color-neutral-200: #e5e5e5;
          --color-neutral-100: #f5f5f5;
          
          --color-indigo-600: #4f46e5;
          --color-indigo-500: #6366f1;
          --color-indigo-400: #818cf8;
          --color-indigo-300: #a5b4fc;
        }

        [data-theme="gold"] {
          --color-neutral-950: #0c0b0a;
          --color-neutral-900: #171512;
          --color-neutral-850: #23201b;
          --color-neutral-800: #2e2a24;
          --color-neutral-700: #4e473d;
          --color-neutral-600: #6f6557;
          --color-neutral-500: #9e8f7c;
          --color-neutral-400: #c6b7a5;
          --color-neutral-300: #decbba;
          --color-neutral-200: #eedecf;
          --color-neutral-100: #fcf6ef;
          
          --color-indigo-600: #d97706;
          --color-indigo-500: #f59e0b;
          --color-indigo-400: #fbbf24;
          --color-indigo-300: #fde047;
          --color-white: #ffffff;
        }

        [data-theme="cyber"] {
          --color-neutral-950: #06050b;
          --color-neutral-900: #0e0a1b;
          --color-neutral-850: #161129;
          --color-neutral-800: #1e1736;
          --color-neutral-700: #322659;
          --color-neutral-600: #4c3a8c;
          --color-neutral-500: #7d6caf;
          --color-neutral-400: #9e8fcb;
          --color-neutral-300: #c1b5e3;
          --color-neutral-200: #e2daf5;
          --color-neutral-100: #ffffff;
          
          --color-indigo-600: #a855f7;
          --color-indigo-500: #c084fc;
          --color-indigo-400: #d8b4fe;
          --color-indigo-300: #f3e8ff;
          --color-white: #ffffff;
        }

        [data-theme="carbon"] {
          --color-neutral-950: #050505;
          --color-neutral-900: #0d0d0d;
          --color-neutral-850: #141414;
          --color-neutral-800: #1f1f1f;
          --color-neutral-700: #3d3d3d;
          --color-neutral-600: #5c5c5c;
          --color-neutral-500: #7a7a7a;
          --color-neutral-400: #a3a3a3;
          --color-neutral-300: #cccccc;
          --color-neutral-200: #e5e5e5;
          --color-neutral-100: #ffffff;
          
          --color-indigo-600: #fafafa;
          --color-indigo-500: #f5f5f5;
          --color-indigo-400: #e5e5e5;
          --color-indigo-300: #d4d4d4;
          --color-white: #ffffff;
        }

        [data-theme="light"] {
          --color-neutral-950: #fafafa;
          --color-neutral-900: #f4f4f5;
          --color-neutral-850: #e4e4e7;
          --color-neutral-800: #d4d4d8;
          --color-neutral-700: #a1a1aa;
          --color-neutral-600: #71717a;
          --color-neutral-500: #52525b;
          --color-neutral-400: #3f3f46;
          --color-neutral-300: #27272a;
          --color-neutral-200: #18181b;
          --color-neutral-100: #09090b;
          
          --color-indigo-600: #4f46e5;
          --color-indigo-500: #6366f1;
          --color-indigo-400: #818cf8;
          --color-indigo-300: #a5b4fc;
          
          --color-white: #09090b;
        }

        [data-theme="emerald"] {
          --color-neutral-950: #f4f7f5;
          --color-neutral-900: #e7ecea;
          --color-neutral-850: #dae2df;
          --color-neutral-800: #cbd6d2;
          --color-neutral-700: #9cb1a9;
          --color-neutral-600: #6e847c;
          --color-neutral-500: #50615a;
          --color-neutral-400: #384540;
          --color-neutral-300: #242f2b;
          --color-neutral-200: #151d1a;
          --color-neutral-100: #080b0a;
          
          --color-indigo-600: #059669;
          --color-indigo-500: #10b981;
          --color-indigo-400: #34d399;
          --color-indigo-300: #6ee7b7;
          
          --color-white: #080b0a;
        }

        [data-theme="frost"] {
          --color-neutral-950: #f0f4f8;
          --color-neutral-900: #e1e7f0;
          --color-neutral-850: #d2dae5;
          --color-neutral-800: #b9c5d4;
          --color-neutral-700: #8ba0b5;
          --color-neutral-600: #5d758c;
          --color-neutral-500: #42556b;
          --color-neutral-400: #2c3c4f;
          --color-neutral-300: #1a2736;
          --color-neutral-200: #0f1824;
          --color-neutral-100: #060b12;
          
          --color-indigo-600: #0284c7;
          --color-indigo-500: #0ea5e9;
          --color-indigo-400: #38bdf8;
          --color-indigo-300: #7dd3fc;
          
          --color-white: #060b12;
        }

        [data-theme="sunset"] {
          --color-neutral-950: #FAF8F5;
          --color-neutral-900: #F4EDE2;
          --color-neutral-850: #EADFD0;
          --color-neutral-800: #D8CABE;
          --color-neutral-700: #B29B8B;
          --color-neutral-600: #8c7161;
          --color-neutral-500: #664f42;
          --color-neutral-400: #423229;
          --color-neutral-300: #2e2019;
          --color-neutral-200: #1a100c;
          --color-neutral-100: #0d0604;
          
          --color-indigo-600: #dc2626;
          --color-indigo-500: #ef4444;
          --color-indigo-400: #f87171;
          --color-indigo-300: #fca5a5;
          
          --color-white: #0d0604;
        }

        /* Adjustments to make sure layout elements stay completely legible in any theme */
        [data-theme="light"] button, [data-theme="light"] .bg-indigo-600, [data-theme="light"] .bg-indigo-600 *,
        [data-theme="emerald"] button, [data-theme="emerald"] .bg-indigo-600, [data-theme="emerald"] .bg-indigo-600 *,
        [data-theme="frost"] button, [data-theme="frost"] .bg-indigo-600, [data-theme="frost"] .bg-indigo-600 *,
        [data-theme="sunset"] button, [data-theme="sunset"] .bg-indigo-600, [data-theme="sunset"] .bg-indigo-600 * {
          --color-white: #ffffff !important;
          color: #ffffff !important;
        }

        /* Support ticket items on light mode */
        [data-theme="light"] .bg-indigo-600/15, [data-theme="emerald"] .bg-indigo-600/15, [data-theme="frost"] .bg-indigo-600/15, [data-theme="sunset"] .bg-indigo-600/15 {
          color: var(--color-indigo-600) !important;
        }

        /* Ensure texts inside dark containers in light themes remain light */
        [data-theme="light"] .bg-neutral-900, [data-theme="light"] .bg-neutral-900 *,
        [data-theme="emerald"] .bg-neutral-900, [data-theme="emerald"] .bg-neutral-900 *,
        [data-theme="frost"] .bg-neutral-900, [data-theme="frost"] .bg-neutral-900 *,
        [data-theme="sunset"] .bg-neutral-900, [data-theme="sunset"] .bg-neutral-900 * {
          --color-white: #ffffff;
        }
        
        [data-theme="carbon"] .bg-indigo-600 {
          color: #000000 !important;
        }
        [data-theme="carbon"] .bg-indigo-600 * {
          color: #000000 !important;
        }
        
        /* Smooth transitions for all visual style upgrades */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
      
      {/* 1. Left Sidebar - Desktop Layout */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-neutral-900 bg-neutral-900/10 shrink-0 p-5">
        <div className="space-y-8">
          
          {/* Logo Heading */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-indigo-600/30">
              Φ
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm block">Fortress Premium</span>
              <span className="text-[9px] text-indigo-400 font-mono font-bold tracking-widest uppercase">FINANCIAL OS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`side-nav-${item.id}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition active:scale-98 ${active ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/15' : 'text-neutral-400 hover:text-white border border-transparent'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions / user profile widget */}
        <div className="border-t border-neutral-900 pt-4 mt-6">
          <div className="flex items-center gap-3 mb-4 px-1">
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="w-8.5 h-8.5 rounded-full object-cover border border-indigo-500" 
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-neutral-200 truncate">{userProfile.name}</div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">LVL {userProfile.level} • Finch Wizard</span>
            </div>
          </div>

          <button
            id="side-btn-logout"
            onClick={() => setCurrentView('landing')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-200 transition"
          >
            <LogOut className="w-4 h-4 text-neutral-500" />
            Exit Platform
          </button>
        </div>
      </aside>

      {/* 2. Responsive Top Bar - Mobile Layout */}
      <header className="md:hidden border-b border-neutral-900 bg-neutral-950 p-4.5 flex justify-between items-center z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
            Φ
          </div>
          <span className="font-extrabold tracking-tight text-white text-xs">Fortress OS</span>
        </div>

        <button 
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Slide-out */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-[57px] bottom-0 z-30 bg-neutral-950/95 backdrop-blur-md p-6 overflow-y-auto flex flex-col justify-between border-t border-neutral-900"
          >
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      setCurrentView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${active ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/15' : 'text-neutral-400 hover:text-white border border-transparent'}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-neutral-900 pt-6 mt-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={userProfile.avatar} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover border border-indigo-500" 
                />
                <div>
                  <div className="text-xs font-bold text-neutral-200">{userProfile.name}</div>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">LVL {userProfile.level} wizard</span>
                </div>
              </div>

              <button
                id="mobile-btn-logout"
                onClick={() => {
                  setCurrentView('landing');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-200 transition font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Container */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-10 md:py-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
