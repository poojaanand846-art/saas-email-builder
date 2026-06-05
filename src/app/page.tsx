import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "./components/Navbar";
import FaqAccordion from "./components/FaqAccordion";

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
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-[#6366f1]/30 selection:text-indigo-200 overflow-x-hidden scroll-smooth">
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 px-6">
        {/* Background Decorative Gradients */}
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <span className="text-[#6366f1] font-semibold text-sm uppercase tracking-wider mb-6 block">
            Onboarding emails powered by Gemini AI
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Your SaaS onboarding emails &mdash; written in 60 seconds.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
            Describe your product. Designmails generates a complete 7-email onboarding sequence &mdash; welcome, activation, social proof, and more. Edit it, export it, send it. No copywriter. No blank page.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link
              href="/login"
              className="w-full sm:w-auto text-center px-8 py-4 bg-[#6366f1] hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-lg"
            >
              Generate my emails free
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto text-center px-8 py-4 bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold rounded-xl transition-all text-lg"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Free to start &middot; No credit card required
          </p>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Trusted by early-stage SaaS founders
            </span>
            <span className="hidden md:inline text-slate-700">&bull;</span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Powered by Google Gemini AI
            </span>
            <span className="hidden md:inline text-slate-700">&bull;</span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Export to any ESP
            </span>
          </div>

          {/* Screenshot Placeholder */}
          <div className="mt-20 w-full max-w-5xl aspect-[16/9] bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center p-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/10 to-transparent pointer-events-none" />
            <div className="text-center space-y-4">
               <div className="w-20 h-20 mx-auto bg-slate-900 rounded-xl flex items-center justify-center">
                 <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
               </div>
               <span className="text-sm font-medium text-slate-500 block">
                 Dashboard Screenshot Placeholder
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM */}
      <section className="py-24 px-6 border-t border-slate-900 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              Most SaaS founders launch without onboarding emails. The ones that do, wish they hadn&apos;t waited.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">You launched weeks ago &mdash; still no onboarding sequence</h3>
              <p className="text-slate-400 leading-relaxed">
                Writing 7 emails from scratch takes days. Most founders skip it entirely and wonder why trial users churn.
              </p>
            </div>
            
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hiring a copywriter costs ₹20,000+</h3>
              <p className="text-slate-400 leading-relaxed">
                And then you still need to brief them, review drafts, and wait a week. For a sequence you should have shipped on day one.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generic templates don&apos;t fit your product</h3>
              <p className="text-slate-400 leading-relaxed">
                Downloading a template and swapping your logo is not onboarding. Your users deserve emails that explain YOUR product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              From blank page to full sequence in 3 steps
            </h2>
            <p className="text-xl text-slate-400">
              No setup. No learning curve. Just your emails, ready to send.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 relative">
              <span className="text-6xl font-black text-slate-800/50 absolute -top-8 -left-4 z-0 select-none">01</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Describe your product</h3>
                <p className="text-slate-400 leading-relaxed">
                  Tell Designmails what your SaaS does in 2&ndash;3 sentences. Who it&apos;s for, what problem it solves, what makes it different.
                </p>
              </div>
            </div>

            <div className="space-y-6 relative">
              <span className="text-6xl font-black text-slate-800/50 absolute -top-8 -left-4 z-0 select-none">02</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">AI writes your full sequence</h3>
                <p className="text-slate-400 leading-relaxed">
                  Gemini AI generates 7 professionally written onboarding emails &mdash; tailored to your product. Subject lines, preview text, and full email body. Done in under 60 seconds.
                </p>
              </div>
            </div>

            <div className="space-y-6 relative">
              <span className="text-6xl font-black text-slate-800/50 absolute -top-8 -left-4 z-0 select-none">03</span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Edit, export, and send</h3>
                <p className="text-slate-400 leading-relaxed">
                  Fine-tune any email in the visual editor. Preview on mobile and desktop. Export clean HTML or push to your ESP with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 7 EMAILS */}
      <section className="py-24 px-6 border-t border-slate-900 bg-[#0f172a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              A complete onboarding sequence &mdash; not just one welcome email
            </h2>
            <p className="text-xl text-slate-400">
              Every email your new users need, from signup to paid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { day: 0, title: 'Welcome', desc: "Deliver immediate value and get them to take the first critical action in your app." },
              { day: 1, title: 'Key Feature', desc: "Help them achieve a small success to build momentum and trust." },
              { day: 3, title: 'Social Proof', desc: "Share a success story to prove your product works for people like them." },
              { day: 5, title: 'Check-in', desc: "Show them a feature they might have missed to deepen their engagement." },
              { day: 7, title: 'Upgrade Nudge', desc: "Address the main reason people hesitate to upgrade to a paid plan." },
              { day: 14, title: 'Win-back', desc: "Make a clear, compelling offer to upgrade their account or return to the app." },
              { day: 30, title: 'Final', desc: "Create urgency or ask for feedback if they haven't upgraded yet." },
            ].map((email, idx) => (
              <div key={idx} className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-slate-700 transition-colors ${idx === 6 ? 'md:col-span-2 md:max-w-md md:mx-auto w-full' : ''}`}>
                <div className="shrink-0 px-4 py-2 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] font-bold text-sm">
                  Day {email.day}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{email.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{email.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI-generated copy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Powered by Gemini 1.5 Pro to write persuasive, natural-sounding emails that don&apos;t feel like a robot wrote them.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mobile + desktop preview</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                See exactly what your users will see. Instantly toggle between desktop and mobile previews while you edit.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clean HTML export</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Export battle-tested, responsive HTML that works perfectly in Gmail, Outlook, Apple Mail, and everywhere else.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-slate-800 text-xs font-bold px-2 py-1 rounded text-slate-400 uppercase tracking-wider">Coming soon</div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5 opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 opacity-50">ESP integrations</h3>
              <p className="text-slate-400 text-sm leading-relaxed opacity-50">
                Push your completed sequences directly to Resend, Mailgun, or Postmark with a single click.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visual editor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tweak the AI&apos;s copy, change colors, and swap button links in a notion-style rich text editor.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your data stays yours</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We don&apos;t claim ownership of the emails you generate. You own the copy and the HTML forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-900 bg-[#0f172a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-4">
              Simple pricing. No surprises.
            </h2>
            <p className="text-xl text-slate-400">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-10 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-slate-400 mb-6">Perfect for trying it out.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">&#8377;0</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>1 workspace</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>1 onboarding sequence</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Standard HTML export</span>
                </li>
              </ul>
              <Link href="/login" className="w-full py-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-center transition-all">
                Get started free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900 border-2 border-[#6366f1] rounded-3xl p-8 md:p-10 flex flex-col relative shadow-2xl shadow-indigo-900/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366f1] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 mb-6">For serious SaaS founders.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">&#8377;999</span>
                <span className="text-slate-500 font-medium ml-2">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Unlimited workspaces</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Unlimited sequences</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>1-click ESP push (soon)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/login" className="w-full py-4 rounded-xl bg-[#6366f1] hover:bg-indigo-500 text-white font-bold text-center shadow-lg shadow-indigo-600/20 transition-all">
                Upgrade to Pro
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Cancel anytime &middot; Billed monthly &middot; Prices in INR
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Questions? Answered.
            </h2>
          </div>
          
          <FaqAccordion />
          
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="py-24 px-6 bg-[#6366f1] relative overflow-hidden">
        {/* Subtle pattern or glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Your first onboarding sequence is free.
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join SaaS founders who stopped guessing and started converting.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-5 bg-white text-[#6366f1] hover:bg-slate-50 font-bold rounded-xl shadow-2xl transition-all text-lg"
          >
            Generate my emails now
          </Link>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="pt-16 pb-8 px-6 bg-[#0f172a] border-t border-slate-900 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded bg-[#6366f1] flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Designmails
                </span>
              </div>
              <p className="text-slate-400">
                The AI Onboarding Email Builder for early-stage SaaS.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Product</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              {/* Empty 4th column as requested */}
            </div>
            
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>
              &copy; {new Date().getFullYear()} Designmails. Made with ❤️ in India. Built for SaaS founders who ship fast.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
