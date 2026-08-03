/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Target, 
  Sparkles, 
  Calendar, 
  Coins, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Goal, Account } from '../types';

interface GoalsViewProps {
  goals: Goal[];
  accounts: Account[];
  onAddGoal: (newGoal: Omit<Goal, 'id'>) => void;
  onDepositToGoal: (goalId: string, amount: number, sourceAccountId: string) => void;
}

export default function GoalsView({
  goals,
  accounts,
  onAddGoal,
  onDepositToGoal
}: GoalsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [category, setCategory] = useState('Emergency');

  // Deposit simulation state
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline || !monthlyContribution) return;

    onAddGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline,
      monthlyContribution: parseFloat(monthlyContribution),
      category
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
    setMonthlyContribution('');
    setShowAdd(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || !depositAmount) return;

    onDepositToGoal(depositGoalId, parseFloat(depositAmount), sourceAccountId);
    setDepositGoalId(null);
    setDepositAmount('');
  };

  return (
    <div id="goals-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Financial Vaults & Goals</h1>
          <p className="text-sm text-neutral-400">Lock money aside for holidays, safety nets, house deposits, or high-end gadgets.</p>
        </div>

        <button 
          id="btn-toggle-add-goal"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition active:scale-95 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New Vault
        </button>
      </div>

      {/* Add Goal Form */}
      {showAdd && (
        <form 
          id="add-goal-form"
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4"
        >
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Configure Savings Vault</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Vault Name</label>
              <input 
                id="input-goal-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dream Wedding Vault"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Target Amount (£)</label>
              <input 
                id="input-goal-target"
                type="number"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Initial Balance (£)</label>
              <input 
                id="input-goal-current"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="e.g. 0"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Goal Category</label>
              <select 
                id="select-goal-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Emergency">Emergency Safety Net</option>
                <option value="Holiday">Travel & Holiday</option>
                <option value="House Deposit">Property Deposit</option>
                <option value="Laptop & Tech">Laptop & Electronics</option>
                <option value="Wedding">Wedding Event</option>
                <option value="Retirement">Retirement Buffer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Target Deadline Date</label>
              <input 
                id="input-goal-deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Planned Monthly Save (£)</label>
              <input 
                id="input-goal-contribution"
                type="number"
                required
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g. 350"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-2">
            <button 
              id="btn-cancel-goal"
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              id="btn-save-goal"
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
            >
              Create Vault
            </button>
          </div>
        </form>
      )}

      {/* Deposit Modal Popup */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            id="deposit-vault-form"
            onSubmit={handleDepositSubmit}
            className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4 shadow-2xl relative"
          >
            <button 
              id="btn-close-deposit"
              type="button" 
              onClick={() => setDepositGoalId(null)} 
              className="absolute right-4 top-4 text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4.5 h-4.5 text-indigo-400" />
              Transfer Funds to Vault
            </h3>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Move capital from your checking account straight to this dedicated high-yield vault.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Select Funding Source</label>
                <select 
                  id="select-deposit-source"
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                >
                  {accounts.filter(a => a.balance > 0).map(a => (
                    <option key={a.id} value={a.id}>{a.name} (Balance: £{a.balance.toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1 font-semibold">Transfer Amount (£)</label>
                <input 
                  id="input-deposit-amount"
                  type="number"
                  step="0.01"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500.00"
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                id="btn-cancel-deposit-modal"
                type="button"
                onClick={() => setDepositGoalId(null)}
                className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button 
                id="btn-confirm-deposit"
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/10"
              >
                Authorize Transfer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vaults Grid List */}
      <div className="space-y-6">
        {goals.map((g) => {
          const percentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const completed = g.currentAmount >= g.targetAmount;
          
          // Calculate projections: how many months remaining
          const remainingAmount = g.targetAmount - g.currentAmount;
          const monthsToGoal = g.monthlyContribution > 0 ? Math.ceil(remainingAmount / g.monthlyContribution) : 0;
          
          const completionDateStr = monthsToGoal > 0 ? 
            new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).toLocaleDateString([], { month: 'short', year: 'numeric' })
            : 'Immediate';

          return (
            <div 
              key={g.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm hover:border-neutral-800 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-200 text-base">{g.name}</h3>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">{g.category} Vault • Planned Monthly Save: £{g.monthlyContribution}/mo</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-mono text-neutral-300">
                      <strong className="text-neutral-100 font-extrabold text-base">£{g.currentAmount.toLocaleString()}</strong> / £{g.targetAmount.toLocaleString()}
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">Deadline: {new Date(g.deadline).toLocaleDateString([], { month: 'short', year: 'numeric' })}</span>
                  </div>

                  {!completed && (
                    <button 
                      id={`btn-deposit-goal-${g.id}`}
                      onClick={() => setDepositGoalId(g.id)}
                      className="px-3.5 py-2 rounded-lg bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 hover:bg-indigo-600 hover:text-white transition text-xs font-bold active:scale-95 shrink-0"
                    >
                      Deposit
                    </button>
                  )}
                </div>
              </div>

              {/* Progress visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Vault Progress</span>
                  <span className="font-mono font-bold text-indigo-400">{percentage}%</span>
                </div>
                <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Smart AI savings projections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-900/40">
                <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-850 flex items-center gap-3">
                  <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Velocity Projection</div>
                    <div className="text-xs text-neutral-300 font-bold">
                      {completed ? (
                        <span className="text-emerald-400">Completed & fully unlocked!</span>
                      ) : (
                        `On track for completion in ${monthsToGoal} months (${completionDateStr})`
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900/50 rounded-xl border border-neutral-850 flex items-center gap-3">
                  <Sparkles className="w-4.5 h-4.5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Compound Boost advice</div>
                    <div className="text-xs text-neutral-300">
                      {completed ? (
                        "Ready to re-deploy or cash out."
                      ) : (
                        `Double savings to £${(g.monthlyContribution * 2).toFixed(0)}/mo to reach goal by ${new Date(new Date().setMonth(new Date().getMonth() + Math.ceil(monthsToGoal/2))).toLocaleDateString([], {month: 'short', year:'numeric'})}`
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
