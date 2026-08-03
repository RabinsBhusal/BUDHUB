/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AccountType = 
  | 'checking' 
  | 'savings' 
  | 'credit' 
  | 'loan' 
  | 'mortgage' 
  | 'crypto' 
  | 'investment' 
  | 'cash';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string;
  lastSynced: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  merchant: string;
  logo: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
  notes?: string;
  attachment?: string;
  location?: string;
  isRecurring: boolean;
  recurringInterval?: 'monthly' | 'weekly' | 'yearly';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  rules?: string[];
  limit?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  rolloverEnabled: boolean;
  alertsEnabled: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  category: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  isRecurring: boolean;
  frequency: 'monthly' | 'yearly';
  category: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  logo: string;
  nextBillingDate: string;
  trend: 'stable' | 'increased' | 'decreased';
  lastPriceIncrease?: number;
}

export interface AIInsight {
  id: string;
  text: string;
  type: 'warning' | 'tip' | 'info' | 'success';
  timestamp: string;
}

export interface InvestmentItem {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change: number;
  changePercent: number;
  assetClass: 'stocks' | 'etfs' | 'crypto' | 'cash' | 'property';
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
  termMonths: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  badge: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number; // percentage
  target: string;
  completed: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'resolved';
  category: string;
  createdAt: string;
  messages: { sender: 'user' | 'agent'; text: string; time: string }[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  savingStreak: number;
  budgetStreak: number;
  preferences: {
    currency: string;
    timezone: string;
    theme: 'dark' | 'light' | 'system' | 'gold' | 'cyber' | 'carbon' | 'emerald' | 'frost' | 'sunset';
    language: string;
    connectedBanks: string[];
  };
}
