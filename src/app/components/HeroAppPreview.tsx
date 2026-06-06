"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Wand2 } from "lucide-react";

export default function HeroAppPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto perspective-1000 mt-20 z-20">
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
      >
        {/* Fake Top Bar */}
        <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-700/80" />
          <div className="w-3 h-3 rounded-full bg-slate-700/80" />
          <div className="w-3 h-3 rounded-full bg-slate-700/80" />
          
          <div className="ml-4 px-3 py-1 text-[10px] font-medium text-slate-400 bg-white/5 rounded-md flex items-center gap-2 border border-white/5 mx-auto">
            <Wand2 className="w-3 h-3 text-indigo-400" />
            designmails.com/app/sequence
          </div>
        </div>

        {/* Fake App Content */}
        <div className="flex h-[400px] md:h-[500px]">
          {/* Sidebar */}
          <div className="hidden md:flex w-64 border-r border-white/5 bg-slate-900/40 flex-col p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Emails</div>
            <div className="space-y-1">
              {[
                { title: "Day 0: Welcome", active: true },
                { title: "Day 1: Activation", active: false },
                { title: "Day 3: Social Proof", active: false },
                { title: "Day 5: Check-in", active: false },
                { title: "Day 7: Upgrade", active: false },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`text-sm px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                    item.active ? "bg-indigo-500/10 text-indigo-300 font-medium" : "text-slate-400 hover:bg-white/5"
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${item.active ? "text-indigo-500" : "text-slate-600"}`} />
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Editor Area */}
          <div className="flex-1 bg-slate-950/40 p-6 md:p-10 relative overflow-hidden flex flex-col">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20">
                  Subject
                </span>
                <div className="text-lg font-medium text-slate-200">
                  Welcome to [Your Product] &mdash; Let&apos;s get started.
                </div>
              </div>
              
              <div className="space-y-4 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-6">
                <p>Hi {'{{first_name}}'},</p>
                <p>
                  I&apos;m thrilled to welcome you to the platform. We built this to help you solve [Core Problem], and today is the perfect day to start.
                </p>
                <div className="w-3/4 h-4 bg-slate-800/50 rounded animate-pulse my-4" />
                <div className="w-1/2 h-4 bg-slate-800/50 rounded animate-pulse my-4" />
                
                <div className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-lg">
                  Complete your profile
                </div>
              </div>
            </div>

            {/* Glowing Accent */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
