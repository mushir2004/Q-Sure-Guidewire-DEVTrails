import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Confetti from 'react-confetti';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Shield, Wallet, Settings, User, Zap, ShieldCheck,
    CloudSun, AlertTriangle, CheckCircle, ArrowRight, Activity,
    Building, ChevronRight, Clock, AlertOctagon, ArrowDownToLine,
    Banknote, HelpCircle, Moon, Sun, Smartphone, Download, BarChart3, Loader2, Share,
    LogOut
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// CHANGE THIS:
const ZoneMap = dynamic(() => import('../components/ZoneMap'), {
    ssr: false,
    loading: () => <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
});

const DISRUPTION_SCENARIOS = [
    { type: 'Local Strike (Verified)', alert: 'A Localized Bandh/Strike is reported. Q-Sure AI is verifying local data.', mapText: 'Gridlock Confirmed', duration: '2 Hours (4:00 PM - 6:00 PM)', amount: 200 },
    { type: 'Flash Flood (Verified)', alert: 'Heavy rain and waterlogging confirmed. Traffic speed below 8km/h.', mapText: 'Zone Flooded', duration: '1 Hour (6:00 PM - 7:00 PM)', amount: 100 },
    { type: 'Extreme Heat (Verified)', alert: 'Temperature exceeds 42°C. Safety payout initiated for prime hours.', mapText: 'Heatwave Active', duration: '3 Hours (1:00 PM - 4:00 PM)', amount: 300 }
];

export default function App() {
    const router = useRouter();
    const [platform, setPlatform] = useState('Swiggy Instamart');
    useEffect(() => {
        const hasOnboarded = localStorage.getItem('qsure-onboarded');
        if (!hasOnboarded) {
            router.push('/onboarding');
        } else {
            // ADD THIS: Read the saved platform
            const savedPlatform = localStorage.getItem('qsure-platform');
            if (savedPlatform) setPlatform(savedPlatform);
        }
    }, [router]);
    const { installPrompt, isIOS, isStandalone, triggerInstall } = usePWAInstall();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [step, setStep] = useState(1);
    const [activeTab, setActiveTab] = useState('policy');
    const [isSimulating, setIsSimulating] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const [premiumData, setPremiumData] = useState({ price: 35, insight: "Calculating..." });
    const [walletBalance, setWalletBalance] = useState(0);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [transactions, setTransactions] = useState<{ id: number, type: string, amount: number, time: string }[]>([]);

    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const currentScenario = DISRUPTION_SCENARIOS[scenarioIndex];
    const WEEKLY_CAP = 1000;

    // NEW: Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('qsure-theme') as 'light' | 'dark';
        if (savedTheme) setTheme(savedTheme);
    }, []);

    // NEW: Save theme to localStorage when toggled
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('qsure-theme', newTheme);
    };

    const handleLogout = () => {
        // 1. Remove the memory flag
        localStorage.removeItem('qsure-onboarded');
        // 2. Route them back to the start
        router.push('/onboarding');
    };

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        fetch(apiUrl + '/calculate_premium', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zone_risk_score: 8, forecasted_rainfall_mm: 25.0, forecasted_max_temp_c: 30.0, upcoming_event_flag: 0 })
        })
            .then(res => res.json())
            .then(data => { if (data) setPremiumData({ price: data.weekly_premium_inr, insight: data.ai_reasoning }); })
            .catch(err => console.error("Backend offline.", err));
    }, []);

    const triggerDisruption = async () => {
        setIsSimulating(true);
        setStep(4);
        const nextIndex = (scenarioIndex + 1) % DISRUPTION_SCENARIOS.length;
        setScenarioIndex(nextIndex);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(apiUrl + '/check_triggers/Bengaluru?use_simulator=true');
            const data = await res.json();

            if (data.disruption_active) {
                setTimeout(() => {
                    const payoutAmount = DISRUPTION_SCENARIOS[nextIndex].amount;
                    setWalletBalance(prev => prev + payoutAmount);
                    const newTx = {
                        id: Date.now(),
                        type: DISRUPTION_SCENARIOS[nextIndex].type,
                        amount: payoutAmount,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setTransactions(prev => [newTx, ...prev]);
                    setStep(5);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 8000);
                }, 2000);
            }
        } catch (err) {
            console.error("Backend fetch failed", err);
        }
    };

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3500);
    };

    const handleWithdraw = () => {
        if (walletBalance === 0) return showToast("Balance is already zero.");
        setIsWithdrawing(true);
        setTimeout(() => {
            showToast(`₹${walletBalance} successfully transferred to HDFC Bank.`);
            setWalletBalance(0);
            setIsWithdrawing(false);
        }, 1500);
    };

    const handleDownload = () => {
        showToast("Statement_Mar2026.pdf downloaded to your device.");
    };

    const pageVariants = {
        initial: { opacity: 0, x: 15 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -15 }
    };

    return (
        <div className={`flex justify-center h-[100dvh] overflow-hidden ${theme === 'dark' ? 'bg-black dark' : 'bg-gray-200'}`}>
            <div className="w-full max-w-[480px] h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative shadow-2xl flex flex-col font-sans transition-colors duration-300">

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 20 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="absolute top-0 left-4 right-4 z-[100] bg-slate-800 dark:bg-teal-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-medium text-sm"
                        >
                            <CheckCircle size={18} className="text-teal-400 dark:text-white" />
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <header className="shrink-0 p-4 flex justify-between items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-50 transition-colors">
                    <button onClick={() => { setActiveTab('home'); setStep(1); }} className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors active:scale-95">
                        RK
                    </button>
                    <h1 className="text-xl font-extrabold text-teal-900 dark:text-teal-400 flex items-center gap-1.5 tracking-tight">
                        <Zap className="text-orange-500" fill="currentColor" size={22} /> Q-Sure
                    </h1>
                    <div className="flex items-center gap-2">
                        <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors active:scale-95">
                            <LogOut size={18} />
                        </button>
                        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors active:scale-95">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button onClick={triggerDisruption} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-colors active:scale-95">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-4 relative hide-scrollbar">
                    {showConfetti && <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden"><Confetti width={480} height={800} recycle={false} numberOfPieces={150} gravity={0.1} /></div>}

                    <AnimatePresence mode="wait">
                        {/* --- TAB 1: HOME --- */}
                        {activeTab === 'home' && step < 4 && (
                            <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden transition-colors">
                                    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-teal-500 to-emerald-400 opacity-20 dark:opacity-10"></div>
                                    <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-md rounded-full flex items-center justify-center mx-auto mb-3 text-teal-600 dark:text-teal-400 relative z-10 border-2 border-white dark:border-slate-800">
                                        <User size={36} />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Ramesh K.</h2>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Q-Commerce Delivery Partner</p>

                                    <div className="mt-5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400"><Smartphone size={16} /></div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-slate-800 dark:text-white">{platform}</p>
                                                <p className="text-[10px] text-emerald-500 font-medium">Synced • Live Data</p>
                                            </div>
                                        </div>
                                        <CheckCircle size={20} className="text-emerald-500" />
                                    </div>
                                </div>

                                {!isStandalone && (installPrompt || isIOS) && (
                                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-5 rounded-3xl shadow-lg text-white flex items-center justify-between">
                                        <div className="pr-4">
                                            <h3 className="font-bold text-sm">Install Q-Sure App</h3>
                                            <p className="text-xs text-teal-50 font-medium mt-1">
                                                {isIOS ? "Tap Share below, then 'Add to Home Screen'." : "Get the native experience on your device."}
                                            </p>
                                        </div>

                                        {isIOS ? (
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                                <Share size={20} className="text-white" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={triggerInstall}
                                                className="bg-white text-teal-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 transition-colors shrink-0 shadow-sm active:scale-95"
                                            >
                                                Install
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-colors">
                                        <Activity className="text-orange-500 mb-2" size={24} />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekly Streak</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-white">5 Days</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-colors">
                                        <BarChart3 className="text-blue-500 mb-2" size={24} />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg. Shift</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">8.5 hrs/day</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 2: POLICY --- */}
                        {activeTab === 'policy' && step < 4 && (
                            <motion.div key="policy" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                                <div className="bg-gradient-to-br from-teal-800 to-emerald-900 dark:from-teal-900 dark:to-slate-900 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-sm">
                                            <ShieldCheck size={14} /> ACTIVE COVERAGE
                                        </div>
                                        <p className="text-teal-100 text-xs font-medium bg-black/20 px-2 py-1 rounded-lg">ID: QS-9928X</p>
                                    </div>

                                    <p className="text-teal-100 text-sm font-medium mb-1">Weekly Premium</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold">₹{premiumData.price}</span>
                                        <span className="text-teal-200 text-sm font-medium">/ week</span>
                                    </div>

                                    <div className="mt-6 p-4 bg-black/30 rounded-2xl backdrop-blur-md border border-teal-400/30 shadow-[0_0_15px_rgba(45,212,191,0.15)] flex gap-3 items-start">
                                        <Zap className="text-yellow-400 shrink-0 mt-0.5" size={18} fill="currentColor" />
                                        <div className="text-xs text-teal-50 font-medium leading-relaxed">
                                            <span className="font-bold text-teal-300 block mb-1">AI Underwriting Active:</span>
                                            {premiumData.insight}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                        <BarChart3 size={16} className="text-teal-500" /> Premium Breakdown
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span className="font-medium">Base Risk Rate</span><span className="font-bold text-slate-800 dark:text-white">₹20.00</span></div>
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400"><span className="font-medium">Zone 3km Weather Penalty</span><span className="font-bold text-orange-500">+₹{premiumData.price > 20 ? premiumData.price - 20 : 0}.00</span></div>
                                        <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                                        <div className="flex justify-between font-extrabold text-slate-900 dark:text-white"><span>Total Deducted</span><span>₹{premiumData.price}.00</span></div>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
                                    <div className="opacity-90 dark:opacity-75 grayscale-[0.2] dark:invert dark:hue-rotate-180 transition-all">
                                        <ZoneMap isDisrupted={false} />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[400] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-orange-600 dark:text-orange-400 shadow-md border border-orange-100 dark:border-orange-900/30 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        Your Zone: 3km Radius
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- TAB 3: WALLET --- */}
                        {activeTab === 'wallet' && step < 4 && (
                            <motion.div key="wallet" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                                <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden border border-slate-800">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
                                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                        Protected Earnings <HelpCircle size={14} className="text-slate-500" />
                                    </p>
                                    <p className="text-5xl font-extrabold mt-2 tracking-tight">₹{walletBalance}</p>

                                    <div className="mt-6">
                                        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                                            <span>Weekly Cap Usage</span>
                                            <span>₹{walletBalance} / ₹{WEEKLY_CAP}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((walletBalance / WEEKLY_CAP) * 100, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6 relative z-10">
                                        <button onClick={handleWithdraw} disabled={isWithdrawing || walletBalance === 0} className="flex-1 bg-white dark:bg-teal-500 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                                            {isWithdrawing ? <Loader2 size={18} className="animate-spin" /> : <ArrowDownToLine size={18} />}
                                            {isWithdrawing ? 'Processing...' : 'Withdraw'}
                                        </button>
                                        <button onClick={handleDownload} className="w-14 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors active:scale-95 border border-slate-700">
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-2">
                                    <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Transactions</h3>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center transition-colors">
                                        <Banknote className="text-slate-200 dark:text-slate-700 mb-3" size={40} />
                                        <p className="text-sm text-slate-400 font-medium">No payouts generated yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((tx) => (
                                            <div key={tx.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:border-teal-100 dark:hover:border-teal-900 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{tx.type}</p>
                                                        <p className="text-xs font-medium text-slate-400 mt-0.5">{tx.time} • Parametric Auto-Claim</p>
                                                    </div>
                                                </div>
                                                <p className="font-extrabold text-emerald-500 text-lg">+₹{tx.amount}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* --- DISRUPTION OVERRIDES --- */}
                        {step === 4 && (
                            <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
                                <div className="bg-red-500 dark:bg-red-600 p-5 rounded-3xl shadow-lg text-center text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                    <h3 className="font-extrabold flex items-center justify-center gap-2 text-lg">
                                        <AlertTriangle size={22} fill="currentColor" className="text-yellow-300" /> DISRUPTION DETECTED
                                    </h3>
                                    <p className="text-sm mt-2 font-medium opacity-90 leading-relaxed">{currentScenario.alert}</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <div className="w-10 h-10 border-4 border-slate-100 dark:border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
                                            <ShieldCheck size={16} className="absolute text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">Zero-Touch Claim Initiated</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Verifying presence in zone via AI...</p>
                                        </div>
                                    </div>

                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, ease: "linear" }}
                                            className="h-full bg-orange-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden shadow-sm border border-red-200 dark:border-red-900/50 p-1 bg-white dark:bg-slate-900">
                                    <div className="opacity-90 dark:opacity-75 grayscale-[0.2] dark:invert dark:hue-rotate-180 transition-all">
                                        <ZoneMap isDisrupted={true} />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[400] bg-red-600 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                                        <AlertOctagon size={14} /> {currentScenario.mapText}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="will-change-transform bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center mt-4 relative z-10 transition-colors">
                                <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-500/30 transform -rotate-6">
                                    <CheckCircle size={48} className="transform rotate-6" />
                                </div>

                                <h3 className="text-emerald-500 dark:text-emerald-400 font-extrabold text-xl uppercase tracking-wider mb-1">Claim Approved</h3>
                                <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">₹{currentScenario.amount}</h2>

                                <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold mt-4">
                                    <Banknote size={14} /> Transferred via UPI Instantly
                                </div>

                                <div className="text-sm text-left space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 mb-8">
                                    <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400 font-medium">Disruption Type</span><span className="font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">{currentScenario.type}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400 font-medium">Lost Duration</span><span className="font-bold text-slate-800 dark:text-white">{currentScenario.duration}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400 font-medium">Payout Rate</span><span className="font-bold text-slate-800 dark:text-white">₹100 / hour</span></div>
                                </div>

                                <button onClick={() => { setStep(3); setActiveTab('wallet'); setIsSimulating(false); }} className="w-full bg-slate-900 dark:bg-teal-500 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 dark:hover:bg-teal-400 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2">
                                    View in Wallet <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Bottom Navigation */}
                <nav className="shrink-0 w-full h-[72px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex justify-around items-center z-50 pb-safe transition-colors">
                    <button onClick={() => { if (step < 4) setActiveTab('home') }} className={`flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95 ${activeTab === 'home' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                        <Home size={22} className={activeTab === 'home' ? 'fill-teal-50 dark:fill-teal-900/50' : ''} />
                        <span className="text-[10px] mt-1 font-bold">Home</span>
                    </button>
                    <button onClick={() => { if (step < 4) setActiveTab('policy') }} className={`flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95 ${activeTab === 'policy' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                        <Shield size={22} className={activeTab === 'policy' ? 'fill-teal-50 dark:fill-teal-900/50' : ''} />
                        <span className="text-[10px] mt-1 font-bold">Policy</span>
                    </button>
                    <button onClick={() => { if (step < 4) setActiveTab('wallet') }} className={`flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95 ${activeTab === 'wallet' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                        <Wallet size={22} className={activeTab === 'wallet' ? 'fill-teal-50 dark:fill-teal-900/50' : ''} />
                        <span className="text-[10px] mt-1 font-bold">Wallet</span>
                    </button>
                </nav>

            </div>
        </div>
    );
}