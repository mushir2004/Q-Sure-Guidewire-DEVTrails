import { Home, Shield, Wallet, Settings } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    toggleGodMode?: () => void;
}

export default function MobileLayout({ children, toggleGodMode }: LayoutProps) {
    return (
        <div className="flex justify-center bg-black min-h-screen">
            <div className="w-full max-w-[480px] bg-gray-950 text-white relative shadow-2xl overflow-hidden flex flex-col">
                {/* Header with Hidden God Mode Toggle */}
                <header className="p-4 flex justify-between items-center z-10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        ⚡ Q-Sure
                    </h1>
                    <button
                        onClick={toggleGodMode}
                        className="opacity-0 w-6 h-6 absolute right-4 top-4 z-50"
                    >
                        <Settings size={16} />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-20 px-4">{children}</main>

                {/* Sticky Bottom Nav */}
                <nav className="absolute bottom-0 w-full h-16 bg-white/5 backdrop-blur-md border-t border-white/10 flex justify-around items-center text-gray-400">
                    <Home className="hover:text-purple-400 cursor-pointer" />
                    <Shield className="text-purple-400 cursor-pointer" />
                    <Wallet className="hover:text-purple-400 cursor-pointer" />
                </nav>
            </div>
        </div>
    );
}
