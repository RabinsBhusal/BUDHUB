/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CreditCard, 
  Percent, 
  Sparkles, 
  Coins, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { DebtItem } from '../types';

interface DebtsViewProps {
  debts: DebtItem[];
}

export default function DebtsView({ debts }: DebtsViewProps) {
  const [extraPayment, setExtraPayment] = useState<number>(150);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  // Perform Snowball vs Avalanche comparative calculations
  // Mock simplified calculations for financial simulation
  const simulatePayoff = (method: 'avalanche' | 'snowball') => {
    // Avalanche prioritizes highest interest rates
    // Snowball prioritizes smallest balance sizes
    const activeDebts = [...debts];
    
    let totalBalance = activeDebts.reduce((sum, d) => sum + d.balance, 0);
    if (totalBalance === 0) return { months: 0, interest: 0 };

    let weightedInterest = activeDebts.reduce((sum, d) => sum + (d.balance * d.interestRate), 0) / totalBalance;
    
    // extra payment reduces interest paid over time
    const baseInterestPaid = totalBalance * (weightedInterest / 100) * 5; // simplified over 5 years
    const extraReductionFactor = Math.min(0.8, (extraPayment / 500));
    
    let simulatedInterestPaid = baseInterestPaid * (1 - extraReductionFactor);
    let simulatedMonths = Math.max(12, Math.round((totalBalance / (1200 + extraPayment)) * 12));

    // Method comparison factor
    if (method === 'avalanche') {
      simulatedInterestPaid *= 0.92; // saves slightly more interest
    } else {
      simulatedMonths *= 0.95; // builds faster psychological momentum
      simulatedInterestPaid *= 1.02; 
    }

    return {
      months: Math.round(simulatedMonths),
      interestPaid: simulatedInterestPaid
    };
  };

  const avalancheResults = simulatePayoff('avalanche');
  const snowballResults = simulatePayoff('snowball');

  return (
    <div id="debts-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Debt Payoff Calculator</h1>
          <p className="text-sm text-neutral-400">Optimize outstanding credit limits or loans. Compare repayment strategies to minimize interest.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Debts Registry */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider">Active Outflow Liabilities</h3>
          
          <div className="space-y-4">
            {debts.map((d, idx) => (
              <div key={idx} className="p-4.5 bg-neutral-950 border border-neutral-850 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-center text-rose-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-200">{d.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-0.5 font-semibold">
                      INTEREST RATE: {d.interestRate}% • Min Pay: £{d.minPayment}/mo
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-rose-400 font-mono">£{d.balance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                  <span className="text-[9px] text-neutral-500 font-mono uppercase font-semibold">REPAYING TERM: {d.termMonths} MONTHS</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Extra Payment Slider */}
          <div className="pt-6 border-t border-neutral-900/60 space-y-3">
            <div className="flex justify-between items-center text-xs text-neutral-300 font-semibold">
              <span>Extra Monthly Payment Boost</span>
              <span className="font-mono text-indigo-400 font-extrabold text-sm">£{extraPayment}/mo</span>
            </div>
            <input 
              id="slider-extra-payment"
              type="range"
              min="0"
              max="1000"
              step="50"
              value={extraPayment}
              onChange={(e) => setExtraPayment(parseInt(e.target.value))}
              className="w-full accent-indigo-500 bg-neutral-950 h-2.5 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-[10px] text-neutral-500 italic">Adding extra payments directly accelerates checking-account capital to pay down outstanding debt principle.</p>
          </div>
        </div>

        {/* Snowball vs Avalanche Comparison */}
        <div className="p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              Strategy Comparison
            </h3>

            {/* Avalanche Summary */}
            <div className="p-4.5 bg-neutral-950 border border-neutral-850 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">1. Avalanche Strategy</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded uppercase font-extrabold font-mono">Interest Saver</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed">Prioritizes highest interest rates first. Saves the maximum currency on compound fees.</p>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-900">
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">PAYOFF TIME</div>
                  <div className="text-sm font-bold text-white font-mono">{avalancheResults.months} months</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">EST. INTEREST</div>
                  <div className="text-sm font-bold text-white font-mono">£{avalancheResults.interestPaid.toFixed(0)}</div>
                </div>
              </div>
            </div>

            {/* Snowball Summary */}
            <div className="p-4.5 bg-neutral-950 border border-neutral-850 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">2. Snowball Strategy</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded uppercase font-extrabold font-mono">Psychological Win</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed">Prioritizes smallest balances first. Builds momentum quickly by clearing cards fast.</p>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-900">
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">PAYOFF TIME</div>
                  <div className="text-sm font-bold text-white font-mono">{snowballResults.months} months</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">EST. INTEREST</div>
                  <div className="text-sm font-bold text-white font-mono">£{snowballResults.interestPaid.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl flex items-start gap-2.5 text-[10px] text-indigo-300 mt-6 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>
              <strong>Coach Recommendation:</strong> Use the Avalanche strategy to save <strong className="text-indigo-400 font-mono">£{Math.abs(snowballResults.interestPaid - avalancheResults.interestPaid).toFixed(0)}</strong> in mortgage & credit card fees over the lifetime of these loans.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
