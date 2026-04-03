import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ShieldCheck, Briefcase, Landmark, ArrowRight, Loader2, CheckCircle, Moon, Sun } from 'lucide-react';

export default function Onboarding() {
    const router = useRouter();
    useEffect(() => {
        router.prefetch('/');
    }, [router]);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const handleNext = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            if (step < 4) {
                setStep(step + 1);
            } else {
                // ADD THIS: Save the platform they clicked
                if (selectedPlatform) localStorage.setItem('qsure-platform', selectedPlatform);

                localStorage.setItem('qsure-onboarded', 'true');
                router.push('/');
            }
        }, 1200);
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        if (digit && index < 3) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <div className={`flex justify-center min-h-[100dvh] ${theme === 'dark' ? 'bg-black dark' : 'bg-gray-200'} transition-colors duration-300`}>
            <div className="w-full max-w-[480px] h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative shadow-2xl flex flex-col font-sans transition-colors duration-300">

                {/* Progress Bar & Header */}
                <header className="pt-12 pb-4 px-6 bg-white dark:bg-slate-950 z-10 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">Setup Profile</h1>
                            <span className="text-xs font-bold text-teal-500">Step {step} of 4</span>
                        </div>
                        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 bg-slate-50 dark:bg-slate-900 rounded-full transition-colors active:scale-95">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-teal-500 rounded-full"
                            initial={{ width: "25%" }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </header>

                {/* Form Content */}
                <main className="flex-1 overflow-hidden relative px-6 pt-6">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: Phone Number */}
                        {step === 1 && (
                            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="h-full flex flex-col">
                                <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 transition-colors">
                                    <Smartphone size={32} />
                                </div>
                                <h2 className="text-3xl font-black mb-2 dark:text-white">Secure Your Income</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Enter your mobile number to start your zero-touch coverage.</p>

                                <div className="flex gap-3 mb-auto">
                                    <div className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
                                        +91
                                    </div>
                                    <input type="tel" placeholder="98765 43210" className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 font-bold text-lg text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-500 transition-colors shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Verify OTP */}
                        {step === 2 && (
                            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="h-full flex flex-col">
                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 transition-colors">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-3xl font-black mb-2 dark:text-white">Verify Phone</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Enter the 4-digit code sent to your device.</p>

                                <div className="flex gap-3 justify-between mb-auto">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { otpRefs.current[index] = el; }}
                                            type="number"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            placeholder="•"
                                            className="w-16 h-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-2xl text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Link Platform */}
                        {step === 3 && (
                            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="h-full flex flex-col">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 transition-colors">
                                    <Briefcase size={32} />
                                </div>
                                <h2 className="text-3xl font-black mb-2 dark:text-white">Link Gig Platform</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Connect your delivery account to automate claims via API.</p>

                                <div className="space-y-3 mb-auto">
                                    {['Swiggy Instamart', 'Zomato', 'Zepto'].map((platform) => (
                                        <button
                                            key={platform}
                                            onClick={() => setSelectedPlatform(platform)}
                                            className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex justify-between items-center active:scale-[0.98] ${selectedPlatform === platform ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-700'}`}
                                        >
                                            {platform}
                                            {selectedPlatform === platform && <CheckCircle size={20} />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Payout Details */}
                        {step === 4 && (
                            <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="h-full flex flex-col">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transition-colors">
                                    <Landmark size={32} />
                                </div>
                                <h2 className="text-3xl font-black mb-2 dark:text-white">Payout Details</h2>
                                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Where should we send your automated claim money?</p>

                                <div className="space-y-4 mb-auto">
                                    <input type="text" placeholder="UPI ID (e.g., ramesh@okhdfc)" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                                    <div className="flex items-center gap-3">
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                    </div>
                                    <input type="text" placeholder="Bank Account Number" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 font-bold text-slate-900 dark:text-white outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Sticky Bottom Action Bar */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 pb-safe z-10 transition-colors">
                    <button
                        onClick={handleNext}
                        disabled={isProcessing || (step === 3 && !selectedPlatform)}
                        className="w-full h-14 bg-slate-900 dark:bg-teal-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-teal-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                    >
                        {isProcessing ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                {step === 4 ? 'Complete Registration' : 'Continue'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}