"use client";

import { useState, useEffect } from "react";
import Onboarding from "@/components/Onboarding";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("qsure_onboarded");
    setHasOnboarded(status === "true");
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem("qsure_onboarded", "true");
    setHasOnboarded(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("qsure_onboarded");
    setHasOnboarded(false);
  };

  if (hasOnboarded === null) return null;

  return (
    <main>
      {hasOnboarded ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}
    </main>
  );
}