"use client";

import React, { useEffect, useState } from "react";
import { WhopUser } from "@/lib/types";
import { getWhopOAuthUrl } from "@/lib/whop";
import { ShieldCheck, LogOut, ArrowRight, UserCheck } from "lucide-react";

export default function WhopAuthButton() {
  const [user, setUser] = useState<WhopUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch authenticated user info from server-verified session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch session:", err);
        setUser(null);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  const handleLogin = () => {
    window.location.href = getWhopOAuthUrl();
  };

  if (!mounted) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {user.username}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-medium">
            {user.membershipPlan || "Active Subscriber"}
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-semibold text-xs border border-indigo-400/30">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="h-full w-full rounded-full object-cover" />
          ) : (
            <UserCheck className="h-4 w-4" />
          )}
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md hover:shadow-indigo-500/25 transition-all"
    >
      <ShieldCheck className="h-4 w-4" />
      <span>Subscriber Login</span>
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}
