"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Zap, Home, Wallet, Map as MapIcon, LogOut, CloudRain, AlertTriangle, ShieldCheck, Banknote, MapPin, Moon, Sun, Download, Activity, ArrowRightLeft, Thermometer, AlertOctagon, LayoutDashboard, Users, PieChart } from "lucide-react";

const SpatialMap = dynamic(() => import("./MapComponent"), { ssr: false });

const API_BASE = "http://127.0.0.1:8000";

// ADDED DISRUPTIONS
const SCENARIOS = [
    { id: 'normal', name: 'Normal Mode', icon: MapPin, color: 'text-emerald-500', bg: 'border-emerald-500/30 bg-emerald-500/10', inputs: { v: 25, alt: 2, temp: 35, rain: 0 } },
    { id: 'flood', name: 'Flash Flood', icon: CloudRain, color: 'text-blue-500', bg: 'border-blue-500/30 bg-blue-500/10', inputs: { v: 5, alt: 2, temp: 28, rain: 25 } },
    { id: 'heatwave', name: 'Extreme Heat', icon: Thermometer, color: 'text-orange-500', bg: 'border-orange-500/30 bg-orange-500/10', inputs: { v: 0, alt: 2, temp: 44, rain: 0 } },
    { id: 'strike', name: 'Bandh / Strike', icon: AlertOctagon, color: 'text-yellow-500', bg: 'border-yellow-500/30 bg-yellow-500/10', inputs: { v: 0, alt: 2, temp: 35, rain: 0 } },
    { id: 'fraud', name: 'Teleport Anomaly', icon: Zap, color: 'text-red-500', bg: 'border-red-500/30 bg-red-500/10', inputs: { v: 140, alt: 0, temp: 25, rain: 0 } }
];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
    const [activeTab, setActiveTab] = useState("home");
    const [theme, setTheme] = useState("dark");
    const [scenIndex, setScenIndex] = useState(0);
    const [livePos, setLivePos] = useState<[number, number] | null>(null);

    const [logs, setLogs] = useState<string[]>(["[SYSTEM] Booted. Connect to Sentinel API."]);
    const [wallet, setWallet] = useState({ balance_inr: 0, last_payout: null as string | null, history: [] as any[] });
    const [premium, setPremium] = useState({ weekly_premium_inr: 20, dynamic_coverage_hours: 10 });
    const [claimStatus, setClaimStatus] = useState("Tracking Nominal.");

    // ADMIN METRICS
    const [adminMetrics, setAdminMetrics] = useState({ total_payouts: 0, loss_ratio: 0.38, fraud_prevention_savings: 14500, active_riders_online: 1242 });

    const logMsg = (msg: string) => setLogs(p => [msg, ...p].slice(0, 15));

    useEffect(() => {
        if (theme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [theme]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLivePos([pos.coords.latitude, pos.coords.longitude]),
                (err) => logMsg("[WARN] GPS blocked. Fallback active.")
            );
        }
    }, []);

    const fetchAdminMetrics = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/dashboard`);
            const data = await res.json();
            setAdminMetrics(data.metrics);
        } catch { logMsg("[WARN] Admin API offline. Using cached metrics."); }
    };

    const fetchAPIs = async (scenarioID: string, inputs: any) => {
        try {
            const pRes = await fetch(`${API_BASE}/calculate_premium`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ zone_risk_score: 9, forecasted_rainfall_mm: inputs.rain, forecasted_max_temp_c: inputs.temp, upcoming_event_flag: scenarioID === 'strike' ? 1 : 0 })
            });
            const pData = await pRes.json();
            setPremium(pData);
            logMsg(`[PRICING] LightGBM Premium: ₹${pData.weekly_premium_inr}`);
        } catch { logMsg("[ERROR] Pricing offline"); }

        if (scenarioID === 'fraud') {
            try {
                logMsg("[FRAUD] Isolation Forest analyzing telemetry...");
                const fRes = await fetch(`${API_BASE}/validate_claim`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ velocity_kmh: inputs.v, altitude_diff_m: inputs.alt, device_temp_c: inputs.temp })
                });
                const data = await fRes.json();
                setClaimStatus(data.status === "FLAGGED" ? `Escrow: ${data.ai_explanation}` : "Verified");
                if (data.status === "FLAGGED") {
                    logMsg(`[CRITICAL] Fraud Engine: Prob ${data.fraud_probability}.`);
                    fetchAdminMetrics(); // Update savings
                }
            } catch { logMsg("[ERROR] Fraud API offline"); }
        } else if (['flood', 'heatwave', 'strike'].includes(scenarioID)) {
            try {
                let triggerReason = "Rain > 15mm";
                if (scenarioID === 'heatwave') triggerReason = "Temp > 42°C";
                if (scenarioID === 'strike') triggerReason = "NLP Strike Alert";

                logMsg(`[ORACLE] Disruption: ${triggerReason}. Trigger parametric claim.`);
                const tRes = await fetch(`${API_BASE}/check_triggers/zone9?use_simulator=true`);
                const data = await tRes.json();
                if (data.disruption_active) {
                    const now = new Date().toLocaleTimeString();
                    setWallet(prev => ({
                        balance_inr: prev.balance_inr + data.payout,
                        last_payout: now,
                        history: [{ id: Date.now(), time: now, amount: data.payout, type: 'credit', desc: `Auto-Claim: ${triggerReason}` }, ...prev.history]
                    }));
                    setClaimStatus(`Zero-Touch Paid (${triggerReason})`);
                    logMsg(`[SUCCESS] ₹100 Added to Wallet.`);
                    fetchAdminMetrics();
                }
            } catch { logMsg("[ERROR] Trigger API offline"); }
        } else {
            setClaimStatus("Tracking Nominal. GPS Valid.");
            logMsg("[VERIFIED] Trajectory & Environment normal.");
        }
    };

    useEffect(() => {
        fetchAPIs('normal', SCENARIOS[0].inputs);
        fetchAdminMetrics();
    }, []);

    const cycleScenario = () => {
        const nextIdx = (scenIndex + 1) % SCENARIOS.length;
        setScenIndex(nextIdx);
        const scen = SCENARIOS[nextIdx];
        logMsg(`--- Switched to: ${scen.name} ---`);
        fetchAPIs(scen.id, scen.inputs);
    };

    const withdrawToUPI = () => {
        logMsg(`[UPI] Transferring ₹${wallet.balance_inr} to bank account...`);
        setTimeout(() => {
            setWallet(prev => ({
                balance_inr: 0,
                last_payout: null,
                history: [{ id: Date.now(), time: new Date().toLocaleTimeString(), amount: prev.balance_inr, type: 'debit', desc: 'UPI Bank Transfer' }, ...prev.history]
            }));
            logMsg("[UPI] Transfer Complete. Settled instantly.");
        }, 1000);
    };

    const exportGuidewire = async () => {
        try {
            logMsg("[EXPORT] Generating Guidewire ClaimCenter Schema...");
            const res = await fetch(`${API_BASE}/admin/export_to_guidewire`);
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `GW_Export_${data.TransactionID}.json`;
            a.click();
        } catch { logMsg("[ERROR] Guidewire export failed."); }
    };

    const currScen = SCENARIOS[scenIndex];
    const ScenIcon = currScen.icon;

    return (
        <div className="min-h-screen flex flex-col md:flex-row pb-24 md:pb-0 relative">
            <nav className="fixed md:static bottom-0 left-0 w-full md:w-24 glass-panel md:rounded-none md:border-y-0 md:border-l-0 z-50 p-4 flex md:flex-col justify-around items-center gap-6">
                <div className="hidden md:flex dark:text-purple-500 text-purple-700 font-bold tracking-widest -rotate-90 mt-12 mb-8">Q-SURE</div>
                {[
                    { id: 'home', icon: Home, label: 'Map' },
                    { id: 'policy', icon: ShieldCheck, label: 'Policy' },
                    { id: 'wallet', icon: Wallet, label: 'Wallet' },
                    { id: 'admin', icon: LayoutDashboard, label: 'Admin' }
                ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${activeTab === item.id ? 'dark:bg-white/10 bg-black/10 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
                        <item.icon size={24} />
                        <span className="text-[10px] md:hidden">{item.label}</span>
                    </button>
                ))}
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-xl text-slate-400 hover:text-amber-500 md:mt-auto">
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <button onClick={onLogout} className="p-3 rounded-xl text-red-400 md:mb-8 hover:bg-red-500/10"><LogOut size={24} /></button>
            </nav>

            <div className="flex-1 p-4 md:p-6 flex flex-col gap-6 h-screen overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-center glass-panel p-4 gap-4 z-10 shrink-0">
                    <div className="flex justify-between w-full md:w-auto items-center">
                        <div>
                            <h1 className="text-xl font-bold tracking-widest">RAMESH_ZOM_442</h1>
                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                <MapPin size={12} /> {livePos ? `GPS: ${livePos[0].toFixed(2)}, ${livePos[1].toFixed(2)}` : 'Zone 9'} • Active
                            </p>
                        </div>
                    </div>
                    <button onClick={cycleScenario} className={`glass-button w-full md:w-auto border flex items-center gap-2 ${currScen.bg} ${currScen.color}`}>
                        <ScenIcon size={18} /> Cycle Disruption: {currScen.name}
                    </button>
                </header>

                <AnimatePresence mode="wait">
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col md:flex-row gap-6">
                            <div className="w-full h-[300px] md:h-auto md:flex-1 glass-panel p-2 rounded-xl overflow-hidden relative border-2 border-white/5 shrink-0">
                                <SpatialMap theme={theme} scenario={currScen.id} livePos={livePos} />
                                <div className="absolute top-4 left-4 z-[400] glass-panel bg-black/50 p-3 text-xs backdrop-blur-md">
                                    <div className="text-white/60 mb-1 font-bold tracking-wider">Live Telemetry</div>
                                    <div className="text-white">Vel: {currScen.inputs.v} km/h</div>
                                    <div className="text-white">Alt: {currScen.inputs.alt} m</div>
                                    <div className="text-white">Temp: {currScen.inputs.temp} °C</div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col gap-6 shrink-0">
                                <div className={`p-5 rounded-xl border ${currScen.bg} ${currScen.color} glass-panel`}>
                                    <h3 className="font-bold flex items-center gap-2 mb-2"><AlertTriangle size={18} /> Status Check</h3>
                                    <p className="text-sm opacity-90">{claimStatus}</p>
                                </div>

                                <div className="glass-panel flex-1 p-5 flex flex-col min-h-[200px]">
                                    <h3 className="text-xs font-bold opacity-50 mb-3 uppercase tracking-wider flex items-center gap-2"><Activity size={14} /> System Logs</h3>
                                    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                                        {logs.map((log, i) => (
                                            <div key={i} className={`text-[11px] font-mono p-2.5 rounded dark:bg-black/40 bg-white/60 ${log.includes('CRITICAL') || log.includes('ERROR') ? 'text-red-500 border-l-2 border-red-500' : log.includes('SUCCESS') || log.includes('VERIFIED') ? 'text-emerald-500 border-l-2 border-emerald-500' : 'opacity-80'}`}>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ADMIN TAB */}
                    {activeTab === 'admin' && (
                        <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                            <div className="glass-panel p-6 flex justify-between items-center bg-purple-500/5 border-purple-500/20">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2 text-purple-500"><LayoutDashboard size={24} /> Insurer Command Center</h2>
                                    <p className="text-sm opacity-60 mt-1">Live portfolio metrics & risk aggregation.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <PieChart size={32} className="text-blue-500 mb-4" />
                                    <span className="text-xs opacity-50 uppercase tracking-widest">Loss Ratio</span>
                                    <span className="text-4xl font-light text-blue-500 mt-2">{adminMetrics.loss_ratio}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Banknote size={32} className="text-emerald-500 mb-4" />
                                    <span className="text-xs opacity-50 uppercase tracking-widest">Total Payouts</span>
                                    <span className="text-4xl font-light text-emerald-500 mt-2">₹{adminMetrics.total_payouts + wallet.balance_inr}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Zap size={32} className="text-red-500 mb-4" />
                                    <span className="text-xs opacity-50 uppercase tracking-widest">Fraud Prevented</span>
                                    <span className="text-4xl font-light text-red-500 mt-2">₹{adminMetrics.fraud_prevention_savings}</span>
                                </div>

                                <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
                                    <Users size={32} className="text-purple-500 mb-4" />
                                    <span className="text-xs opacity-50 uppercase tracking-widest">Active Riders</span>
                                    <span className="text-4xl font-light text-purple-500 mt-2">{adminMetrics.active_riders_online}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* POLICY TAB */}
                    {activeTab === 'policy' && (
                        <motion.div key="policy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel p-8">
                                <h3 className="opacity-60 mb-6 flex items-center gap-2"><ShieldCheck size={20} /> AI Dynamic Premium</h3>
                                <div className="text-5xl font-light mb-2">₹{premium.weekly_premium_inr}<span className="text-lg opacity-40">/week</span></div>
                                <p className="text-sm opacity-50 mb-8">Calculated via LightGBM. Coverage: {premium.dynamic_coverage_hours}h/day.</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b dark:border-white/5 border-black/5 pb-4">
                                        <span className="opacity-70">Base Premium</span><span>₹20</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b dark:border-white/5 border-black/5 pb-4">
                                        <span className="text-red-500 text-sm">+ Risk Penalty (Zone 9)</span><span className="text-red-500">₹4</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4">
                                        <span className={`${currScen.inputs.rain > 15 || currScen.inputs.temp > 40 || currScen.id === 'strike' ? 'text-blue-500' : 'text-emerald-500'} text-sm`}>
                                            {currScen.inputs.rain > 15 ? '+ Heavy Rain Forecast' : currScen.inputs.temp > 40 ? '+ Heatwave Forecast' : currScen.id === 'strike' ? '+ Event Penalty' : 'Clear Discount'}
                                        </span>
                                        <span className={currScen.inputs.rain > 15 || currScen.inputs.temp > 40 || currScen.id === 'strike' ? 'text-blue-500' : 'text-emerald-500'}>
                                            {currScen.inputs.rain > 15 || currScen.inputs.temp > 40 || currScen.id === 'strike' ? `₹${premium.weekly_premium_inr - 24}` : '-₹0'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 flex flex-col gap-6">
                                <h3 className="opacity-60 flex items-center gap-2"><AlertTriangle size={20} /> Parametric Logic (API Triggers)</h3>
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-4 items-center">
                                    <div className="bg-blue-500/20 p-3 rounded-lg"><CloudRain className="text-blue-500" /></div>
                                    <div><h4 className="font-medium text-blue-500">Flash Flood</h4><p className="text-xs opacity-60">OpenWeather {'>'} 15mm/hr + Traffic {'<'} 8km/h</p></div>
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-4 items-center">
                                    <div className="bg-orange-500/20 p-3 rounded-lg"><Thermometer className="text-orange-500" /></div>
                                    <div><h4 className="font-medium text-orange-500">Extreme Heat</h4><p className="text-xs opacity-60">Temp {'>'} 42°C + Forced AI Break</p></div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-4 items-center">
                                    <div className="bg-red-500/20 p-3 rounded-lg"><Zap className="text-red-500" /></div>
                                    <div><h4 className="font-medium text-red-500">Fraud Defense</h4><p className="text-xs opacity-60">Blocks GPS spoofing via ML sensor fusion</p></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* WALLET TAB */}
                    {activeTab === 'wallet' && (
                        <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="col-span-1 md:col-span-8 glass-panel p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <h3 className="opacity-60 flex items-center gap-2"><Banknote size={20} /> Payout Ledger</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-light">₹{wallet.balance_inr}</div>
                                        {wallet.balance_inr > 0 && (
                                            <button onClick={withdrawToUPI} className="glass-button bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/40 text-purple-600 dark:text-purple-400 shrink-0">
                                                <ArrowRightLeft size={16} /> Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {wallet.history.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            {wallet.history.map(txn => (
                                                <div key={txn.id} className={`p-4 rounded-xl flex justify-between items-center border ${txn.type === 'credit' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-purple-500/10 border-purple-500/30'}`}>
                                                    <div>
                                                        <h4 className={`font-bold ${txn.type === 'credit' ? 'text-emerald-500' : 'text-purple-500'}`}>{txn.desc}</h4>
                                                        <p className="text-sm opacity-70 mt-1">{txn.time}</p>
                                                    </div>
                                                    <div className={`text-xl font-light ${txn.type === 'credit' ? 'text-emerald-500' : 'text-purple-500'}`}>
                                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 opacity-40 border-2 border-dashed dark:border-white/10 border-black/10 rounded-xl">
                                            Balance 0. Cycle Disruption to trigger parametric payout.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                                <div className="glass-panel p-6 flex flex-col gap-4 border-emerald-500/20 bg-emerald-500/5">
                                    <h3 className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2"><Download size={18} /> Guidewire Sync</h3>
                                    <p className="text-xs opacity-70">Export verified claims to Guidewire ClaimCenter JSON schema format.</p>
                                    <button onClick={exportGuidewire} className="glass-button bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 mt-2">
                                        Download Payload
                                    </button>
                                </div>

                                {currScen.id === 'fraud' && (
                                    <div className="glass-panel p-6 flex flex-col gap-2 border-red-500/20 bg-red-500/5">
                                        <h3 className="text-red-500 font-bold flex items-center gap-2"><ShieldAlert size={16} /> Escrow Active</h3>
                                        <div className="text-2xl font-light text-red-500 mt-1">₹14,500 Frozen</div>
                                        <p className="text-xs opacity-70">Payouts halted. ML flags potential spoof syndicate.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}