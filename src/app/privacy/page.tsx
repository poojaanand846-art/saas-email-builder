import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — DesignMails",
  description: "Privacy Policy for DesignMails — AI-powered SaaS onboarding email generator.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300 leading-relaxed">
          <p className="text-lg text-slate-400">
            Last updated: June 2026
          </p>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">Full policy coming soon</h2>
            <p>
              We are currently drafting our comprehensive privacy policy. In the meantime, here&apos;s what you need to know:
            </p>
            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">🔒</span>
                <span>Your data is encrypted in transit and at rest</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">🚫</span>
                <span>We never sell your personal information to third parties</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">📧</span>
                <span>Email content you generate is stored securely and only accessible by you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-400 text-lg shrink-0">🗑️</span>
                <span>You can delete your account and all associated data at any time</span>
              </li>
            </ul>
          </div>

          <p>
            For any privacy-related questions, please contact us at{" "}
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
