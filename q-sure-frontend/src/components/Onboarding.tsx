"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ShieldCheck, Briefcase, Landmark } from "lucide-react";

const steps = [
    { id: 1, title: "Enter Phone", icon: Smartphone, input: "Phone Number" },
    { id: 2, title: "Verify OTP", icon: ShieldCheck, input: "6-Digit OTP" },
    { id: 3, title: "Link Platform", icon: Briefcase, input: "Select Platform" },
    { id: 4, title: "Payout Setup", icon: Landmark, input: "UPI ID" }
];

const platforms = ["Zomato", "Swiggy", "Blinkit", "Zepto"];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [selectedPlatform, setSelectedPlatform] = useState("");

    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);

    const nextStep = () => {
        if (step === 3) {
            localStorage.setItem("qsure_platform", selectedPlatform);
            onComplete();
        } else {
            setStep((s) => s + 1);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 transition-colors relative">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
                <div className="flex gap-2 mb-8">
                    {steps.map((s, i) => (
                        <div key={s.id} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-white/10'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 text-purple-400">
                            {(() => { const Icon = steps[step].icon; return <Icon size={32} />; })()}
                            <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
                        </div>
                        <p className="text-white/60 text-sm">Secure spatial data sync initiated.</p>

                        {step === 2 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {platforms.map(p => (
                                    <button key={p} onClick={() => setSelectedPlatform(p)} className={`glass-button py-4 ${selectedPlatform === p ? 'bg-purple-900/30 border-purple-500 text-purple-400' : ''}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <input type="text" placeholder={steps[step].input} className="glass-input" />
                        )}

                        <button onClick={nextStep} disabled={step === 2 && !selectedPlatform} className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-bold mt-4 disabled:opacity-50 transition-colors shadow-lg shadow-purple-500/20">
                            {step === 3 ? "Initialize Dashboard" : "Continue"}
                        </button>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}