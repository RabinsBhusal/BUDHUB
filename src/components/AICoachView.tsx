/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Trash2, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp, 
  Briefcase, 
  Coffee, 
  AlertTriangle 
} from 'lucide-react';
import { Account, Transaction, Budget, Goal, Subscription } from '../types';

interface AICoachViewProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function AICoachView({ 
  accounts, 
  transactions, 
  budgets, 
  goals, 
  subscriptions 
}: AICoachViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm your AI Financial Coach. 🤖\n\nI've integrated all of your active checking accounts, savings vaults, current budgets, and monthly subscription schedules. I can help you find wasteful duplicate subscriptions, analyze where your food budget goes, predict low balance dates, or explain complex investment mechanics.\n\nWhat would you like to analyze today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    { text: "Find duplicate or unused subscriptions", icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> },
    { text: "Suggest a budget rollover plan", icon: <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> },
    { text: "Explain my coffee spending habits", icon: <Coffee className="w-3.5 h-3.5 text-amber-400" /> },
    { text: "Am I on track for my emergency fund?", icon: <Target className="w-3.5 h-3.5 text-emerald-400" /> }
  ];

  // Helper to construct financial context payload
  const getFinancialContext = () => {
    const netWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    return {
      netWorth: netWorth.toFixed(2),
      accounts: accounts.map(a => ({ name: a.name, balance: a.balance, institution: a.institution })),
      budgets: budgets.map(b => ({ categoryName: b.categoryName, amount: b.amount })),
      transactions: transactions.map(t => ({ merchant: t.merchant, amount: t.amount, category: t.category, type: t.type, date: t.date })),
      subscriptions: subscriptions.map(s => ({ name: s.name, amount: s.amount, trend: s.trend })),
      goals: goals.map(g => ({ name: g.name, target: g.targetAmount, current: g.currentAmount }))
    };
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Create the messages history that is expected by server.ts
      const messageHistory = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory,
          financialContext: getFinancialContext()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from backend coach.');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-error`,
        sender: 'bot',
        text: `Oops! I had trouble connecting to the server: ${err.message}. Please double-check your Internet connection and confirm process.env.GEMINI_API_KEY is configured correctly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Chat cleared. Ask me anything about your current budget state, subscriptions, or financial goals!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Icon representing Goals inside quickPrompts
  function Target({ className }: { className?: string }) {
    return <Sparkles className={className} />;
  }

  return (
    <div id="ai-coach-view" className="flex flex-col h-[calc(100vh-140px)] bg-neutral-950 rounded-2xl border border-neutral-900 overflow-hidden">
      
      {/* Top Banner */}
      <div className="px-6 py-4 bg-neutral-900/60 border-b border-neutral-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-neutral-100 flex items-center gap-2 text-sm md:text-base">
              AI Financial Coach
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-semibold uppercase">
                Active context
              </span>
            </h2>
            <p className="text-xs text-neutral-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>

        <button 
          id="btn-clear-chat"
          onClick={clearChat}
          className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-900 transition"
        >
          <Trash2 className="w-4 h-4" />
          Clear Conversation
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-4 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-indigo-400 border border-neutral-700'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content Card */}
            <div>
              <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-neutral-900/80 border border-neutral-850 text-neutral-200 rounded-tl-none'}`}>
                {msg.text}
              </div>
              <span className={`text-[10px] text-neutral-500 block mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-2xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 text-indigo-400 border border-neutral-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] text-indigo-400 font-mono animate-pulse">Running financial audits...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Inputs Footer */}
      <div className="p-6 bg-neutral-900/40 border-t border-neutral-900 shrink-0 space-y-4">
        {/* Quick Suggestion Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button 
              id={`btn-quick-prompt-${idx}`}
              key={idx}
              onClick={() => handleSend(qp.text)}
              className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full px-3.5 py-1.5 text-neutral-300 transition flex items-center gap-2 hover:border-neutral-700 active:scale-95"
            >
              {qp.icon}
              {qp.text}
            </button>
          ))}
        </div>

        {/* Text Input Panel */}
        <form 
          id="ai-coach-chat-form"
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-3"
        >
          <input 
            id="ai-coach-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything (e.g. 'How much did I spend in August?')"
            className="flex-1 bg-neutral-900 text-neutral-200 border border-neutral-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-sm placeholder-neutral-500"
          />
          <button 
            id="btn-ai-coach-submit"
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Coach</span>
          </button>
        </form>
      </div>

    </div>
  );
}
