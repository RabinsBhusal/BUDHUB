/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  Upload, 
  Filter, 
  Plus, 
  FileText, 
  X, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Link,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Transaction, Account } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  onAddTransaction: (newTx: Omit<Transaction, 'id'>) => void;
  onImportCSV: (importedTxs: Omit<Transaction, 'id'>[]) => void;
}

export default function TransactionsView({
  transactions,
  accounts,
  onAddTransaction,
  onImportCSV
}: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food & Dining');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [attachedReceipt, setAttachedReceipt] = useState<string | null>(null);

  // File Upload states (drag & drop)
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Sort Logic
  const filteredTxs = transactions
    .filter(tx => {
      const matchesSearch = tx.merchant.toLowerCase().includes(search.toLowerCase()) || 
        (tx.notes && tx.notes.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortField === 'date') {
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier;
      } else {
        return (Math.abs(a.amount) - Math.abs(b.amount)) * multiplier;
      }
    });

  // Client-side CSV Download Export
  const handleExportCSV = () => {
    const headers = "ID,Account,Merchant,Category,Date,Amount,Type,Status,Notes\n";
    const rows = filteredTxs.map(t => 
      `"${t.id}","${t.accountName}","${t.merchant}","${t.category}","${t.date}",${t.amount},"${t.type}","${t.status}","${t.notes || ''}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI-Finance-Platform-Statement-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import Simulation
  const handleImportCSVTrigger = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Create rich mock imported transactions
    const imported: Omit<Transaction, 'id'>[] = [
      {
        accountId: accounts[0]?.id || 'acc_1',
        accountName: accounts[0]?.name || 'HSBC Checking',
        merchant: 'Costco Wholesale Corp',
        logo: 'ShoppingCart',
        category: 'Food & Dining',
        date: new Date().toISOString(),
        amount: -185.20,
        type: 'expense',
        status: 'completed',
        isRecurring: false,
        notes: 'Imported bulk food supply'
      },
      {
        accountId: accounts[0]?.id || 'acc_1',
        accountName: accounts[0]?.name || 'HSBC Checking',
        merchant: 'Spotify Subscription Upgrade',
        logo: 'Music',
        category: 'Entertainment & Fun',
        date: new Date().toISOString(),
        amount: -19.99,
        type: 'expense',
        status: 'completed',
        isRecurring: true,
        recurringInterval: 'monthly',
        notes: 'Imported recurring billing'
      }
    ];

    onImportCSV(imported);
    alert('Successfully parsed and imported 2 new transactions!');
  };

  // Handle Drag over
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedReceipt(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedReceipt(e.target.files[0].name);
    }
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const selectedAcc = accounts.find(a => a.id === accountId);
    
    onAddTransaction({
      accountId,
      accountName: selectedAcc ? selectedAcc.name : 'Unknown Account',
      merchant,
      logo: type === 'income' ? 'Briefcase' : 'CreditCard',
      category,
      date: new Date().toISOString(),
      amount: type === 'income' ? parseFloat(amount) : -Math.abs(parseFloat(amount)),
      type,
      status: 'completed',
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : undefined,
      notes,
      attachment: attachedReceipt || undefined
    });

    // Reset Form
    setMerchant('');
    setAmount('');
    setNotes('');
    setIsRecurring(false);
    setAttachedReceipt(null);
    setShowAddForm(false);
  };

  return (
    <div id="transactions-view" className="space-y-8 max-w-7xl mx-auto px-1">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Transaction Statement</h1>
          <p className="text-sm text-neutral-400">Search, filter, categorize, or export your connected financial statements.</p>
        </div>

        <div className="flex gap-3">
          {/* Invisible file picker for importing CSV */}
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleImportCSVTrigger} 
            className="hidden" 
          />
          <button 
            id="btn-import-csv"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 transition active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>

          <button 
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-300 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          
          <button 
            id="btn-toggle-add-tx"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white transition active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            Log Transaction
          </button>
        </div>
      </div>

      {/* Manual Log Transaction Form */}
      {showAddForm && (
        <form 
          id="add-transaction-form"
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-850 space-y-6"
        >
          <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Log Manual Transaction</h3>
            <button 
              id="btn-close-tx-form"
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Merchant / Source Name</label>
                <input 
                  id="tx-input-merchant"
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Tesco Metro"
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Amount (£)</label>
                <input 
                  id="tx-input-amount"
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 18.50"
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Payment / Transfer Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    id="btn-tx-type-expense"
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 rounded text-xs font-semibold border ${type === 'expense' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
                  >
                    Expense
                  </button>
                  <button 
                    id="btn-tx-type-income"
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 rounded text-xs font-semibold border ${type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
                  >
                    Income
                  </button>
                </div>
              </div>
            </div>

            {/* Categorization & Metadata */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Target Wallet / Account</label>
                <select 
                  id="tx-select-account"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (£{a.balance})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Financial Category</label>
                <select 
                  id="tx-select-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping & Style">Shopping & Style</option>
                  <option value="Utilities & Bills">Utilities & Bills</option>
                  <option value="Travel & Transport">Travel & Transport</option>
                  <option value="Entertainment & Fun">Entertainment & Fun</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Salary & Income">Salary & Income</option>
                  <option value="Savings & Investments">Savings & Investments</option>
                  <option value="Others & Misc">Others & Misc</option>
                </select>
              </div>

              <div className="flex items-center gap-4.5 pt-2">
                <div className="flex items-center gap-2">
                  <input 
                    id="tx-check-recurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-neutral-950 border-neutral-800 focus:ring-0"
                  />
                  <span className="text-xs text-neutral-300 font-semibold">Recurring Bill / Salary</span>
                </div>
                {isRecurring && (
                  <select 
                    id="tx-select-interval"
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(e.target.value as any)}
                    className="text-xs p-1.5 rounded bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
            </div>

            {/* Receipt Upload (Drag & Drop) */}
            <div className="space-y-4">
              <label className="block text-xs text-neutral-400 mb-1.5">Attach Expense Receipt (Drag & Drop)</label>
              <div 
                id="drag-and-drop-area"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('receipt-file-picker')?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900'}`}
              >
                <input 
                  id="receipt-file-picker"
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-850 text-neutral-400">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  {attachedReceipt ? (
                    <div className="space-y-1">
                      <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-center">
                        <CheckCircle className="w-3.5 h-3.5" /> Attached
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate max-w-[180px] font-mono">{attachedReceipt}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-neutral-300 font-bold">Drag receipt here or click to browse</p>
                      <p className="text-[10px] text-neutral-500 mt-1">Supports PDF, PNG, JPEG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-neutral-850">
            <button 
              id="btn-cancel-add-tx"
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button 
              id="btn-save-add-tx"
              type="submit" 
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-md"
            >
              Log Transaction
            </button>
          </div>
        </form>
      )}

      {/* Filters Control Tower */}
      <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        
        {/* Search */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1.5 font-semibold uppercase tracking-wider">Search statement</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input 
              id="search-transactions"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchant, notes..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1.5 font-semibold uppercase tracking-wider font-semibold">Category</label>
          <select 
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Rent & Mortgage">Rent & Mortgage</option>
            <option value="Shopping & Style">Shopping & Style</option>
            <option value="Utilities & Bills">Utilities & Bills</option>
            <option value="Travel & Transport">Travel & Transport</option>
            <option value="Entertainment & Fun">Entertainment & Fun</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Salary & Income">Salary & Income</option>
            <option value="Savings & Investments">Savings & Investments</option>
            <option value="Others & Misc">Others & Misc</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs text-neutral-400 mb-1.5 font-semibold uppercase tracking-wider">Cashflow type</label>
          <select 
            id="filter-type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Income & Expense</option>
            <option value="expense">Expense Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Sorting Toggle */}
        <div className="flex gap-2">
          <button 
            id="btn-sort-date"
            onClick={() => {
              if (sortField === 'date') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else { setSortField('date'); setSortOrder('desc'); }
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition ${sortField === 'date' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort Date
          </button>
          <button 
            id="btn-sort-amount"
            onClick={() => {
              if (sortField === 'amount') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              else { setSortField('amount'); setSortOrder('desc'); }
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold border transition ${sortField === 'amount' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort Size
          </button>
        </div>
      </div>

      {/* Main Transactions Table Grid */}
      <div className="rounded-2xl border border-neutral-900 overflow-hidden bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-900 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold bg-neutral-900/20">
                <th className="p-4.5">Merchant / Reference</th>
                <th className="p-4.5">Financial Category</th>
                <th className="p-4.5">Account / Source</th>
                <th className="p-4.5">Date</th>
                <th className="p-4.5">Status</th>
                <th className="p-4.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-sm">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500 text-xs">
                    No matching transaction logs found. Try tweaking your query search or category filters.
                  </td>
                </tr>
              ) : (
                filteredTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-neutral-900/20 transition group">
                    <td className="p-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8.5 h-8.5 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-xs">
                          {tx.type === 'income' ? '💰' : '💳'}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-200 group-hover:text-white transition flex items-center gap-1.5">
                            {tx.merchant}
                            {tx.isRecurring && (
                              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full font-semibold uppercase">
                                RECURRING
                              </span>
                            )}
                          </div>
                          {tx.notes && <p className="text-[10px] text-neutral-500 max-w-xs truncate italic">"{tx.notes}"</p>}
                        </div>
                      </div>
                    </td>

                    <td className="p-4.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-850 text-neutral-300">
                        {tx.category}
                      </span>
                    </td>

                    <td className="p-4.5 text-xs text-neutral-400 font-semibold">{tx.accountName}</td>

                    <td className="p-4.5 text-xs text-neutral-500 font-mono">
                      {new Date(tx.date).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    <td className="p-4.5">
                      {tx.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle className="w-3 h-3" /> COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>

                    <td className="p-4.5 text-right">
                      <div className={`font-extrabold font-mono ${tx.type === 'income' ? 'text-emerald-400' : 'text-neutral-100'}`}>
                        {tx.type === 'income' ? '+' : '-'}£{Math.abs(tx.amount).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
