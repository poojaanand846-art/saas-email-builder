"use client";

import React, { useState } from "react";

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
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-slate-800 bg-[#0f172a]/50 rounded-2xl overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
          >
            <span className="text-lg font-semibold text-white pr-8">
              {faq.question}
            </span>
            <div className={`shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-[#6366f1]/10 border-[#6366f1]/30 text-[#6366f1]" : ""}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          <div
            className={`transition-all duration-300 ease-in-out ${
              openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 pt-0 text-slate-400 leading-relaxed">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
