"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Home, Wallet, LogOut, CloudRain, AlertTriangle, ShieldCheck, Banknote, Download, Activity, Thermometer, AlertOctagon, LayoutDashboard, Users, PieChart, CheckCircle, Loader2, MapPin } from "lucide-react";

const SpatialMap = dynamic(() => import("./MapComponent"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://q-sure-guidewire-devtrails.onrender.com";

const SCENARIOS = [
    { id: 'normal', name: 'Normal Mode', icon: ShieldCheck, color: 'dark:text-emerald-400', border: 'border-emerald-500/30', inputs: { v: 25, alt: 2, temp: 35, rain: 0 } },
    { id: 'flood', name: 'Flash Flood', icon: CloudRain, color: 'dark:text-blue-400', border: 'border-blue-500/30', inputs: { v: 5, alt: 2, temp: 28, rain: 25 } },
    { id: 'heatwave', name: 'Extreme Heat', icon: Thermometer, color: 'dark:text-orange-400', border: 'border-orange-500/30', inputs: { v: 0, alt: 2, temp: 44, rain: 0 } },
    { id: 'strike', name: 'Bandh / Strike', icon: AlertOctagon, color: 'dark:text-red-400', border: 'border-red-500/30', inputs: { v: 0, alt: 2, temp: 35, rain: 0 } },
    { id: 'fraud', name: 'Teleport Anomaly', icon: Zap, color: 'dark:text-purple-400', border: 'border-purple-500/30', inputs: { v: 140, alt: 0, temp: 25, rain: 0 } }
];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
    const [activeTab, setActiveTab] = useState("home");
    const [username, setUsername] = useState("RAMESH_ZOM_442");
    const [scenIndex, setScenIndex] = useState(0);
    const [livePos, setLivePos] = useState<[number, number] | null>(null);

    const [wallet, setWallet] = useState({ balance_inr: 0, history: [] as any[] });
    const [premium, setPremium] = useState({ weekly_premium_inr: 35 });
    const [isProcessing, setIsProcessing] = useState(false);
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] Booted. Sentinel AI active."]);

    const [modal, setModal] = useState({ show: false, amount: 0, reason: '', duration: '' });
    const [adminMetrics, setAdminMetrics] = useState({ total_payouts: 0, loss_ratio: 0.38, fraud_prevention_savings: 14500, active_riders_online: 1242 });

    const logMsg = (msg: string) => setLogs(p => [msg, ...p].slice(0, 15));

    useEffect(() => {
        document.documentElement.classList.add("dark");
        const plat = localStorage.getItem("qsure_platform") || "Zomato";
        const codes: Record<string, string> = { Zomato: "ZOM", Swiggy: "SWG", Blinkit: "BLK", Zepto: "ZEP" };
        setUsername(`RAMESH_${codes[plat] || "ZOM"}_442`);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLivePos([pos.coords.latitude, pos.coords.longitude])
            );
        }
        fetchAdminMetrics();
    }, []);

    const fetchAdminMetrics = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/dashboard`);
            const data = await res.json();
            setAdminMetrics(data.metrics);
        } catch (e) { }
    };

    const fetchAPIs = async (scenarioID: string, inputs: any) => {
        setModal({ show: false, amount: 0, reason: '', duration: '' });

        try {
            const pRes = await fetch(`${API_BASE}/calculate_premium`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ zone_risk_score: 9, forecasted_rainfall_mm: inputs.rain, forecasted_max_temp_c: inputs.temp, upcoming_event_flag: scenarioID === 'strike' ? 1 : 0 })
            });
            const pData = await pRes.json();
            setPremium({ weekly_premium_inr: pData.weekly_premium_inr });
        } catch (e) { }

        if (scenarioID === 'normal') {
            setIsProcessing(false);
            logMsg("[VERIFIED] Weather & Trajectory normal.");
            return;
        }

        setIsProcessing(true);
        logMsg(`[ALERT] Detected potential ${scenarioID}. Verifying presence...`);

        setTimeout(async () => {
            if (['flood', 'heatwave', 'strike'].includes(scenarioID)) {
                try {
                    const res = await fetch(`${API_BASE}/check_triggers/zone9?use_simulator=true`);
                    const data = await res.json();
                    if (data.disruption_active) {
                        const now = new Date().toLocaleTimeString();
                        const triggerReason = scenarioID === 'flood' ? 'Flash Flood' : scenarioID === 'heatwave' ? 'Extreme Heat' : 'Local Strike';
                        setWallet(prev => ({
                            balance_inr: prev.balance_inr + data.payout,
                            history: [{ id: Date.now(), time: now, amount: data.payout, type: 'credit', desc: triggerReason }, ...prev.history]
                        }));
                        setModal({ show: true, amount: data.payout, reason: `${triggerReason} (Verified)`, duration: '2 Hours (4:00 PM - 6:00 PM)' });
                        logMsg(`[SUCCESS] Parametric conditions met. Payout triggered.`);
                        fetchAdminMetrics();
                    }
                } catch (e) {
                    setWallet(prev => ({
                        balance_inr: prev.balance_inr + 200,
                        history: [{ id: Date.now(), time: new Date().toLocaleTimeString(), amount: 200, type: 'credit', desc: 'Disruption (Offline Fallback)' }, ...prev.history]
                    }));
                    setModal({ show: true, amount: 200, reason: `Disruption Verified`, duration: '2 Hours (4:00 PM - 6:00 PM)' });
                }
            } else if (scenarioID === 'fraud') {
                logMsg(`[CRITICAL] Isolation Forest blocked GPS Spoofing attempt.`);
                setWallet(prev => ({
                    balance_inr: prev.balance_inr,
                    history: [{ id: Date.now(), time: new Date().toLocaleTimeString(), amount: 0, type: 'debit', desc: 'Escrow: ML Flagged Spoofing' }, ...prev.history]
                }));
            }
            setIsProcessing(false);
        }, 2500);
    };

    const cycleScenario = () => {
        const nextIdx = (scenIndex + 1) % SCENARIOS.length;
        setScenIndex(nextIdx);
        fetchAPIs(SCENARIOS[nextIdx].id, SCENARIOS[nextIdx].inputs);
    };

    const withdrawToUPI = () => {
        logMsg("[UPI] Initiating bank transfer...");
        setTimeout(() => {
            setWallet(prev => ({
                balance_inr: 0,
                history: [{ id: Date.now(), time: new Date().toLocaleTimeString(), amount: prev.balance_inr, type: 'debit', desc: 'UPI Bank Transfer Settled' }, ...prev.history]
            }));
            logMsg("[SUCCESS] Transfer settled instantly.");
        }, 1000);
    };

    const exportGuidewire = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/export_to_guidewire`);
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `GW_Export_${data.TransactionID}.json`;
            a.click();
        } catch { }
    };

    const currScen = SCENARIOS[scenIndex];
    const isNormal = currScen.id === 'normal';

    return (
        <div className="min-h-screen flex flex-col md:flex-row pb-24 md:pb-0 relative transition-colors">

            <AnimatePresence>
                {modal.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel dark:bg-slate-900/90 rounded-[2rem] p-8 w-full max-w-sm flex flex-col items-center dark:border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                            <CheckCircle size={80} className="dark:text-emerald-400 mb-4" strokeWidth={1.5} />
                            <h2 className="text-5xl font-light dark:text-emerald-400 mb-2">₹{modal.amount}</h2>
                            <h3 className="text-xl font-bold dark:text-white mb-1">Claim Approved!</h3>
                            <p className="dark:text-emerald-400/80 font-medium mb-8 text-sm">Transferred via UPI</p>

                            <div className="w-full flex flex-col gap-4 text-sm mb-8">
                                <div className="flex justify-between border-b dark:border-white/10 pb-2">
                                    <span className="dark:text-white/50">Disruption Type</span>
                                    <span className="font-medium dark:text-white">{modal.reason}</span>
                                </div>
                                <div className="flex justify-between border-b dark:border-white/10 pb-2">
                                    <span className="dark:text-white/50">Lost Duration</span>
                                    <span className="font-medium dark:text-white">{modal.duration}</span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="dark:text-white/50">Payout Rate</span>
                                    <span className="font-medium dark:text-white">₹100/hour</span>
                                </div>
                            </div>

                            <button onClick={() => { setModal({ ...modal, show: false }); setActiveTab('wallet'); }} className="w-full glass-button dark:bg-blue-600/30 dark:hover:bg-blue-600/50 dark:border-blue-500/50 dark:text-white rounded-xl py-3 font-medium transition-all">
                                View Transaction History
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="fixed md:static bottom-0 left-0 w-full md:w-24 glass-panel md:rounded-none md:border-y-0 md:border-l-0 z-50 p-4 flex md:flex-col justify-around items-center gap-6">
                <div className="hidden md:flex dark:text-purple-500 font-bold tracking-widest -rotate-90 mt-12 mb-8">Q-SURE</div>
                {[
                    { id: 'home', icon: Home, label: 'Home' },
                    { id: 'policy', icon: ShieldCheck, label: 'Policy' },
                    { id: 'wallet', icon: Wallet, label: 'Wallet' },
                    { id: 'admin', icon: LayoutDashboard, label: 'Admin' }
                ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === item.id ? 'dark:bg-white/10 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'dark:text-slate-400 dark:hover:text-slate-200'}`}>
                        <item.icon size={24} />
                        <span className="text-[10px] md:hidden">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 h-screen overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel p-4 md:px-8 gap-4 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold tracking-widest dark:text-white/90">{username}</h1>
                        <p className="text-xs dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {livePos ? `GPS: ${livePos[0].toFixed(2)}, ${livePos[1].toFixed(2)}` : 'Zone 9'} • Online
                        </p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button onClick={cycleScenario} className={`glass-button flex-1 md:flex-none border ${currScen.border} ${currScen.color} dark:bg-black/20`}>
                            <currScen.icon size={18} /> Cycle: {currScen.name}
                        </button>
                        <button onClick={onLogout} className="glass-button p-3 dark:text-red-400 dark:hover:bg-red-500/10">
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                        <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
                            <div className="col-span-1 md:col-span-8 flex flex-col gap-6">

                                <div className={`glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4 border ${isNormal ? 'border-emerald-500/30' : currScen.id === 'fraud' ? 'dark:border-purple-500/50 dark:bg-purple-500/10' : 'dark:border-orange-500/50 dark:bg-orange-500/10'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${isNormal ? 'dark:bg-emerald-500/20' : currScen.id === 'fraud' ? 'dark:bg-purple-500/20' : 'dark:bg-orange-500/20'}`}>
                                            {isNormal ? <ShieldCheck size={28} className="dark:text-emerald-400" /> : <AlertTriangle size={28} className="dark:text-white" />}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold dark:text-white uppercase tracking-wider">
                                                {isNormal ? 'Coverage is ACTIVE' : currScen.id === 'fraud' ? 'Escrow Locked' : 'Disruption Detected'}
                                            </h2>
                                            <p className="text-sm dark:text-white/70">
                                                {isNormal ? `Weekly Premium: ₹${premium.weekly_premium_inr}` : currScen.id === 'fraud' ? 'GPS Spoofing flagged.' : `Localized ${currScen.name} reported.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isProcessing && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-panel p-5 border-blue-500/30 dark:bg-blue-500/10 flex items-center gap-4">
                                            <Loader2 className="animate-spin dark:text-blue-400 shrink-0" size={28} />
                                            <div>
                                                <p className="dark:text-white font-bold text-sm">Zero-Touch Claim Initiated.</p>
                                                <p className="font-normal dark:text-white/60 text-xs mt-1">Verifying your presence in the zone. No filing required.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="glass-panel p-2 flex-1 min-h-[350px] relative overflow-hidden flex flex-col">
                                    <div className="flex-1 rounded-xl overflow-hidden relative">
                                        <SpatialMap theme="dark" scenario={currScen.id} livePos={livePos} />
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] glass-panel dark:bg-black/60 px-4 py-2 text-xs font-bold dark:text-orange-400 border dark:border-orange-500/30">
                                            Your Zone: 3km Radius
                                        </div>
                                        <div className="absolute top-4 left-4 z-[400] glass-panel dark:bg-black/60 p-3 text-xs">
                                            <div className="dark:text-white/50 mb-1 font-bold">Live Telemetry</div>
                                            <div className="dark:text-white">Vel: {currScen.inputs.v} km/h</div>
                                            <div className="dark:text-white">Alt: {currScen.inputs.alt} m</div>
                                            <div className="dark:text-white">Temp: {currScen.inputs.temp} °C</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-lg font-medium dark:text-white/80 mb-4">Forecast</h3>
                                    <CloudRain size={48} className="dark:text-white/40 mb-3" strokeWidth={1} />
                                    <p className="text-md dark:text-white/60">Tomorrow's Risk: <span className={`font-bold ${isNormal ? 'dark:text-emerald-400' : 'dark:text-orange-400'}`}>{isNormal ? 'Low' : 'High'}</span></p>
                                </div>

                                <div className="glass-panel p-6 text-center">
                                    <h3 className="text-lg font-medium dark:text-white/80">Prev Payout: ₹{wallet.history.length > 0 ? wallet.history[0].amount : 0}</h3>
                                    <p className="dark:text-emerald-400/80 text-sm mt-1">({wallet.history.length > 0 ? wallet.history[0].desc : 'No Disruption detected'})</p>
                                </div>

                                <div className="glass-panel flex-1 p-5 flex flex-col min-h-[200px]">
                                    <h3 className="text-xs font-bold dark:text-white/50 mb-3 uppercase tracking-wider flex items-center gap-2"><Activity size={14} /> System Logs</h3>
                                    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                                        {logs.map((log, i) => (
                                            <div key={i} className={`text-[11px] font-mono p-2.5 rounded dark:bg-white/5 ${log.includes('CRITICAL') || log.includes('ERROR') ? 'dark:text-red-400 border-l-2 border-red-500' : log.includes('SUCCESS') || log.includes('VERIFIED') ? 'dark:text-emerald-400 border-l-2 border-emerald-500' : 'dark:text-white/70'}`}>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'policy' && (
                        <motion.div key="policy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel p-8">
                                <h3 className="dark:text-white/60 mb-6 flex items-center gap-2"><ShieldCheck size={20} /> AI Dynamic Premium</h3>
                                <div className="text-5xl font-light dark:text-white mb-2">₹{premium.weekly_premium_inr}<span className="text-lg opacity-40">/week</span></div>
                                <p className="text-sm dark:text-white/50 mb-8">Calculated via LightGBM. Coverage: 10h/day.</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b dark:border-white/10 pb-4">
                                        <span className="dark:text-white/70">Base Premium</span><span className="dark:text-white">₹20</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b dark:border-white/10 pb-4">
                                        <span className="dark:text-orange-400 text-sm">+ Risk Penalty (Zone 9)</span><span className="dark:text-orange-400">₹4</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 flex flex-col gap-6">
                                <h3 className="dark:text-white/60 flex items-center gap-2"><AlertTriangle size={20} /> Parametric Triggers</h3>
                                <div className="dark:bg-blue-500/10 border dark:border-blue-500/20 p-4 rounded-xl flex gap-4 items-center">
                                    <div className="dark:bg-blue-500/20 p-3 rounded-lg"><CloudRain className="dark:text-blue-400" /></div>
                                    <div><h4 className="font-medium dark:text-blue-400">Flash Flood</h4><p className="text-xs dark:text-white/60">Rain {'>'} 15mm/hr + Traffic {'<'} 8km/h</p></div>
                                </div>
                                <div className="dark:bg-purple-500/10 border dark:border-purple-500/20 p-4 rounded-xl flex gap-4 items-center">
                                    <div className="dark:bg-purple-500/20 p-3 rounded-lg"><Zap className="dark:text-purple-400" /></div>
                                    <div><h4 className="font-medium dark:text-purple-400">Fraud Defense</h4><p className="text-xs dark:text-white/60">Blocks GPS spoofing via Sensor Fusion ML</p></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'wallet' && (
                        <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="col-span-1 md:col-span-8 glass-panel p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <h3 className="dark:text-white/60 flex items-center gap-2"><Banknote size={20} /> Payout Ledger</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-light dark:text-white">₹{wallet.balance_inr}</div>
                                        {wallet.balance_inr > 0 && (
                                            <button onClick={withdrawToUPI} className="glass-button dark:bg-purple-500/20 dark:hover:bg-purple-500/30 dark:border-purple-500/40 dark:text-purple-400 shrink-0">
                                                Withdraw via UPI
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {wallet.history.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            {wallet.history.map(txn => (
                                                <div key={txn.id} className={`p-4 rounded-xl flex justify-between items-center border dark:bg-white/5 ${txn.type === 'credit' ? 'dark:border-emerald-500/30' : 'dark:border-white/10'}`}>
                                                    <div>
                                                        <h4 className={`font-medium ${txn.type === 'credit' ? 'dark:text-emerald-400' : 'dark:text-white/80'}`}>{txn.desc}</h4>
                                                        <p className="text-sm dark:text-white/50 mt-1">{txn.time}</p>
                                                    </div>
                                                    <div className={`text-xl font-light ${txn.type === 'credit' ? 'dark:text-emerald-400' : 'dark:text-white/80'}`}>
                                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 dark:text-white/40 border-2 border-dashed dark:border-white/10 rounded-xl">
                                            Balance 0. Cycle Disruption to trigger payout.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                                <div className="glass-panel p-6 flex flex-col gap-4 border-emerald-500/20 dark:bg-emerald-500/5">
                                    <h3 className="dark:text-emerald-400 font-bold flex items-center gap-2"><Download size={18} /> Guidewire Sync</h3>
                                    <p className="text-xs dark:text-white/70">Export verified claims to ClaimCenter JSON.</p>
                                    <button onClick={exportGuidewire} className="glass-button dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400 mt-2">
                                        Download Payload
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'admin' && (
                        <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                            <div className="glass-panel p-6 flex justify-between items-center dark:bg-purple-500/5 dark:border-purple-500/20">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-purple-400"><LayoutDashboard size={24} /> Command Center</h2>
                                    <p className="text-sm dark:text-white/60 mt-1">Live Insurer portfolio metrics.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <PieChart size={32} className="dark:text-blue-400 mb-4" />
                                    <span className="text-xs dark:text-white/50 uppercase tracking-widest">Loss Ratio</span>
                                    <span className="text-4xl font-light dark:text-blue-400 mt-2">{adminMetrics.loss_ratio}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Banknote size={32} className="dark:text-emerald-400 mb-4" />
                                    <span className="text-xs dark:text-white/50 uppercase tracking-widest">Total Payouts</span>
                                    <span className="text-4xl font-light dark:text-emerald-400 mt-2">₹{adminMetrics.total_payouts + wallet.balance_inr}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Zap size={32} className="dark:text-red-400 mb-4" />
                                    <span className="text-xs dark:text-white/50 uppercase tracking-widest">Fraud Saved</span>
                                    <span className="text-4xl font-light dark:text-red-400 mt-2">₹{adminMetrics.fraud_prevention_savings}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Users size={32} className="dark:text-purple-400 mb-4" />
                                    <span className="text-xs dark:text-white/50 uppercase tracking-widest">Active Riders</span>
                                    <span className="text-4xl font-light dark:text-purple-400 mt-2">{adminMetrics.active_riders_online}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}