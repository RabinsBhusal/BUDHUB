/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Check, 
  ArrowRight, 
  Tv, 
  DollarSign, 
  HelpCircle, 
  Coins, 
  Target,
  FileText
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [savingsCounter, setSavingsCounter] = useState(312);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Animate the average savings counter to show active savings increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setSavingsCounter(prev => {
        if (prev >= 650) return 312; // loop back
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      title: "AI Financial Coach",
      description: "Chat with an intelligent advisor that identifies subscription waste, recommends hyper-personalized budgets, and explains where every pound goes."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Bank-Grade Security",
      description: "We use 256-bit encryption and multi-factor security. Your credentials are fully protected with read-only API bank integrations."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      title: "Automated Wealth Tracking",
      description: "Combine checking accounts, savings vaults, investment portfolios, mortgages, and crypto wallets into a single Unified Net Worth engine."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "Smart Subscription Detection",
      description: "Automatically detect hidden subscriptions, price increases, and duplicate payments before they trigger charges. Cancel with a tap."
    }
  ];

  const pricing = [
    {
      name: "Lite",
      price: "£0",
      description: "Perfect for students and those beginning their financial health journey.",
      features: [
        "Link up to 2 bank accounts",
        "Manual transaction tagging",
        "Basic monthly budgets",
        "Standard financial insights",
        "CSV data exporting"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "£8",
      period: "/month",
      description: "The complete personal financial ecosystem for power users.",
      features: [
        "Unlimited bank sync (Plaid/TrueLayer)",
        "Real-time AI Financial Coach chat",
        "Interactive goal projections & vaults",
        "Custom rollover envelope budgeting",
        "Investment allocation & Debt calculators",
        "CSV & PDF reports with one-click export"
      ],
      cta: "Get Started Pro",
      popular: true
    }
  ];

  const faqs = [
    {
      question: "Is this platform safe? How do you connect to my bank?",
      answer: "Absolutely. We are fully GDPR and PSD2 compliant. We use secure Open Banking partners (like TrueLayer or Plaid) to establish a highly secure, read-only connection. We never see or store your login credentials, and we cannot move any money."
    },
    {
      question: "How does the AI Financial Coach analyze my data?",
      answer: "Our server-side AI analyzes your historical transactions, bill patterns, and active subscription cycles to find duplication, detect sudden price jumps (like energy bills raising 18%), and offer customized daily saving advice. Your data is never sold or used to train third-party models."
    },
    {
      question: "Can I track manual accounts like cash or properties?",
      answer: "Yes! You can add checking, savings, credit cards, mortgages, or cash wallets manually, customize their balance, and update them easily."
    }
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Premium Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              AI Finance Platform
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400 font-medium">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              id="btn-login-header"
              onClick={onLogin}
              className="text-sm font-medium hover:text-white transition text-neutral-400"
            >
              Sign In
            </button>
            <button 
              id="btn-signup-header"
              onClick={onLogin}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Subtle glowing radial background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Eyebrow badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-indigo-400 font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering 40,000+ Smart Savers
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-none"
          >
            Understand Every <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
              Pound You Spend.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A beautiful, bank-secured personal finance ecosystem powered by Gemini AI. Track net worth, optimize recurring bills, cancel unwanted subscriptions, and achieve compound savings automatically.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              id="btn-hero-start"
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 font-semibold hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              id="btn-hero-demo"
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 border border-neutral-800 font-semibold hover:bg-neutral-800 transition flex items-center justify-center gap-2 text-neutral-300"
            >
              Explore Interactive Demo
            </button>
          </motion.div>

          {/* Savings Counter Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 inline-flex flex-col items-center p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md"
          >
            <div className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-2">Average User Annual Savings</div>
            <div className="text-4xl font-extrabold text-indigo-400 font-mono">£{savingsCounter}</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <span>+£45.20 detected today</span>
            </div>
          </motion.div>
        </div>

        {/* Floating cards & Dashboard preview visual container */}
        <div className="max-w-6xl mx-auto mt-24 relative px-4">
          <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 shadow-2xl backdrop-blur-sm">
            <div className="rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 shadow-inner p-6 min-h-[400px] flex flex-col justify-between">
              {/* Fake dashboard headers */}
              <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-neutral-500 font-mono ml-4">https://app.aifinance.platform/dashboard</span>
                </div>
                <div className="px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-indigo-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  HSBC & MONZO CONNECTED
                </div>
              </div>

              {/* Simulated Dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Total Assets</div>
                  <div className="text-3xl font-bold">£27,121.25</div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[70%]" />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                  <div className="text-xs text-neutral-400 mb-1">Monthly Spending Cap</div>
                  <div className="text-3xl font-bold">£1,420.00</div>
                  <div className="text-xs text-emerald-400 mt-2 font-medium">£312.40 remaining</div>
                </div>
                <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-400">Financial Health</div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">85 / 100</span>
                  </div>
                  <div className="text-sm text-neutral-300 mt-2 italic font-serif">"Emergency fund fully locked. Next step: reduce coffee subscriptions."</div>
                </div>
              </div>

              {/* Floating parallax items */}
              <div className="absolute -top-12 -left-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">£</div>
                <div>
                  <div className="text-[10px] text-neutral-400">Salary Received</div>
                  <div className="text-xs font-bold text-emerald-400">+£3,850.00</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">⚠</div>
                <div>
                  <div className="text-[10px] text-neutral-400">Duplicate Subs Detected</div>
                  <div className="text-xs font-bold text-red-400">-£17.99 double charged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-neutral-900 bg-neutral-950 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Smarter Financial Intelligence.
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Combine advanced analytical reporting, real-time banking synchronization, and a dedicated AI advisor inside one beautiful dark-canvas platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-indigo-500/40 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3 bg-neutral-900 rounded-xl w-12 h-12 flex items-center justify-center border border-neutral-850 mb-6 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-100 mb-2">{feat.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time stats display / Social proof */}
      <section className="py-20 border-t border-b border-neutral-900 bg-neutral-900/20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">£4.2M+</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Total Savings Managed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-2">40,000+</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Active Customers</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-2">99.9%</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Uptime bank connection</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-amber-400 mb-2">4.9/5</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">App Rating</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Premium Value. Zero Fluff.
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Choose the package that aligns with your household complexity. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((tier, idx) => (
              <div 
                key={idx}
                className={`p-8 rounded-2xl bg-neutral-900/60 border ${tier.popular ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-neutral-800'} relative flex flex-col justify-between`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white">
                    RECOMMENDED / POPULAR
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    {tier.period && <span className="text-sm text-neutral-400">{tier.period}</span>}
                  </div>
                  <p className="text-sm text-neutral-400 mb-6 leading-relaxed">{tier.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-sm text-neutral-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  id={`btn-pricing-cta-${idx}`}
                  onClick={onLogin}
                  className={`w-full py-3 rounded-xl font-semibold transition ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'}`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-neutral-900 bg-neutral-950/80 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-neutral-400">Everything you need to know about bank synchronization, security, and trial options.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-neutral-800 rounded-xl bg-neutral-900/30 overflow-hidden"
              >
                <button 
                  id={`btn-faq-toggle-${idx}`}
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-neutral-900/40 transition"
                >
                  <span className="font-semibold text-neutral-200 flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    {faq.question}
                  </span>
                  <span className="text-neutral-500 text-xl font-mono">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="p-6 pt-0 text-sm text-neutral-400 border-t border-neutral-900 bg-neutral-950/40 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-neutral-400 text-sm">AI Personal Finance Platform</span>
          </div>
          <div>
            © 2026 AI Personal Finance. Licensed under Apache-2.0. Bank-level secure read-only platform.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">GDPR Audit</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
