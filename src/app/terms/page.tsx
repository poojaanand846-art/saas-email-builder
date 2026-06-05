import Link from "next/link";

export const metadata = {
  title: "Terms of Service — DesignMails",
  description: "Terms of Service for DesignMails — AI-powered SaaS onboarding email generator.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            DesignMails
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-6">
          Terms of Service
        </h1>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p className="text-lg text-slate-400">
            Last updated: June 2026
          </p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">Full terms coming soon</h2>
            <p>
              We are currently finalising our comprehensive terms of service. Here are the key points:
            </p>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">✅</span>
                <span>You own all email content generated through our platform</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">✅</span>
                <span>Free tier includes generating email sequences with HTML export</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">✅</span>
                <span>We use Google Gemini AI to generate content — standard AI usage policies apply</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">⚠️</span>
                <span>Do not use the platform to generate spam, phishing, or harmful content</span>
              </li>
            </ul>
          </div>

          <p>
            For any questions about our terms, please contact us at{" "}
            <a
              href="mailto:hello@designmails.com"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors"
            >
              hello@designmails.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-300 transition-colors">
          ← Back to DesignMails
        </Link>
      </footer>
    </div>
  );
}
