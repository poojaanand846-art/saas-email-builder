import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();

  // Try to retrieve user session to redirect to dashboard if logged in
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // Session fetching failed or not available during build. Let it render.
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* 1. NAVBAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-white">
              EmailBuilder.ai
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-6">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Your SaaS onboarding emails — written by AI in 60 seconds
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Describe your product. Get 7 professional onboarding emails instantly.
            Edit, export, and send — no copywriter needed.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <Link
              href="/login"
              className="w-full sm:w-auto text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-base"
            >
              Generate my emails free
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-center px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl transition-all text-base"
            >
              See how it works
            </a>
          </div>

          {/* Screenshot Placeholder */}
          <div className="mt-16 w-full max-w-4xl aspect-[16/9] bg-slate-900/50 border border-slate-900 rounded-2xl flex items-center justify-center p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="text-center space-y-2">
              <svg
                className="w-12 h-12 text-slate-700 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-slate-500 block">
                Dashboard Screenshot Preview
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-24 px-6 border-t border-slate-900 bg-slate-950/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-slate-400">
              Set up your onboarding campaign in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Describe your SaaS</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tell us what your product does in 2-3 sentences
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">AI writes your emails</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get a complete 7-email onboarding sequence in under 60 seconds
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Edit and export</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Customise any email, then download HTML or push to Mailchimp, Brevo
                and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU GET */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What you get
            </h2>
          </div>

          <ul className="space-y-6 bg-slate-900/40 border border-slate-900 rounded-2xl p-8 md:p-10">
            <li className="flex items-start gap-4 text-base md:text-lg">
              <span className="text-indigo-400 shrink-0 text-xl">✅</span>
              <span className="text-slate-200">
                7 professionally written onboarding emails
              </span>
            </li>
            <li className="flex items-start gap-4 text-base md:text-lg">
              <span className="text-indigo-400 shrink-0 text-xl">✅</span>
              <span className="text-slate-200">
                Welcome, feature discovery, social proof, check-in, upgrade
                nudge, win-back, final
              </span>
            </li>
            <li className="flex items-start gap-4 text-base md:text-lg">
              <span className="text-indigo-400 shrink-0 text-xl">✅</span>
              <span className="text-slate-200">
                Clean HTML export — paste into any ESP
              </span>
            </li>
            <li className="flex items-start gap-4 text-base md:text-lg">
              <span className="text-indigo-400 shrink-0 text-xl">✅</span>
              <span className="text-slate-200">
                AI-powered — not generic templates
              </span>
            </li>
            <li className="flex items-start gap-4 text-base md:text-lg">
              <span className="text-indigo-400 shrink-0 text-xl">✅</span>
              <span className="text-slate-200">
                Built for SaaS founders, not marketers
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-800 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white">Free</h3>
                <p className="mt-2 text-slate-400 text-sm">
                  Great for trying out the generator.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                </div>
                <p className="mt-6 text-slate-300 text-sm leading-relaxed">
                  Try free — Generate 1 sequence, export HTML, no credit card
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="block text-center w-full py-3 px-4 rounded-xl border border-slate-800 hover:bg-slate-900 text-white font-medium text-sm transition-all"
                >
                  Get started
                </Link>
              </div>
            </div>

            {/* Pro Card */}
            <div className="bg-slate-900/60 border-2 border-indigo-500 rounded-2xl p-8 flex flex-col justify-between relative shadow-xl shadow-indigo-500/5 hover:border-indigo-400 transition-all">
              <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <p className="mt-2 text-slate-400 text-sm">
                  Perfect for active SaaS builders.
                </p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">
                    ₹999
                  </span>
                  <span className="text-slate-400 text-sm font-semibold ml-2">
                    / month
                  </span>
                </div>
                <p className="mt-6 text-slate-300 text-sm leading-relaxed">
                  Unlimited sequences, priority generation, ESP integrations
                  coming soon
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="block text-center w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950 text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-base font-bold text-white block">
              EmailBuilder.ai
            </span>
            <span className="text-sm block">
              Write SaaS onboarding email sequences with AI
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-slate-600">•</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
