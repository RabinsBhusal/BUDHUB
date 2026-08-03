/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  CheckCircle, 
  X, 
  CreditCard,
  Briefcase,
  AlertTriangle,
  Play,
  Clock,
  Check
} from 'lucide-react';
import { UserProfile, SupportTicket } from '../types';
import { SECURITY_LOGS } from '../mockData';

const PREMIUM_THEMES = [
  { id: 'dark', name: 'Luxury Sapphire', desc: 'Deep indigo accents with a premium dark workspace layout', primaryColor: 'bg-indigo-600', previewBg: 'bg-neutral-950', isDark: true },
  { id: 'gold', name: 'Royal Gold', desc: 'Elegant amber gold on a luxurious, warm charcoal black background', primaryColor: 'bg-amber-500', previewBg: 'bg-stone-950', isDark: true },
  { id: 'cyber', name: 'Cyber Violet', desc: 'High-energy cyberpunk-themed amethyst and neon violet dark mode', primaryColor: 'bg-purple-600', previewBg: 'bg-indigo-950/65', isDark: true },
  { id: 'carbon', name: 'Stealth Carbon', desc: 'Monochromatic black-and-silver dashboard with clean white accents', primaryColor: 'bg-neutral-100', previewBg: 'bg-neutral-950', isDark: true },
  { id: 'light', name: 'Refined Chalk', desc: 'Sleek, high-contrast light mode with beautiful indigo accents', primaryColor: 'bg-indigo-600', previewBg: 'bg-neutral-100', isDark: false },
  { id: 'emerald', name: 'Emerald Garden', desc: 'Fresh, professional sage green light layout for clean organic finance', primaryColor: 'bg-emerald-600', previewBg: 'bg-emerald-50/50', isDark: false },
  { id: 'frost', name: 'Nordic Frost', desc: 'Cool-toned ice blue accents set on a modern Scandinavian slate-blue canvas', primaryColor: 'bg-sky-500', previewBg: 'bg-slate-100', isDark: false },
  { id: 'sunset', name: 'Desert Sunset', desc: 'Warm desert hues, peach sands, and rich crimson-terracotta tones', primaryColor: 'bg-rose-600', previewBg: 'bg-amber-50/10', isDark: false },
];

interface SettingsAndAdminViewProps {
  user: UserProfile;
  tickets: SupportTicket[];
  onUpdatePreferences: (updatedPrefs: UserProfile['preferences']) => void;
  onUpdateTickets: (updatedTickets: SupportTicket[]) => void;
}

export default function SettingsAndAdminView({
  user,
  tickets,
  onUpdatePreferences,
  onUpdateTickets
}: SettingsAndAdminViewProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'admin'>('settings');

  // Settings states
  const [currency, setCurrency] = useState(user.preferences.currency);
  const [timezone, setTimezone] = useState(user.preferences.timezone);
  const [theme, setTheme] = useState(user.preferences.theme);
  const [language, setLanguage] = useState(user.preferences.language);
  const [connectedBanks, setConnectedBanks] = useState(user.preferences.connectedBanks);

  // Admin Ticket replying
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // Feature Flags
  const [flags, setFlags] = useState({
    enableOcrReceipts: true,
    enableForecasting: false,
    enableOpenBankingPlaid: true,
    enableSharedHouseholds: false
  });

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      currency,
      timezone,
      theme,
      language,
      connectedBanks
    });
    alert('User preferences persisted successfully!');
  };

  const handleToggleBank = (bank: string) => {
    if (connectedBanks.includes(bank)) {
      setConnectedBanks(connectedBanks.filter(b => b !== bank));
    } else {
      setConnectedBanks([...connectedBanks, bank]);
    }
  };

  const handleTicketReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !ticketReply.trim()) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'resolved' as const,
          messages: [
            ...t.messages,
            { sender: 'agent' as const, text: ticketReply, time: new Date().toISOString() }
          ]
        };
      }
      return t;
    });

    onUpdateTickets(updated);
    setTicketReply('');
    setSelectedTicketId(null);
    alert('Agent reply logged! Ticket status set to Resolved.');
  };

  return (
    <div id="settings-admin-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header and top tab selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Control Tower & Settings</h1>
          <p className="text-sm text-neutral-400">Configure client-side currency symbols or access the simulated admin service desk.</p>
        </div>

        <div className="flex bg-neutral-900 p-1.5 rounded-xl border border-neutral-850">
          <button 
            id="btn-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            User Settings
          </button>
          <button 
            id="btn-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* Main Settings Panel */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* User profile card & Bank syncing toggles */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 text-center">
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500 shadow-md mb-4" 
              />
              <h3 className="font-bold text-neutral-200 text-base">{user.name}</h3>
              <p className="text-xs text-neutral-500">{user.email}</p>
              
              <div className="mt-6 pt-6 border-t border-neutral-900 grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-950 rounded-xl">
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">ACCOUNT TIER</div>
                  <div className="text-xs font-bold text-indigo-400">Pro Premium</div>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl">
                  <div className="text-[9px] text-neutral-500 uppercase font-semibold">MEMBER SINCE</div>
                  <div className="text-xs font-bold text-neutral-300">July 2026</div>
                </div>
              </div>
            </div>

            {/* Bank toggler list */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-4">
              <h4 className="font-bold text-xs text-neutral-200 uppercase tracking-wider">Connected Bank APIs</h4>
              
              <div className="space-y-2.5">
                {['Monzo', 'HSBC', 'Amex', 'Vanguard'].map((bank) => {
                  const connected = connectedBanks.includes(bank);
                  return (
                    <div key={bank} className="flex justify-between items-center p-3 bg-neutral-950 border border-neutral-850 rounded-xl text-xs">
                      <span className="font-semibold text-neutral-300">{bank} Connection</span>
                      <button 
                        id={`btn-toggle-bank-${bank}`}
                        type="button"
                        onClick={() => handleToggleBank(bank)}
                        className={`px-3 py-1 text-[10px] rounded font-bold uppercase transition ${connected ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/25' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}
                      >
                        {connected ? 'CONNECTED' : 'DISCONNECTED'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preferences Settings Form */}
          <form 
            id="preferences-form"
            onSubmit={handlePreferencesSave}
            className="md:col-span-2 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-6"
          >
            <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider">Configure Regional & Appearance Preferences</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-neutral-400 mb-2 font-semibold">Platform Currency Symbol</label>
                <select 
                  id="pref-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                >
                  <option value="GBP">British Pound (£)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-2 font-semibold">Timezone</label>
                <select 
                  id="pref-timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                >
                  <option value="UTC+1">UTC+1 (London / Greenwich)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC-5">UTC-5 (EST / New York)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-2 font-semibold">Language Translation</label>
                <select 
                  id="pref-lang"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                >
                  <option value="English (UK)">English (UK)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Español">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-2 font-semibold">Appearance Theme (Quick Select)</label>
                <select 
                  id="pref-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none"
                >
                  <option value="dark">Luxury Sapphire (Dark Default)</option>
                  <option value="gold">Royal Gold (Dark Luxury)</option>
                  <option value="cyber">Cyber Violet (Vibrant Amethyst)</option>
                  <option value="carbon">Stealth Carbon (Monochrome Dark)</option>
                  <option value="light">Refined Chalk (Light Default)</option>
                  <option value="emerald">Emerald Garden (Fresh Green Light)</option>
                  <option value="frost">Nordic Frost (Ice Slate Light)</option>
                  <option value="sunset">Desert Sunset (Warm Terracotta Light)</option>
                </select>
              </div>
            </div>

            {/* Design Gallery */}
            <div className="pt-6 border-t border-neutral-900 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-neutral-200 uppercase tracking-wider">Premium Visual Design Presets</h4>
                <p className="text-[11px] text-neutral-400 mt-1">Select a custom hand-crafted design template. Choosing a style instantly adapts colors, core accents, button outlines, and visual density across all views.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PREMIUM_THEMES.map((t) => {
                  const active = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`theme-card-${t.id}`}
                      type="button"
                      onClick={() => setTheme(t.id as any)}
                      className={`flex items-start text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${
                        active 
                          ? 'bg-neutral-900 border-indigo-500 ring-2 ring-indigo-600/20 shadow-md shadow-indigo-600/5' 
                          : 'bg-neutral-950/60 hover:bg-neutral-900/40 border-neutral-850 hover:border-neutral-800'
                      }`}
                    >
                      {/* Theme preview swatch */}
                      <div className="mr-3 mt-0.5 flex flex-col gap-1 shrink-0">
                        <span className={`w-5 h-5 rounded-lg ${t.primaryColor} border border-white/10 flex items-center justify-center`}>
                          {active && <Check className="w-3 h-3 text-current stroke-[3]" style={{ color: t.id === 'carbon' ? '#000' : '#fff' }} />}
                        </span>
                        <span className={`w-5 h-3.5 rounded ${t.previewBg} border border-neutral-800`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-neutral-200 text-xs group-hover:text-white transition-colors">{t.name}</span>
                          <span className={`text-[8px] font-extrabold px-1 py-0.25 rounded-md ${t.isDark ? 'bg-neutral-900 text-neutral-500' : 'bg-neutral-800 text-neutral-300'}`}>
                            {t.isDark ? 'DARK' : 'LIGHT'}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-900 flex justify-end">
              <button 
                id="btn-save-prefs"
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition shadow-lg shadow-indigo-600/15"
              >
                Save Preferences & Deploy Design
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Main Admin control tower */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Active Feature Flags & Error auditing logs */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Feature Flags */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-4">
              <h4 className="font-bold text-xs text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Feature Flags & Deployments
              </h4>

              <div className="space-y-3">
                {Object.entries(flags).map(([flag, value]) => (
                  <div key={flag} className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-mono text-[10px]">{flag}</span>
                    <button 
                      id={`btn-flag-${flag}`}
                      onClick={() => setFlags(prev => ({ ...prev, [flag]: !value }))}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${value ? 'bg-indigo-600' : 'bg-neutral-850'}`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute ${value ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Security Logs */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-4">
              <h4 className="font-bold text-xs text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Platform Audit logs
              </h4>

              <div className="space-y-3">
                {SECURITY_LOGS.map((log) => (
                  <div key={log.id} className="p-2.5 rounded bg-neutral-950 border border-neutral-900 text-[10px] text-neutral-400">
                    <div className="font-bold text-neutral-300">{log.event}</div>
                    <div className="flex justify-between text-[8px] text-neutral-500 mt-1 font-semibold">
                      <span>{log.location}</span>
                      <span>{new Date(log.time).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Customer Support Ticketing Desk */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 space-y-6">
            <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
              Customer Service Ticketing Desk
            </h3>

            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-400 font-mono">TICKET: {t.id}</span>
                      <h4 className="text-xs font-bold text-neutral-200 mt-0.5">{t.subject}</h4>
                    </div>
                    
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${t.status === 'open' ? 'text-amber-400 bg-amber-500/10 animate-pulse' : 'text-emerald-400 bg-emerald-500/10'}`}>
                      {t.status}
                    </span>
                  </div>

                  {/* Thread messages */}
                  <div className="space-y-2">
                    {t.messages.map((m, idx) => (
                      <div key={idx} className={`p-2 rounded text-[11px] leading-relaxed max-w-sm ${m.sender === 'user' ? 'bg-neutral-900 text-neutral-300 mr-auto' : 'bg-indigo-600/15 border border-indigo-500/20 text-indigo-300 ml-auto'}`}>
                        <div className="font-bold text-[9px] text-neutral-500">{m.sender === 'user' ? 'Customer Alex' : 'Agent Support'}</div>
                        <p className="mt-0.5">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Interactive response field */}
                  {t.status === 'open' && (
                    <form 
                      id={`ticket-reply-form-${t.id}`}
                      onSubmit={handleTicketReplySubmit}
                      onClick={() => setSelectedTicketId(t.id)}
                      className="flex gap-2.5 pt-2"
                    >
                      <input 
                        id={`input-ticket-reply-${t.id}`}
                        type="text"
                        required
                        value={selectedTicketId === t.id ? ticketReply : ''}
                        onChange={(e) => { setSelectedTicketId(t.id); setTicketReply(e.target.value); }}
                        placeholder="Type reply and resolve ticket..."
                        className="flex-1 text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg p-2 focus:outline-none"
                      />
                      <button 
                        id={`btn-ticket-submit-${t.id}`}
                        type="submit"
                        className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase"
                      >
                        Send Reply
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
