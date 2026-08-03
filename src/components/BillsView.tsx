/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Tv, 
  Zap, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Plus, 
  FileText, 
  TrendingUp, 
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Bill, Subscription } from '../types';

interface BillsViewProps {
  bills: Bill[];
  subscriptions: Subscription[];
  onAddBill: (newBill: Omit<Bill, 'id'>) => void;
  onAddSubscription: (newSub: Omit<Subscription, 'id'>) => void;
  onCancelSubscription: (subId: string) => void;
}

export default function BillsView({
  bills,
  subscriptions,
  onAddBill,
  onAddSubscription,
  onCancelSubscription
}: BillsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [formType, setFormType] = useState<'bill' | 'subscription'>('subscription');
  
  // Custom states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities & Bills');

  // Math aggregates
  const totalMonthlySubs = subscriptions
    .filter(s => s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalYearlySubs = totalMonthlySubs * 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    if (formType === 'bill') {
      onAddBill({
        name,
        amount: parseFloat(amount),
        dueDate: dueDate || new Date().toISOString().slice(0, 10),
        status: 'unpaid',
        isRecurring: true,
        frequency: 'monthly',
        category
      });
    } else {
      onAddSubscription({
        name,
        amount: parseFloat(amount),
        frequency: 'monthly',
        logo: 'Tv',
        nextBillingDate: dueDate || new Date().toISOString().slice(0, 10),
        trend: 'stable'
      });
    }

    setName('');
    setAmount('');
    setDueDate('');
    setShowAdd(false);
  };

  return (
    <div id="bills-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Bills & Subscriptions</h1>
          <p className="text-sm text-neutral-400">Track recurring obligations, detect unwanted licenses, and budget for future dues.</p>
        </div>

        <button 
          id="btn-toggle-add-bill"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition active:scale-95 shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Track Recurring Committment
        </button>
      </div>

      {/* Add Subscription / Bill Form */}
      {showAdd && (
        <form 
          id="add-bill-sub-form"
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4"
        >
          <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Configure Recurring Rule</h3>
            <div className="flex gap-1.5">
              <button 
                id="btn-select-form-sub"
                type="button"
                onClick={() => setFormType('subscription')}
                className={`px-3 py-1 text-[10px] rounded font-bold uppercase transition ${formType === 'subscription' ? 'bg-indigo-600 text-white' : 'bg-neutral-950 text-neutral-500'}`}
              >
                Subscription
              </button>
              <button 
                id="btn-select-form-bill"
                type="button"
                onClick={() => setFormType('bill')}
                className={`px-3 py-1 text-[10px] rounded font-bold uppercase transition ${formType === 'bill' ? 'bg-indigo-600 text-white' : 'bg-neutral-950 text-neutral-500'}`}
              >
                Utility Bill
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Service Name</label>
              <input 
                id="input-bill-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix UK or Council Tax"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Cost per Cycle (£)</label>
              <input 
                id="input-bill-amount"
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 17.99"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Next Billing Date</label>
              <input 
                id="input-bill-duedate"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5 font-semibold">Financial Category</label>
              <select 
                id="select-bill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
              >
                <option value="Utilities & Bills">Utilities & Bills</option>
                <option value="Rent & Mortgage">Rent & Mortgage</option>
                <option value="Entertainment & Fun">Entertainment & Fun</option>
                <option value="Others & Misc">Others & Misc</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              id="btn-cancel-bill-form"
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              id="btn-save-bill-form"
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
            >
              Save Commitment
            </button>
          </div>
        </form>
      )}

      {/* Subscription Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mb-1">Monthly Subscription Burn</div>
            <div className="text-3xl font-extrabold text-neutral-200 font-mono">£{totalMonthlySubs.toFixed(2)}</div>
          </div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded font-mono">
            Cycle recurring
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold mb-1">Annualised Subscription Cost</div>
            <div className="text-3xl font-extrabold text-rose-400 font-mono">£{totalYearlySubs.toFixed(2)}</div>
          </div>
          <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded font-mono">
            Outflow projection
          </span>
        </div>
      </div>

      {/* Main List Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Subscriptions List (Cancelable) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-2">
            <Tv className="w-4 h-4 text-indigo-400" />
            Detected Active Subscriptions
          </h3>

          <div className="divide-y divide-neutral-900 space-y-4">
            {subscriptions.length === 0 ? (
              <p className="p-6 text-center text-xs text-neutral-500">No active subscriptions detected.</p>
            ) : (
              subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between pt-4 first:pt-0 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center font-bold text-sm">
                      {sub.name.includes('Spotify') ? '🎵' : sub.name.includes('Netflix') ? '📺' : sub.name.includes('Midjourney') ? '🎨' : '🎬'}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-200 group-hover:text-white transition flex items-center gap-2 text-sm">
                        {sub.name}
                        {sub.trend === 'increased' && (
                          <span className="text-[8px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono">
                            PRICE INCREASE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 font-medium">Next billing: {new Date(sub.nextBillingDate).toLocaleDateString([], { day:'numeric', month: 'short' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold font-mono text-neutral-300">£{sub.amount.toFixed(2)}/mo</span>
                    <button 
                      id={`btn-cancel-sub-${sub.id}`}
                      onClick={() => onCancelSubscription(sub.id)}
                      className="p-1.5 rounded hover:bg-rose-500/10 hover:text-rose-400 text-neutral-500 transition active:scale-95"
                      title="Cancel Subscription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders & Calendar integration side panel */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Upcoming Bills Calendar
            </h3>

            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-neutral-300">{bill.name}</div>
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5 font-semibold">
                      <Clock className="w-3 h-3 text-amber-500" /> Due: {new Date(bill.dueDate).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-neutral-200 font-mono">£{bill.amount.toFixed(2)}</div>
                    <span className={`text-[8px] font-extrabold uppercase ${bill.status === 'paid' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unused Subscriptions Alert Audit */}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-indigo-300 mt-6 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Unused Subscriptions Audit</span>
            </div>
            <p className="leading-relaxed text-[11px] text-neutral-400">
              Gemini audited your historical banking logs and detected you haven't logged into Midjourney for 45 days. Cancelling unused subscriptions today could reduce your outflow by <strong className="text-indigo-300">£288/year</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
