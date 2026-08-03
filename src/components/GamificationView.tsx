/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  Sword, 
  PiggyBank, 
  Target, 
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';
import { Achievement, Challenge, UserProfile } from '../types';

interface GamificationViewProps {
  user: UserProfile;
  achievements: Achievement[];
  challenges: Challenge[];
  onClaimXPReward: (challengeId: string, xp: number) => void;
}

export default function GamificationView({
  user,
  achievements,
  challenges,
  onClaimXPReward
}: GamificationViewProps) {
  
  // XP level threshold
  const nextLevelXp = 2000;
  const xpPercentage = Math.min(100, Math.round((user.xp / nextLevelXp) * 100));

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'PiggyBank': return <PiggyBank className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'Sword': return <Sword className="w-5 h-5 text-rose-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      default: return <Trophy className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div id="gamification-view" className="space-y-8 max-w-5xl mx-auto px-1">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Financial Mastery Hub</h1>
          <p className="text-sm text-neutral-400">Unlock Achievements, earn Experience Points (XP), and climb financial safety tiers.</p>
        </div>
      </div>

      {/* Level Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-neutral-900/80 to-neutral-950 border border-neutral-900 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-indigo-600/30">
            {user.level}
          </div>
          <div>
            <h3 className="font-bold text-neutral-200 text-lg">Fintech Wizard</h3>
            <p className="text-xs text-neutral-500 font-semibold uppercase">{user.xp} XP • Next level in {nextLevelXp - user.xp} XP</p>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="w-full md:w-96 space-y-2">
          <div className="flex justify-between text-xs text-neutral-400 font-mono">
            <span>Progress to Level {user.level + 1}</span>
            <span>{xpPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-850">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-750" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid containing Quests and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Active Challenges / Quest Quests */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4.5 h-4.5 text-amber-400 fill-current" />
            Active Quests & Challenges
          </h3>

          <div className="space-y-4">
            {challenges.map((cha) => (
              <div key={cha.id} className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl space-y-3 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">{cha.title}</h4>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mt-0.5">{cha.description}</p>
                  </div>
                  
                  {cha.completed ? (
                    <button 
                      id={`btn-claim-xp-${cha.id}`}
                      onClick={() => onClaimXPReward(cha.id, cha.xpReward)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition rounded"
                    >
                      Claim +{cha.xpReward} XP
                    </button>
                  ) : (
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">+{cha.xpReward} XP</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[9px] text-neutral-500 font-semibold font-mono">
                    <span>Target: {cha.target}</span>
                    <span>{cha.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cha.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${cha.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Achievements list */}
        <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4.5 h-4.5 text-indigo-400" />
            Unlocked Achievements
          </h3>

          <div className="space-y-4">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`p-4 rounded-xl flex items-center justify-between border ${ach.unlocked ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-950/20 border-neutral-900 opacity-60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center">
                    {getBadgeIcon(ach.badge)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200">{ach.title}</h4>
                    <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">{ach.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  {ach.unlocked ? (
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[9px] text-neutral-500 font-bold uppercase">LOCKED</span>
                  )}
                  <span className="text-[9px] text-neutral-500 font-mono block mt-0.5">Reward: +{ach.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
