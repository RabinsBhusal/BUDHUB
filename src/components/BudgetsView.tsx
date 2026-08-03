/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  Check, 
  Sparkles, 
  BellRing,
  RotateCcw
} from 'lucide-react';
import { Budget, Transaction, Category } from '../types';

interface BudgetsViewProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  onAddBudget: (newBudget: Omit<Budget, 'id'>) => void;
}

export default function BudgetsView({
  budgets,
  categories,
  transactions,
  onAddBudget
}: BudgetsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [rollover, setRollover] = useState(true);
  const [alerts, setAlerts] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const selectedCat = categories.find(c => c.id === categoryId);
    onAddBudget({
      categoryId,
      categoryName: selectedCat ? selectedCat.name : 'Custom Budget',
      amount: parseFloat(amount),
      period,
      rolloverEnabled: rollover,
      alertsEnabled: alerts
    });

    setAmount('');
    setShowAdd(false);
  };

  return (
    <div id="budgets-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Budget Optimization</h1>
          <p className="text-sm text-neutral-400">Set active caps on discretionary categories. Leftover funds rollover automatically.</p>
        </div>

        <button 
          id="btn-toggle-add-budget"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition active:scale-95 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Budget Cap
        </button>
      </div>

      {/* Add Budget Form */}
      {showAdd && (
        <form 
          id="add-budget-form"
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4"
        >
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Configure New Budget Cap</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Select Category</label>
              <select 
                id="select-budget-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Cap Amount (£)</label>
              <input 
                id="input-budget-amount"
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 350.00"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Billing Frequency</label>
              <select 
                id="select-budget-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input 
                id="check-budget-rollover"
                type="checkbox"
                checked={rollover}
                onChange={(e) => setRollover(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-neutral-950 border-neutral-800 focus:ring-0"
              />
              <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" /> Enable Rollover
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input 
                id="check-budget-alerts"
                type="checkbox"
                checked={alerts}
                onChange={(e) => setAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-neutral-950 border-neutral-800 focus:ring-0"
              />
              <span className="text-xs text-neutral-300 font-semibold flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-indigo-400" /> Notify Overspending
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-2">
            <button 
              id="btn-cancel-budget"
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              id="btn-save-budget"
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
            >
              Save Cap Rule
            </button>
          </div>
        </form>
      )}

      {/* Grid of active Budgets */}
      <div className="space-y-6">
        {budgets.map((b) => {
          // Calculate spent amount in Aug 2026
          const spent = Math.abs(
            transactions
              .filter(t => t.category === b.categoryName && t.type === 'expense' && t.date.includes('2026-08'))
              .reduce((sum, t) => sum + t.amount, 0)
          );

          const percentage = Math.min(100, Math.round((spent / b.amount) * 100));
          const isOver = spent > b.amount;
          const remaining = b.amount - spent;

          return (
            <div 
              key={b.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm hover:border-neutral-800 transition space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-neutral-200 text-base">{b.categoryName}</h3>
                  <p className="text-xs text-neutral-500 font-semibold uppercase">{b.period} cycle • Rollover: {b.rolloverEnabled ? 'YES' : 'NO'}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-neutral-400 font-mono">
                    Spent: <strong className="text-neutral-100 font-extrabold">£{spent.toFixed(2)}</strong> / £{b.amount.toFixed(0)}
                  </div>
                  <span className={`text-[10px] font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isOver ? `Over budget by £${Math.abs(remaining).toFixed(2)}` : `£${remaining.toFixed(2)} available`}
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Warning Banner / Insight Card */}
              {isOver && (
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 flex items-start gap-3 text-xs text-rose-300">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Overspending warning:</span> You have exceeded your {b.categoryName} budget. Your rollover setting is enabled, so this excess (£{Math.abs(remaining).toFixed(2)}) will be deducted from next month's allocated cap to balance the book.
                  </div>
                </div>
              )}

              {!isOver && percentage > 75 && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3 text-xs text-amber-300">
                  <Info className="w-4.5 h-4.5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Nearing capacity limit:</span> You have consumed {percentage}% of your allowed budget cap. We suggest postponing any non-essential purchase in this category.
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
