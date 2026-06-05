import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans relative">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/5 blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              EmailBuilder.ai
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Google Gemini 2.5 Flash
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Create High-Converting Onboarding{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Email Sequences
            </span>{" "}
            in Seconds.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Generate customized 7-day SaaS onboarding email campaigns tailored to
            your product. Boost activation rates and save hours of manual
            writing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <Link
              href="/login"
              className="w-full sm:w-auto text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-base"
            >
              Start Generating for Free
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto text-center px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl transition-all text-base"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="py-24 px-6 border-t border-slate-900 bg-slate-950/50 relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Write, Optimize, and Track Onboarding Emails
            </h2>
            <p className="mt-4 text-slate-400">
              Everything you need to set up product onboarding campaigns that
              engage and convert users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                AI-Powered Copies
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Utilize Google Gemini 2.5 Flash to automatically draft engaging
                copy adapted for your specific onboarding steps, user persona, and
                product tone.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                7-Day Automated Flow
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate a full campaign layout specifying send-delay offsets (Day
                1, Day 3, Day 5, etc.) to prompt actions at high-impact moments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Campaign Dashboards
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track generated email sequences, review copies side-by-side, send
                test emails using Resend Integration, and refine templates in a
                slick timeline layout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="text-sm font-semibold text-slate-300">
              EmailBuilder.ai &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 transition-colors">
              Terms of Service
            </span>
            <a
              href="https://github.com/poojaanand846-art/saas-email-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
