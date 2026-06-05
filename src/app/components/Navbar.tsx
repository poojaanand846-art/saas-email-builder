"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-900 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#6366f1] flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Designmails
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:inline-flex text-sm font-semibold text-white bg-[#6366f1] hover:bg-indigo-500 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
          >
            Start free
          </Link>

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
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0f172a] border-b border-slate-900 shadow-xl px-6 py-6 flex flex-col gap-4">
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">
            How it works
          </Link>
          <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">
            Pricing
          </Link>
          <Link href="#faq" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white">
            FAQ
          </Link>
          <hr className="border-slate-800 my-2" />
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="text-center text-base font-semibold text-white bg-[#6366f1] hover:bg-indigo-500 px-5 py-3 rounded-xl transition-all"
          >
            Start free
          </Link>
        </div>
      )}
    </header>
  );
}
