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
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Designmails
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
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            The AI Onboarding <br className="hidden sm:block" /> Email Builder.
          </h1>

          <p className="mt-8 text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed">
            Stop losing free-trial users. Generate a 7-day onboarding sequence that converts—in 60 seconds.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <Link
              href="/login"
              className="w-full sm:w-auto text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-lg"
            >
              Start building for free
            </Link>
          </div>
          
          {/* Screenshot Placeholder */}
          <div className="mt-20 w-full max-w-5xl aspect-[16/9] bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-center p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="text-center space-y-4">
               <div className="w-20 h-20 mx-auto bg-slate-800 rounded-xl flex items-center justify-center">
                 <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
               </div>
               <span className="text-sm font-medium text-slate-500 block">
                 Dashboard Screenshot Preview
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM/AGITATION */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why founders hate writing onboarding emails
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl transition-colors hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Blank Page Syndrome</h3>
              <p className="text-slate-400 leading-relaxed">
                Staring at a flashing cursor trying to figure out what to say on Day 1, Day 3, and Day 7.
              </p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl transition-colors hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Boring &quot;Welcome&quot; Emails</h3>
              <p className="text-slate-400 leading-relaxed">
                Sending generic &quot;Thanks for signing up&quot; emails that get zero opens and zero clicks.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl transition-colors hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The &quot;Ghost Town&quot; Trial</h3>
              <p className="text-slate-400 leading-relaxed">
                Users sign up, get confused, and never log back in because you didn&apos;t guide them to the &quot;Aha!&quot; moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION / HOW IT WORKS */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How Designmails fixes this in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Tell us about your SaaS</h3>
              <p className="text-slate-400 leading-relaxed">
                Just enter your product name, target audience, and core value proposition.
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Gemini AI generates the sequence</h3>
              <p className="text-slate-400 leading-relaxed">
                Our AI model (Gemini 1.5 Pro) uses proven copywriting frameworks to write 7 emails designed to convert.
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Edit, Polish, and Export</h3>
              <p className="text-slate-400 leading-relaxed">
                Use our notion-style editor to make it yours, then export clean HTML to any ESP (Resend, Mailgun, etc).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE OUTPUT */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What&apos;s inside your 7-day sequence?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { day: 1, title: 'The Welcome & "Aha!" Moment', desc: "Deliver immediate value and get them to take the first critical action in your app." },
              { day: 2, title: 'The Quick Win', desc: "Help them achieve a small success to build momentum and trust." },
              { day: 3, title: 'The Pro-Tip', desc: "Show them a feature they might have missed to deepen their engagement." },
              { day: 4, title: 'The Case Study / Social Proof', desc: "Share a success story to prove your product works for people like them." },
              { day: 5, title: 'The Overcome Objection', desc: "Address the main reason people hesitate to upgrade to a paid plan." },
              { day: 6, title: 'The Transition to Paid', desc: "Make a clear, compelling offer to upgrade their account." },
              { day: 7, title: 'The "Last Chance" / Feedback', desc: "Create urgency or ask for feedback if they haven't upgraded yet." },
            ].map((email, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-slate-700 transition-colors">
                <div className="shrink-0 w-14 h-14 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  Day {email.day}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{email.title}</h3>
                  <p className="text-slate-400">{email.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (BOTTOM) */}
      <section className="py-32 px-6 border-t border-slate-900 bg-indigo-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/50 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-indigo-400 font-semibold tracking-wider uppercase text-sm mb-4">Ready to stop losing users?</p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Build your onboarding sequence today.
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Takes 60 seconds. No credit card required.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/20 transition-all text-lg"
          >
            Generate my emails now
          </Link>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-900 py-12 px-6 bg-slate-950 text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                E
              </div>
              <span className="text-base font-bold text-white block">
                Designmails
              </span>
            </div>
            <span className="text-sm block">
              The AI Onboarding Email Builder
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-600 hidden sm:block">•</span>
            <span>© {new Date().getFullYear()} Designmails. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
