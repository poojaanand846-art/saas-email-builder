"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Do I need to know how to write copy?",
    answer: "Not at all. Designmails uses Gemini AI to write the emails based on a simple 2-sentence description of your product. You can tweak the output, but the hard part is done for you.",
  },
  {
    question: "How long does it take?",
    answer: "Less than 60 seconds. You enter your brand name and description, and we instantly generate a complete 7-email onboarding sequence.",
  },
  {
    question: "Can I export the emails to my own email service?",
    answer: "Yes! You can export any email as clean, responsive HTML and paste it directly into Resend, Mailgun, Mailchimp, ConvertKit, or any other ESP.",
  },
  {
    question: "Is there a free trial?",
    answer: "You can generate your first sequence completely for free. You only pay when you need to manage multiple sequences or access premium export features.",
  },
  {
    question: "Are the emails mobile-friendly?",
    answer: "Absolutely. All generated HTML is thoroughly tested to look great on desktop and mobile clients.",
  },
  {
    question: "What if I don't like the generated emails?",
    answer: "You can edit them directly in our visual editor, or simply click 'Regenerate' to get a fresh take from the AI.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            initial={false}
            animate={{
              backgroundColor: isOpen ? "rgba(30, 41, 59, 0.8)" : "rgba(15, 23, 42, 0.5)",
              borderColor: isOpen ? "rgba(99, 102, 241, 0.3)" : "rgba(30, 41, 59, 1)",
            }}
            className="border rounded-2xl overflow-hidden transition-colors duration-200 backdrop-blur-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="text-lg font-semibold text-white pr-8">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300",
                  isOpen
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "border-slate-700 text-slate-400 bg-slate-800/50"
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto", marginBottom: 24 },
                    collapsed: { opacity: 0, height: 0, marginBottom: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                  <div className="px-6 text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
