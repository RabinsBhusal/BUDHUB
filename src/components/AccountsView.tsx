/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  RefreshCw, 
  CreditCard, 
  Home, 
  TrendingUp, 
  Coins, 
  Wallet, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  PiggyBank,
  Briefcase
} from 'lucide-react';
import { Account, AccountType } from '../types';

interface AccountsViewProps {
  accounts: Account[];
  onAddAccount: (newAcc: Omit<Account, 'id' | 'lastSynced'>) => void;
  onSyncBanks: () => void;
}

export default function AccountsView({ accounts, onAddAccount, onSyncBanks }: AccountsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [balance, setBalance] = useState('');
  const [institution, setInstitution] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const getIcon = (type: AccountType) => {
    switch (type) {
      case 'checking': return <Wallet className="w-5 h-5 text-indigo-400" />;
      case 'savings': return <PiggyBank className="w-5 h-5 text-emerald-400" />;
      case 'credit': return <CreditCard className="w-5 h-5 text-amber-400" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'mortgage': return <Home className="w-5 h-5 text-rose-400" />;
      case 'crypto': return <Coins className="w-5 h-5 text-violet-400" />;
      case 'loan': return <CreditCard className="w-5 h-5 text-red-400" />;
      default: return <Wallet className="w-5 h-5 text-neutral-400" />;
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    onSyncBanks();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance || !institution) return;
    
    onAddAccount({
      name,
      type,
      balance: parseFloat(balance),
      currency: 'GBP',
      institution
    });

    setName('');
    setBalance('');
    setInstitution('');
    setShowAddForm(false);
  };

  return (
    <div id="accounts-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Financial Accounts</h1>
          <p className="text-sm text-neutral-400">Manage checking, savings, credit, mortgage, investment portfolios and crypto wallets.</p>
        </div>

        <div className="flex gap-3">
          <button 
            id="btn-sync-accounts-view"
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-200 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Bank APIs'}
          </button>
          
          <button 
            id="btn-toggle-add-account"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Account
          </button>
        </div>
      </div>

      {/* Add Account Inline Form */}
      {showAddForm && (
        <form 
          id="add-account-form"
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-4"
        >
          <h3 className="font-bold text-sm text-white uppercase tracking-wider">Link Custom Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Account Name</label>
              <input 
                id="input-acc-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monzo Joint Checking"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Institution</label>
              <input 
                id="input-acc-institution"
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Monzo Bank"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Account Type</label>
              <select 
                id="select-acc-type"
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="checking">Checking / Current</option>
                <option value="savings">Savings Vault</option>
                <option value="credit">Credit Card</option>
                <option value="investment">Investment Portfolio</option>
                <option value="mortgage">Mortgage / Loan</option>
                <option value="crypto">Crypto Wallet</option>
                <option value="cash">Manual Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Initial Balance (£)</label>
              <input 
                id="input-acc-balance"
                type="number"
                step="0.01"
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="e.g. 1250.00"
                className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-2">
            <button 
              id="btn-cancel-account"
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              id="btn-save-account"
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
            >
              Link Account
            </button>
          </div>
        </form>
      )}

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => {
          const isNegative = acc.balance < 0;
          return (
            <div 
              key={acc.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm flex flex-col justify-between hover:border-neutral-800 transition group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center">
                    {getIcon(acc.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-200 text-sm group-hover:text-white transition">{acc.name}</h3>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">{acc.institution}</p>
                  </div>
                </div>
                
                <span className="text-[10px] bg-neutral-900 text-neutral-400 border border-neutral-850 px-2 py-0.5 rounded font-mono uppercase">
                  {acc.type}
                </span>
              </div>

              <div className="mt-8 flex justify-between items-end border-t border-neutral-900 pt-4">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">AVAILABLE BALANCE</div>
                  <div className={`text-2xl font-extrabold font-mono ${isNegative ? 'text-rose-400' : 'text-neutral-100'}`}>
                    £{acc.balance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    CONNECTED
                  </div>
                  <span className="text-[9px] text-neutral-500 font-mono block mt-1">
                    Synced {new Date(acc.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
