"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import LogoIcon from "./LogoIcon";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#09090b]/70 backdrop-blur-lg border-b border-white/5 shadow-lg"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <LogoIcon className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Designmails
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="hidden md:inline-flex text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
            >
              Go to account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="hidden md:inline-flex text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              >
                Start free
              </Link>
            </>
          )}

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-20 left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl px-6 py-8 flex flex-col gap-6"
        >
          {["Features", "How it works", "Pricing", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
          <hr className="border-white/5 my-2" />
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-center text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Go to account
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-center text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Start free
            </Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
