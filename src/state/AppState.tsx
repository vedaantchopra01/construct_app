import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { confettiBurst } from '../utils/celebrations'

export type Persona = 'College' | 'School' | 'Working'
export type Goal = 'Save' | 'Track' | 'Learn' | 'Invest' | 'Rewards'
export type Theme = 'FoodLover' | 'SelfCare' | 'Fitness' | 'Dark' | 'Neon' | 'Light'

export interface Profile {
  name?: string
  income: number
  rent: number
  food: number
  transport: number
  other: number
  persona: Persona
  goal: Goal
  preferredSavings?: number
  monthlyGoal?: number
  goalProgress?: number
}

export interface BankAccount { id: string; name: string; balance: number }
export interface Transaction { id: string; type: 'debit' | 'credit'; amount: number; description: string; category: string; date: string }
export interface VideoItem { id: string; title: string; url: string; topic: string }
export interface Challenge { id: string; title: string; target: number; progress: number; week: number }
export interface Notification { id: string; message: string; createdAt: string }
export interface SIPPlan { id: string; amount: number; day: number; asset: string; accountId?: string; active: boolean; createdAt: string }

export interface BudgetPlan { essentials: number; wants: number; savings: number; investments: number; overspendAlert?: boolean }

interface AppStateType {
  profile: Profile | null
  setProfile: (p: Profile) => void
  budgetPlan: BudgetPlan | null
  setBudgetPlan: (bp: BudgetPlan) => void
  theme: Theme
  setTheme: (t: Theme) => void

  bankAccounts: BankAccount[]
  linkBank: (name: string, initialBalance: number) => void
  updateBalance: (id: string, delta: number) => void

  transactions: Transaction[]
  addTransaction: (t: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void

  videos: VideoItem[]
  addVideo: (v: Omit<VideoItem, 'id'>) => void
  watched: Record<string, boolean>
  markWatched: (id: string) => void

  rewards: number
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  addRewards: (points: number) => void

  challenges: Challenge[]
  joinChallenge: (c: Omit<Challenge, 'id' | 'progress'>) => void
  updateChallenge: (id: string, progress: number) => void

  notifications: Notification[]
  notify: (message: string) => void

  privacyMode: boolean
  togglePrivacy: () => void

  streakDays: number
  incrementStreak: () => void
  resetStreak: () => void

  
  sipPlans: SIPPlan[]
  addSIPPlan: (p: Omit<SIPPlan, 'id' | 'createdAt'>) => void
  toggleSIPPlan: (id: string, active: boolean) => void
  runSIPNow: (id: string) => void

  
  totalBalance: number
  trustScore: number
  logout: () => void
}

const AppStateContext = createContext<AppStateType | undefined>(undefined)

const storageKey = 'fingen_state_v1'

function categorize(desc: string): string {
  const d = desc.toLowerCase()
  if (d.includes('rent')) return 'Rent'
  if (d.includes('swiggy') || d.includes('zomato') || d.includes('food')) return 'Food'
  if (d.includes('metro') || d.includes('uber') || d.includes('bus') || d.includes('transport')) return 'Transport'
  if (d.includes('upi')) return 'UPI'
  if (d.includes('gym')) return 'Gym'
  return 'Other'
}

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [watched, setWatched] = useState<Record<string, boolean>>({})
  const [rewards, setRewards] = useState<number>(0)
  const [level, setLevel] = useState<AppStateType['level']>('Bronze')
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [privacyMode, setPrivacyMode] = useState<boolean>(false)
  const [streakDays, setStreakDays] = useState<number>(0)
  const [budgetPlan, setBudgetPlanState] = useState<BudgetPlan | null>(null)
  const [theme, setThemeState] = useState<Theme>('SelfCare')
  const [sipPlans, setSipPlans] = useState<SIPPlan[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        setProfileState(parsed.profile || null)
        setBudgetPlanState(parsed.budgetPlan || null)
        setThemeState(parsed.theme || 'SelfCare')
        setBankAccounts(parsed.bankAccounts || [])
        setTransactions(parsed.transactions || [])
        setVideos(parsed.videos || [])
        setWatched(parsed.watched || {})
        setRewards(parsed.rewards || 0)
        setLevel(parsed.level || 'Bronze')
        setChallenges(parsed.challenges || [])
        setNotifications(parsed.notifications || [])
        setPrivacyMode(!!parsed.privacyMode)
        setStreakDays(parsed.streakDays || 0)
        setSipPlans(parsed.sipPlans || [])
      }
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    const dump = {
      profile,
      bankAccounts,
      budgetPlan,
      theme,
      transactions,
      videos,
      watched,
      rewards,
      level,
      challenges,
      notifications,
      privacyMode,
      streakDays
      , sipPlans
    }
    localStorage.setItem(storageKey, JSON.stringify(dump))
  }, [profile, budgetPlan, bankAccounts, transactions, videos, watched, rewards, level, challenges, notifications, privacyMode, streakDays, sipPlans])

  const setProfile = (p: Profile) => {
    setProfileState(p)
    
    addRewards(50)
    notify('Welcome to FinGen! 🎉 You earned 50 coins for onboarding.')
  }

  const setBudgetPlan: AppStateType['setBudgetPlan'] = (bp) => {
    setBudgetPlanState(bp)
    notify('Budget plan saved. Keep an eye on overspending alerts.')
  }

  const setTheme: AppStateType['setTheme'] = (t) => {
    setThemeState(t)
    notify(`Theme updated to ${t}`)
  }

  const linkBank = (name: string, initialBalance: number) => {
    const acct: BankAccount = { id: Date.now().toString(), name, balance: Math.max(0, initialBalance) }
    setBankAccounts(prev => [...prev, acct])
    notify(`Bank linked: ${name}`)
  }

  const updateBalance = (id: string, delta: number) => {
    setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, balance: a.balance + delta } : a))
  }

  const addTransaction: AppStateType['addTransaction'] = (t) => {
    const tx: Transaction = {
      id: Date.now().toString(),
      type: t.type,
      amount: t.amount,
      description: t.description,
      category: t.category || categorize(t.description),
      date: t.date || new Date().toISOString()
    }
    setTransactions(prev => [tx, ...prev])
    
    if (tx.type === 'debit' && tx.category === 'Food' && tx.amount < 200) addRewards(2)
  }

  const addVideo: AppStateType['addVideo'] = (v) => {
    const item: VideoItem = { id: Date.now().toString(), ...v }
    setVideos(prev => [...prev, item])
    notify(`Video uploaded: ${v.title}`)
  }

  const markWatched = (id: string) => {
    setWatched(prev => ({ ...prev, [id]: true }))
    
    const watchedCount = Object.values({ ...watched, [id]: true }).filter(Boolean).length
    if (watchedCount % 5 === 0) {
      addRewards(25)
      notify('Badge earned! 🎓 You watched 5 videos and earned 25 coins.')
    }
  }

  const addRewards = (points: number) => {
    setRewards(prev => {
      const next = prev + points
      
      const lvlOrder = ['Bronze','Silver','Gold','Platinum','Diamond'] as const
      const lvl = next > 2000 ? 'Diamond' : next > 1200 ? 'Platinum' : next > 700 ? 'Gold' : next > 300 ? 'Silver' : 'Bronze'
      const prevIdx = lvlOrder.indexOf(level)
      const nextIdx = lvlOrder.indexOf(lvl)
      setLevel(lvl)
      if (nextIdx > prevIdx) {
        
        confettiBurst()
        notify(`Level up! You reached ${lvl} 🎉`)
      }
      return next
    })
  }

  const joinChallenge: AppStateType['joinChallenge'] = (c) => {
    const item: Challenge = { id: Date.now().toString(), progress: 0, ...c }
    setChallenges(prev => [...prev, item])
    notify(`Joined challenge: ${c.title}`)
  }

  const updateChallenge = (id: string, progress: number) => {
    setChallenges(prev => prev.map(ch => ch.id === id ? { ...ch, progress } : ch))
    if (progress >= 100) {
      addRewards(40)
      notify('Challenge completed! 🏆 +40 coins')
    }
  }

  const notify = (message: string) => {
    const n: Notification = { id: Date.now().toString(), message, createdAt: new Date().toISOString() }
    setNotifications(prev => [n, ...prev])
  }

  const togglePrivacy = () => setPrivacyMode(p => !p)
  const incrementStreak = () => setStreakDays(d => {
    const next = d + 1
    if (next % 7 === 0) {
      confettiBurst()
      notify(`7-day streak! 🔥 Keep it going!`)
      addRewards(20)
    }
    return next
  })
  const resetStreak = () => setStreakDays(0)

  
  const addSIPPlan: AppStateType['addSIPPlan'] = (p) => {
    const plan: SIPPlan = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...p }
    setSipPlans(prev => [plan, ...prev])
    notify(`SIP enabled: ₹${p.amount}/mo in ${p.asset}`)
  }

  const toggleSIPPlan: AppStateType['toggleSIPPlan'] = (id, active) => {
    setSipPlans(prev => prev.map(pl => pl.id === id ? { ...pl, active } : pl))
    notify(active ? 'SIP activated' : 'SIP paused')
  }

  const runSIPNow: AppStateType['runSIPNow'] = (id) => {
    const pl = sipPlans.find(s => s.id === id)
    if (!pl) return
    const acctId = pl.accountId || bankAccounts[0]?.id
    if (!acctId) return notify('Link a bank to run SIP')
    updateBalance(acctId, -Math.max(0, pl.amount))
    addTransaction({ type: 'debit', amount: pl.amount, description: `SIP: ${pl.asset}`, category: 'Investments' })
    addRewards(5)
    notify(`SIP executed: ₹${pl.amount} → ${pl.asset}`)
  }

  const value: AppStateType = useMemo(() => ({
    profile,
    setProfile,
    budgetPlan,
    setBudgetPlan,
    theme,
    setTheme,
    bankAccounts,
    linkBank,
    updateBalance,
    transactions,
    addTransaction,
    videos,
    addVideo,
    watched,
    markWatched,
    rewards,
    level,
    addRewards,
    challenges,
    joinChallenge,
    updateChallenge,
    notifications,
    notify,
    privacyMode,
    togglePrivacy,
    streakDays,
    incrementStreak,
    resetStreak,
    sipPlans,
    addSIPPlan,
    toggleSIPPlan,
    runSIPNow,
    totalBalance: bankAccounts.reduce((sum, a) => sum + (a.balance || 0), 0),
    trustScore: (() => {
      
      const base = 50
      const streakBonus = Math.min(20, streakDays)
      const levelBonus = level === 'Diamond' ? 25 : level === 'Platinum' ? 18 : level === 'Gold' ? 12 : level === 'Silver' ? 6 : 0
      const overspendPenalty = budgetPlan?.overspendAlert ? 15 : 0
      return Math.max(0, Math.min(100, base + streakBonus + levelBonus - overspendPenalty))
    })(),
    logout: () => {
      setProfileState(null)
      setBudgetPlanState(null)
      setChallenges([])
      setNotifications(prev => [{ id: Date.now().toString(), message: 'Logged out successfully.', createdAt: new Date().toISOString() }, ...prev])
    }
  }), [profile, budgetPlan, theme, bankAccounts, transactions, videos, watched, rewards, level, challenges, notifications, privacyMode, streakDays])

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}