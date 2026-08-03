/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Flame, 
  Calendar, 
  Trophy, 
  PlusCircle, 
  CreditCard,
  Briefcase
} from 'lucide-react';
import { Account, Transaction, Budget, Goal, AIInsight, UserProfile } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  insights: AIInsight[];
  onNavigate: (view: string) => void;
  onSyncBanks: () => void;
  onAddTransactionClick: () => void;
}

export default function DashboardView({
  user,
  accounts,
  transactions,
  budgets,
  goals,
  insights,
  onNavigate,
  onSyncBanks,
  onAddTransactionClick
}: DashboardViewProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  // Math Calculations
  const totalAssets = accounts
    .filter(a => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter(a => a.balance < 0)
      .reduce((sum, a) => sum + a.balance, 0)
  );

  const netWorth = totalAssets - totalLiabilities;

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date.includes('2026-08'))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = Math.abs(
    transactions
      .filter(t => t.type === 'expense' && t.date.includes('2026-08'))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const cashFlow = monthlyIncome - monthlyExpense;

  // Financial Health Score Calculation (0 - 100)
  const calculateHealthScore = () => {
    let score = 50; // base score
    
    // 1. Savings check: is there a healthy emergency fund?
    const savingsAccount = accounts.find(a => a.type === 'savings');
    if (savingsAccount && savingsAccount.balance > 10000) score += 15;
    else if (savingsAccount && savingsAccount.balance > 5000) score += 8;

    // 2. Budget adherence: do we have overspent budgets?
    const totalBudgets = budgets.length;
    let overspentCount = 0;
    budgets.forEach(b => {
      const spent = Math.abs(
        transactions
          .filter(t => t.category === b.categoryName && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
      );
      if (spent > b.amount) overspentCount++;
    });
    if (overspentCount === 0 && totalBudgets > 0) score += 15;
    else score -= overspentCount * 5;

    // 3. Debt load check
    if (totalLiabilities < 1000) score += 10;
    else if (totalLiabilities < 50000) score += 5;

    // 4. Savings streak modifier
    score += Math.min(user.savingStreak, 10);

    return Math.max(0, Math.min(score, 100));
  };

  const healthScore = calculateHealthScore();

  const handleSyncClick = () => {
    setIsSyncing(true);
    onSyncBanks();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div id="dashboard-view" className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1.5 flex items-center gap-2">
            Welcome back, {user.name}
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
              PRO ACCOUNT
            </span>
          </h1>
          <p className="text-sm text-neutral-400">Here is your financial overview for August 2026. Everything looks healthy.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            id="btn-sync-banks"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-sm font-semibold transition text-neutral-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing Bank APIs...' : 'Refresh Bank Sync'}
          </button>
          
          <button 
            id="btn-quick-add-tx"
            onClick={onAddTransactionClick}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold transition text-white shadow-lg shadow-indigo-600/15 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Primary Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Worth */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Net Worth</div>
            <div className="text-3xl font-extrabold text-neutral-100 font-mono">£{netWorth.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-neutral-900 pt-3">
            <span className="text-neutral-500">Assets: <strong className="text-neutral-300 font-mono">£{totalAssets.toLocaleString()}</strong></span>
            <span className="text-neutral-500">Debt: <strong className="text-rose-400 font-mono">£{totalLiabilities.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Monthly Cash Flow */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">August Cash Flow</div>
            <div className="text-3xl font-extrabold text-neutral-100 font-mono flex items-center gap-2">
              £{cashFlow.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {cashFlow >= 0 ? (
                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 text-xs flex items-center"><TrendingUp className="w-3.5 h-3.5" /></span>
              ) : (
                <span className="p-1 rounded bg-rose-500/10 text-rose-400 text-xs flex items-center"><TrendingDown className="w-3.5 h-3.5" /></span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-neutral-900 pt-3">
            <span className="text-neutral-500">In: <strong className="text-emerald-400 font-mono">£{monthlyIncome.toLocaleString()}</strong></span>
            <span className="text-neutral-500">Out: <strong className="text-rose-400 font-mono">£{monthlyExpense.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Saving & Budget Streaks */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">XP level & Streaks</div>
              <div className="text-3xl font-extrabold text-neutral-100 flex items-baseline gap-1">
                Lvl {user.level}
                <span className="text-xs font-normal text-neutral-400">({user.xp} XP)</span>
              </div>
            </div>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Trophy className="w-5 h-5" /></span>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs border-t border-neutral-900 pt-3">
            <div className="flex items-center gap-1.5 text-orange-400 font-medium">
              <Flame className="w-4 h-4 fill-current" />
              <span>{user.savingStreak}d saving streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <Flame className="w-4 h-4 fill-current" />
              <span>{user.budgetStreak}w budget streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Insights Carousel & Financial Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Carousel of AI Insights */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900/80 to-indigo-950/20 border border-neutral-900 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Gemini Financial Coach Audits
              </span>
              <div className="flex gap-1.5">
                {insights.map((_, i) => (
                  <button 
                    id={`btn-insight-dot-${i}`}
                    key={i}
                    onClick={() => setInsightIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${insightIndex === i ? 'bg-indigo-500 w-4' : 'bg-neutral-800'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm md:text-base text-neutral-200 font-medium leading-relaxed min-h-[64px]">
              "{insights[insightIndex]?.text}"
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-4">
            <span className="text-[10px] text-neutral-500 font-mono">
              Audited {new Date(insights[insightIndex]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button 
              id="btn-goto-coach"
              onClick={() => onNavigate('coach')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 hover:underline"
            >
              Consult with Coach <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Gauge of Health Score */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Financial Health Score</div>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle track */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r="52" 
                className="stroke-neutral-800" 
                strokeWidth="10" 
                fill="transparent" 
              />
              <circle 
                cx="64" 
                cy="64" 
                r="52" 
                className="stroke-indigo-500 transition-all duration-1000" 
                strokeWidth="10" 
                fill="transparent" 
                strokeDasharray="326"
                strokeDashoffset={326 - (326 * healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">{healthScore}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">EXCELLENT</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-neutral-400">
            Emergency vault is 80% funded. You saved £312 this month.
          </div>
        </div>
      </div>

      {/* Main Budget Progress and Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budgets Tracker Overview */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-100 text-sm uppercase tracking-wider">Active August Budgets</h3>
            <button 
              id="btn-goto-budgets"
              onClick={() => onNavigate('budgets')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              All Budgets
            </button>
          </div>

          <div className="space-y-4.5">
            {budgets.slice(0, 3).map((b) => {
              // Calculate spending
              const spent = Math.abs(
                transactions
                  .filter(t => t.category === b.categoryName && t.type === 'expense' && t.date.includes('2026-08'))
                  .reduce((sum, t) => sum + t.amount, 0)
              );
              const percentage = Math.min(100, Math.round((spent / b.amount) * 100));
              const isOver = spent > b.amount;

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{b.categoryName}</span>
                    <span className="text-neutral-400 font-mono">
                      £{spent.toFixed(0)} / <strong className="text-neutral-300 font-bold">£{b.amount}</strong>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-850">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isOver && (
                    <div className="text-[10px] text-rose-400 flex items-center gap-1 mt-1 font-medium">
                      <AlertTriangle className="w-3 h-3" /> Overspent by £{(spent - b.amount).toFixed(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-neutral-100 text-sm uppercase tracking-wider">Recent Transactions</h3>
            <button 
              id="btn-goto-transactions"
              onClick={() => onNavigate('transactions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View Statement Statement
            </button>
          </div>

          <div className="divide-y divide-neutral-900 space-y-3.5">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between pt-3.5 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-sm">
                    {tx.type === 'income' ? '💰' : '💳'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-200">{tx.merchant}</div>
                    <div className="text-[10px] text-neutral-500 font-semibold uppercase">{tx.category} • {tx.accountName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-extrabold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-200'}`}>
                    {tx.type === 'income' ? '+' : '-'}£{Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {new Date(tx.date).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
