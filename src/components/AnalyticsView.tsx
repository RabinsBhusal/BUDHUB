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
  ArrowRight, 
  Calendar, 
  PieChart, 
  LineChart, 
  Info,
  Clock,
  CircleCheck
} from 'lucide-react';
import { Transaction, Account, Category } from '../types';

interface AnalyticsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}

export default function AnalyticsView({
  transactions,
  accounts,
  categories
}: AnalyticsViewProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<'spending' | 'cashflow' | 'projections'>('spending');

  // 1. Calculate category spending ratios for August 2026
  const getCategorySpending = () => {
    const expenseTxs = transactions.filter(t => t.type === 'expense' && t.date.includes('2026-08'));
    const totalExpense = Math.abs(expenseTxs.reduce((sum, t) => sum + t.amount, 0));

    if (totalExpense === 0) return [];

    return categories
      .map(cat => {
        const spent = Math.abs(
          expenseTxs
            .filter(t => t.category === cat.name)
            .reduce((sum, t) => sum + t.amount, 0)
        );
        const percentage = Math.round((spent / totalExpense) * 100);
        return {
          id: cat.id,
          name: cat.name,
          spent,
          percentage,
          color: cat.color
        };
      })
      .filter(c => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  };

  const categorySpendingData = getCategorySpending();

  // 2. Mock 6-Month Net Worth timeline data
  const netWorthTimeline = [
    { month: 'Mar 2026', value: 20100 },
    { month: 'Apr 2026', value: 21500 },
    { month: 'May 2026', value: 22400 },
    { month: 'Jun 2026', value: 24100 },
    { month: 'Jul 2026', value: 25420.50 },
    { month: 'Aug 2026', value: 27121.25 }
  ];

  // SVG dimensions for charts
  const width = 500;
  const height = 220;
  const padding = 40;

  // Render curved SVG line for Net Worth Timeline
  const generateLinePath = () => {
    const minVal = 18000;
    const maxVal = 28000;
    
    return netWorthTimeline.map((pt, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (netWorthTimeline.length - 1);
      // invert y coordinate since SVG (0,0) is top-left
      const y = height - padding - ((pt.value - minVal) * (height - 2 * padding)) / (maxVal - minVal);
      return { x, y, ...pt };
    });
  };

  const points = generateLinePath();
  const pathString = points.reduce((str, pt, idx) => {
    return str + (idx === 0 ? `M ${pt.x} ${pt.y}` : ` L ${pt.x} ${pt.y}`);
  }, '');

  return (
    <div id="analytics-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Financial Intelligence</h1>
          <p className="text-sm text-neutral-400">Advanced spend distributions, historical timeline curves, and predictive forecasting.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-neutral-900 p-1.5 rounded-xl border border-neutral-850">
          <button 
            id="tab-spend"
            onClick={() => setAnalyticsTab('spending')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${analyticsTab === 'spending' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
          >
            Category Spending
          </button>
          <button 
            id="tab-cash"
            onClick={() => setAnalyticsTab('cashflow')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${analyticsTab === 'cashflow' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
          >
            Wealth Growth
          </button>
        </div>
      </div>

      {/* Main Analysis content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Render Spend Distribution (Pie/Bar Representation) */}
        {analyticsTab === 'spending' && (
          <>
            {/* Left side: Interactive SVG Donut chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  Category Outflow Distribution (August)
                </h3>
                
                {/* SVG Donut implementation */}
                <div className="flex justify-center items-center h-48 relative">
                  <svg width="200" height="200" className="transform -rotate-90">
                    <circle cx="100" cy="100" r="70" stroke="#171717" strokeWidth="16" fill="transparent" />
                    {categorySpendingData.reduce((accum, cat, index) => {
                      const totalArc = 439.8; // 2 * PI * r (70)
                      const strokeDashOffset = totalArc - (totalArc * cat.percentage) / 100;
                      const strokeDashArray = `${totalArc} ${totalArc}`;
                      
                      const element = (
                        <circle 
                          key={cat.id}
                          cx="100" 
                          cy="100" 
                          r="70" 
                          stroke={cat.color} 
                          strokeWidth="16" 
                          fill="transparent" 
                          strokeDasharray={strokeDashArray}
                          strokeDashoffset={accum.offset}
                          strokeLinecap="round"
                          className="transition-all hover:stroke-[22px] cursor-pointer"
                          onMouseEnter={() => setHoveredCategory(cat.name)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        />
                      );

                      return {
                        offset: accum.offset - (totalArc * cat.percentage) / 100,
                        elements: [...accum.elements, element]
                      };
                    }, { offset: 439.8, elements: [] as React.ReactNode[] }).elements}
                  </svg>

                  {/* Centered tooltip */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                      {hoveredCategory || 'Active Outflow'}
                    </span>
                    <span className="text-xl font-extrabold text-white font-mono">
                      {hoveredCategory ? 
                        `£${categorySpendingData.find(c => c.name === hoveredCategory)?.spent.toFixed(0)}` 
                        : `£${categorySpendingData.reduce((sum, c) => sum + c.spent, 0).toFixed(0)}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-500 mt-4 border-t border-neutral-900/40 pt-4 text-center">
                Hover over segment circles to drill down on exact spend figures.
              </div>
            </div>

            {/* Right side: Detailed category list */}
            <div className="p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider mb-4">Detailed Breakdown</h3>
              
              <div className="space-y-4">
                {categorySpendingData.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-neutral-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span className="font-mono text-neutral-400">
                        £{cat.spent.toFixed(0)} <strong className="text-neutral-300">({cat.percentage}%)</strong>
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Render Wealth Timeline (Net worth curved visual graph) */}
        {analyticsTab === 'cashflow' && (
          <>
            {/* Curves */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-indigo-400" />
                  Historical Net Worth growth Curve
                </h3>

                <div className="relative h-[220px]">
                  <svg width="100%" height="220" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                    {/* Grid lines */}
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262626" strokeWidth="1" />
                    <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#262626" strokeDasharray="3 3" />
                    
                    {/* Curved line */}
                    <path 
                      d={pathString} 
                      fill="none" 
                      stroke="#6366f1" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />

                    {/* Nodes representing months */}
                    {points.map((pt, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="5" 
                          fill="#18181b" 
                          stroke="#6366f1" 
                          strokeWidth="2.5" 
                        />
                        <text 
                          x={pt.x} 
                          y={pt.y - 12} 
                          fill="#ffffff" 
                          fontSize="9" 
                          fontFamily="monospace"
                          textAnchor="middle"
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 px-1 py-0.5 rounded font-bold"
                        >
                          £{pt.value.toLocaleString()}
                        </text>
                        <text 
                          x={pt.x} 
                          y={height - padding + 16} 
                          fill="#737373" 
                          fontSize="9" 
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="text-xs text-neutral-500 mt-4 border-t border-neutral-900/40 pt-4 text-center">
                Interactive wealth nodes display exact monthly values on cursor hover.
              </div>
            </div>

            {/* Right side helper info card */}
            <div className="p-6 rounded-2xl bg-neutral-900/20 border border-neutral-900 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                  Predictive Analysis
                </h3>
                
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Based on your current monthly compound rate (average <strong className="text-emerald-400">+6.4% growth</strong>), your projected net worth is expected to breach <strong className="text-indigo-400 font-mono">£35,000</strong> by March 2027.
                </p>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl space-y-1.5">
                  <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">OPTIMIZATION OPPORTUNITY</div>
                  <p className="text-[11px] text-neutral-300">
                    Allocating £200/mo from manual cash to index ETFs would add an extra projected £1,240 over 5 years.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                <CircleCheck className="w-3.5 h-3.5" />
                DUE CALCULATIONS ARE SECURE
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
