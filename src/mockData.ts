/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Account, 
  Transaction, 
  Category, 
  Budget, 
  Goal, 
  Bill, 
  Subscription, 
  AIInsight, 
  InvestmentItem, 
  DebtItem, 
  Achievement, 
  Challenge, 
  SupportTicket, 
  UserProfile 
} from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@fintech.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  xp: 1420,
  level: 4,
  savingStreak: 12,
  budgetStreak: 8,
  preferences: {
    currency: 'GBP',
    timezone: 'UTC+1',
    theme: 'dark',
    language: 'English (UK)',
    connectedBanks: ['Monzo', 'HSBC', 'Amex']
  }
};

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc_1', name: 'HSBC Advance Checking', type: 'checking', balance: 5420.50, currency: 'GBP', institution: 'HSBC', lastSynced: '2026-08-03T05:10:00Z' },
  { id: 'acc_2', name: 'Monzo Smart Saver', type: 'savings', balance: 18250.00, currency: 'GBP', institution: 'Monzo', lastSynced: '2026-08-03T05:15:00Z' },
  { id: 'acc_3', name: 'Amex Gold Credit Card', type: 'credit', balance: -850.40, currency: 'GBP', institution: 'American Express', lastSynced: '2026-08-03T05:08:00Z' },
  { id: 'acc_4', name: 'Vanguard S&P 500 ISA', type: 'investment', balance: 12450.00, currency: 'GBP', institution: 'Vanguard', lastSynced: '2026-08-02T22:00:00Z' },
  { id: 'acc_5', name: 'Barclays Residential Mortgage', type: 'mortgage', balance: -195000.00, currency: 'GBP', institution: 'Barclays', lastSynced: '2026-08-01T00:00:00Z' },
  { id: 'acc_6', name: 'Coinbase DeFi Wallet', type: 'crypto', balance: 3450.75, currency: 'GBP', institution: 'Coinbase', lastSynced: '2026-08-03T05:12:00Z' },
  { id: 'acc_7', name: 'Cash Wallet', type: 'cash', balance: 120.00, currency: 'GBP', institution: 'Manual', lastSynced: '2026-08-03T00:00:00Z' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Dining', color: '#EF4444', icon: 'Utensils', limit: 400 },
  { id: 'cat_rent', name: 'Rent & Mortgage', color: '#3B82F6', icon: 'Home', limit: 1200 },
  { id: 'cat_shopping', name: 'Shopping & Style', color: '#EC4899', icon: 'ShoppingBag', limit: 300 },
  { id: 'cat_utilities', name: 'Utilities & Bills', color: '#F59E0B', icon: 'Zap', limit: 250 },
  { id: 'cat_travel', name: 'Travel & Transport', color: '#10B981', icon: 'Plane', limit: 200 },
  { id: 'cat_entertainment', name: 'Entertainment & Fun', color: '#8B5CF6', icon: 'Tv', limit: 150 },
  { id: 'cat_health', name: 'Health & Wellness', color: '#14B8A6', icon: 'HeartPulse', limit: 100 },
  { id: 'cat_salary', name: 'Salary & Income', color: '#22C55E', icon: 'Briefcase' },
  { id: 'cat_savings', name: 'Savings & Investments', color: '#06B6D4', icon: 'TrendingUp' },
  { id: 'cat_other', name: 'Others & Misc', color: '#6B7280', icon: 'CircleEllipsis' }
];

export const INITIAL_BUDGETS: Budget[] = [
  { id: 'bud_1', categoryId: 'cat_food', categoryName: 'Food & Dining', amount: 400, period: 'monthly', rolloverEnabled: true, alertsEnabled: true },
  { id: 'bud_2', categoryId: 'cat_shopping', categoryName: 'Shopping & Style', amount: 300, period: 'monthly', rolloverEnabled: false, alertsEnabled: true },
  { id: 'bud_3', categoryId: 'cat_travel', categoryName: 'Travel & Transport', amount: 200, period: 'monthly', rolloverEnabled: true, alertsEnabled: true },
  { id: 'bud_4', categoryId: 'cat_entertainment', categoryName: 'Entertainment & Fun', amount: 150, period: 'monthly', rolloverEnabled: false, alertsEnabled: true },
  { id: 'bud_5', categoryId: 'cat_utilities', categoryName: 'Utilities & Bills', amount: 250, period: 'monthly', rolloverEnabled: true, alertsEnabled: true }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx_1', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'TechCorp Salary', logo: 'Briefcase', category: 'Salary & Income', date: '2026-08-01T09:00:00Z', amount: 3850.00, type: 'income', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_2', accountId: 'acc_5', accountName: 'Barclays Residential Mortgage', merchant: 'Barclays Mortgage Payment', logo: 'Home', category: 'Rent & Mortgage', date: '2026-08-01T00:05:00Z', amount: -950.00, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_3', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'Sainsbury\'s Groceries', logo: 'ShoppingCart', category: 'Food & Dining', date: '2026-08-02T14:30:00Z', amount: -68.40, type: 'expense', status: 'completed', isRecurring: false },
  { id: 'tx_4', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Amazon Prime Sub', logo: 'Play', category: 'Entertainment & Fun', date: '2026-08-02T08:15:00Z', amount: -8.99, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_5', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Uber Eats Restaurant', logo: 'Utensils', category: 'Food & Dining', date: '2026-08-02T19:45:00Z', amount: -34.50, type: 'expense', status: 'completed', isRecurring: false, notes: 'Sushi night with friends' },
  { id: 'tx_6', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'British Gas Utility', logo: 'Zap', category: 'Utilities & Bills', date: '2026-08-02T11:00:00Z', amount: -112.50, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_7', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Apple One Premium', logo: 'Apple', category: 'Utilities & Bills', date: '2026-08-03T01:00:00Z', amount: -32.95, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_8', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'Gym Membership', logo: 'Dumbbell', category: 'Health & Wellness', date: '2026-07-31T06:30:00Z', amount: -45.00, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' },
  { id: 'tx_9', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Zara Shopping', logo: 'ShoppingBag', category: 'Shopping & Style', date: '2026-07-30T16:20:00Z', amount: -124.00, type: 'expense', status: 'completed', isRecurring: false },
  { id: 'tx_10', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'LNER Train Ticket', logo: 'Train', category: 'Travel & Transport', date: '2026-07-29T10:15:00Z', amount: -48.20, type: 'expense', status: 'completed', isRecurring: false },
  { id: 'tx_11', accountId: 'acc_6', accountName: 'Coinbase DeFi Wallet', merchant: 'Ethereum Staking', logo: 'Coins', category: 'Salary & Income', date: '2026-07-28T12:00:00Z', amount: 85.30, type: 'income', status: 'completed', isRecurring: false },
  { id: 'tx_12', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Starbucks Coffee', logo: 'Coffee', category: 'Food & Dining', date: '2026-08-03T08:05:00Z', amount: -4.85, type: 'expense', status: 'pending', isRecurring: false },
  { id: 'tx_13', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'Shell Fuel Station', logo: 'Car', category: 'Travel & Transport', date: '2026-07-27T18:40:00Z', amount: -65.00, type: 'expense', status: 'completed', isRecurring: false },
  { id: 'tx_14', accountId: 'acc_1', accountName: 'HSBC Advance Checking', merchant: 'Upwork Freelance', logo: 'Briefcase', category: 'Salary & Income', date: '2026-07-25T15:00:00Z', amount: 1200.00, type: 'income', status: 'completed', isRecurring: false },
  { id: 'tx_15', accountId: 'acc_3', accountName: 'Amex Gold Credit Card', merchant: 'Netflix Subscription', logo: 'Tv', category: 'Entertainment & Fun', date: '2026-08-01T02:00:00Z', amount: -17.99, type: 'expense', status: 'completed', isRecurring: true, recurringInterval: 'monthly' }
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'goal_1', name: '6-Month Emergency Fund', targetAmount: 15000, currentAmount: 12000, deadline: '2026-12-31', monthlyContribution: 500, category: 'Emergency' },
  { id: 'goal_2', name: 'Japan Tokyo Trip 2027', targetAmount: 4000, currentAmount: 1800, deadline: '2027-04-15', monthlyContribution: 250, category: 'Holiday' },
  { id: 'goal_3', name: 'First Home Deposit', targetAmount: 40000, currentAmount: 14500, deadline: '2028-06-30', monthlyContribution: 800, category: 'House Deposit' },
  { id: 'goal_4', name: 'Custom Liquid Cooling PC', targetAmount: 2500, currentAmount: 2500, deadline: '2026-07-20', monthlyContribution: 200, category: 'Laptop & Tech' }
];

export const INITIAL_BILLS: Bill[] = [
  { id: 'bill_1', name: 'Barclays Mortgage', amount: 950.00, dueDate: '2026-09-01', status: 'paid', isRecurring: true, frequency: 'monthly', category: 'Rent & Mortgage' },
  { id: 'bill_2', name: 'British Gas Gas/Electricity', amount: 112.50, dueDate: '2026-09-02', status: 'paid', isRecurring: true, frequency: 'monthly', category: 'Utilities & Bills' },
  { id: 'bill_3', name: 'Hyperoptic Gigabit Fiber', amount: 45.00, dueDate: '2026-08-15', status: 'unpaid', isRecurring: true, frequency: 'monthly', category: 'Utilities & Bills' },
  { id: 'bill_4', name: 'EE Mobile SIM Only', amount: 25.00, dueDate: '2026-08-18', status: 'unpaid', isRecurring: true, frequency: 'monthly', category: 'Utilities & Bills' },
  { id: 'bill_5', name: 'HMRC Quarterly Self Assessment', amount: 1850.00, dueDate: '2026-10-31', status: 'unpaid', isRecurring: false, frequency: 'yearly', category: 'Others & Misc' }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub_1', name: 'Netflix Premium', amount: 17.99, frequency: 'monthly', logo: 'Tv', nextBillingDate: '2026-09-01', trend: 'stable' },
  { id: 'sub_2', name: 'Spotify Family Plan', amount: 19.99, frequency: 'monthly', logo: 'Music', nextBillingDate: '2026-08-22', trend: 'increased', lastPriceIncrease: 3.00 },
  { id: 'sub_3', name: 'Amazon Prime UK', amount: 8.99, frequency: 'monthly', logo: 'Play', nextBillingDate: '2026-09-02', trend: 'stable' },
  { id: 'sub_4', name: 'Apple One Premier Bundle', amount: 32.95, frequency: 'monthly', logo: 'Apple', nextBillingDate: '2026-09-03', trend: 'stable' },
  { id: 'sub_5', name: 'Midjourney Pro Account', amount: 24.00, frequency: 'monthly', logo: 'Image', nextBillingDate: '2026-08-14', trend: 'decreased' }
];

export const INITIAL_INSIGHTS: AIInsight[] = [
  { id: 'ins_1', text: 'You spent 42% more on restaurants and Uber Eats this week compared to your 4-week average.', type: 'warning', timestamp: '2026-08-03T04:30:00Z' },
  { id: 'ins_2', text: 'You successfully saved £312 this month by cancelling your duplicate cloud backup subscription.', type: 'success', timestamp: '2026-08-02T10:00:00Z' },
  { id: 'ins_3', text: 'Electricity spending increased by 18% over the last month. We recommend reviewing energy saver tips.', type: 'info', timestamp: '2026-08-01T15:20:00Z' },
  { id: 'ins_4', text: 'Predictive alert: Your upcoming Hyperoptic bill (£45.00) on Aug 15th might trigger a low balance alert on HSBC checking.', type: 'warning', timestamp: '2026-08-03T01:10:00Z' },
  { id: 'ins_5', text: 'Smart tip: You usually overspend on Shopping every Friday afternoon. Consider a lock budget rule.', type: 'tip', timestamp: '2026-07-31T09:00:00Z' }
];

export const INITIAL_INVESTMENTS: InvestmentItem[] = [
  { id: 'inv_1', symbol: 'VUSA', name: 'Vanguard S&P 500 ETF', shares: 155, avgPrice: 65.40, currentPrice: 80.32, value: 12450.00, change: 2312.60, changePercent: 22.8, assetClass: 'etfs' },
  { id: 'inv_2', symbol: 'BTC', name: 'Bitcoin (Coinbase Wallet)', shares: 0.082, avgPrice: 42000.00, currentPrice: 51200.00, value: 4198.40, change: 754.40, changePercent: 21.9, assetClass: 'crypto' },
  { id: 'inv_3', symbol: 'ETH', name: 'Ethereum Staking', shares: 1.5, avgPrice: 1850.00, currentPrice: 2300.50, value: 3450.75, change: 675.75, changePercent: 24.3, assetClass: 'crypto' }
];

export const INITIAL_DEBTS: DebtItem[] = [
  { id: 'debt_1', name: 'Barclays Residential Mortgage', balance: 195000.00, interestRate: 3.45, minPayment: 950.00, termMonths: 240 },
  { id: 'debt_2', name: 'Amex Gold Outstanding', balance: 850.40, interestRate: 22.9, minPayment: 35.00, termMonths: 12 }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_1', title: 'Savvy Saver', description: 'Maintain an active saving streak of 10+ days.', xpReward: 150, unlocked: true, unlockedAt: '2026-07-28T14:00:00Z', badge: 'PiggyBank' },
  { id: 'ach_2', title: 'Budget Master', description: 'Keep all active budgets below limit for an entire month.', xpReward: 300, unlocked: true, unlockedAt: '2026-07-31T23:59:59Z', badge: 'ShieldCheck' },
  { id: 'ach_3', title: 'Debt Slayer', description: 'Pay off at least £1,000 extra on high-interest debt.', xpReward: 250, unlocked: false, badge: 'Sword' },
  { id: 'ach_4', title: 'Financial Nirvana', description: 'Reach a comprehensive Financial Health Score of 90+.', xpReward: 500, unlocked: false, badge: 'Crown' }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'cha_1', title: 'No-Spend Weekend Challenge', description: 'Avoid discretionary spendings (Shopping & Entertainment) for 48 hours.', xpReward: 100, progress: 50, target: '2 Days', completed: false },
  { id: 'cha_2', title: 'The £500 Vault Challenge', description: 'Deposit at least £500 into your Monzo Smart Saver this month.', xpReward: 150, progress: 100, target: '£500 deposited', completed: true },
  { id: 'cha_3', title: 'Category Cap', description: 'Keep Food & Dining spending under £100 for this week.', xpReward: 80, progress: 72, target: 'Under £100', completed: false }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  { 
    id: 'tkt_1', 
    subject: 'Amex auto-sync error 104', 
    status: 'resolved', 
    category: 'Bank Connections', 
    createdAt: '2026-07-28T11:20:00Z',
    messages: [
      { sender: 'user', text: 'My Amex Gold sync fails with error 104 today. Can you check?', time: '2026-07-28T11:20:00Z' },
      { sender: 'agent', text: 'Hi Alex, Amex experienced a brief API change which has been resolved in our platform. Please try re-authenticating now.', time: '2026-07-28T14:30:00Z' },
      { sender: 'user', text: 'Perfect, it is synced and updating now. Thank you!', time: '2026-07-28T15:10:00Z' }
    ]
  },
  { 
    id: 'tkt_2', 
    subject: 'Custom transaction receipt OCR request', 
    status: 'open', 
    category: 'Billing & Subscriptions', 
    createdAt: '2026-08-02T16:00:00Z',
    messages: [
      { sender: 'user', text: 'I tried uploading a Sainsbury checkout receipt, and the OCR scanned the total as £68.40 correctly but categorised it as Travel instead of Food.', time: '2026-08-02T16:00:00Z' }
    ]
  }
];

export const SECURITY_LOGS = [
  { id: 'log_1', event: 'Authorized bank session synced successfully', location: 'London, UK (Safari/macOS)', time: '2026-08-03T05:15:00Z', status: 'secure' },
  { id: 'log_2', event: 'Google Auth OAuth login successful', location: 'London, UK (Safari/macOS)', time: '2026-08-03T04:20:00Z', status: 'secure' },
  { id: 'log_3', event: 'Export database dump (CSV/Excel) requested', location: 'London, UK (Safari/macOS)', time: '2026-08-02T15:45:00Z', status: 'audit' },
  { id: 'log_4', event: 'Device registered (iPhone 15 Pro Max)', location: 'Paris, France (App/iOS)', time: '2026-07-25T08:12:00Z', status: 'secure' }
];
