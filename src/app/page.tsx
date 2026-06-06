import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "./components/Navbar";
import FaqAccordion from "./components/FaqAccordion";
import AnimatedReveal from "./components/AnimatedReveal";
import FeatureCard from "./components/FeatureCard";
import HeroAppPreview from "./components/HeroAppPreview";
import LogoIcon from "./components/LogoIcon";
import { Sparkles, Zap, Shield, Mail, Layout, Eye, ArrowRight, CheckCircle2, Copy } from "lucide-react";

export default async function Home() {
  const supabase = createClient();

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
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden scroll-smooth">
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. HERO */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6 min-h-[90vh] flex flex-col justify-start overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/20 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
          <AnimatedReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium text-xs tracking-wide mb-8 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Powered by Gemini 1.5 AI
            </div>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.2}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-[-0.03em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 max-w-4xl leading-[1.05] mx-auto pb-2">
              SaaS onboarding emails, generated in seconds.
            </h1>
          </AnimatedReveal>

          <AnimatedReveal delay={0.3}>
            <p className="mt-8 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              Describe your product in two sentences. Designmails writes a complete, highly-converting 7-email sequence. No copywriters. No blank pages.
            </p>
          </AnimatedReveal>

          <AnimatedReveal delay={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black hover:bg-slate-200 font-medium rounded-xl transition-all text-base flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                Generate my emails free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 text-white font-medium rounded-xl backdrop-blur-md transition-all text-base"
              >
                See how it works
              </Link>
            </div>
          </AnimatedReveal>
        </div>

        {/* Glossy App Preview */}
        <HeroAppPreview />

      </section>

      {/* 3. PROBLEM */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#0b1121] relative z-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedReveal>
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
                Most SaaS founders launch without onboarding emails. The ones that do, wish they hadn&apos;t waited.
              </h2>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "You launched weeks ago — still no onboarding sequence",
                desc: "Writing 7 emails from scratch takes days. Most founders skip it entirely and wonder why trial users churn.",
                icon: <CheckCircle2 className="w-6 h-6" />
              },
              {
                title: "Hiring a copywriter costs ₹20,000+",
                desc: "And then you still need to brief them, review drafts, and wait a week. For a sequence you should have shipped on day one.",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "Generic templates don't fit your product",
                desc: "Downloading a template and swapping your logo is not onboarding. Your users deserve emails that explain YOUR product.",
                icon: <Copy className="w-6 h-6" />
              }
            ].map((item, idx) => (
              <AnimatedReveal key={idx} delay={idx * 0.1} direction="up">
                <div className="h-full bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 p-8 rounded-3xl transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-6 shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 leading-snug">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 border-t border-white/5 bg-[#0f172a] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedReveal>
            <div className="max-w-3xl mb-24">
              <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl mb-6">
                From blank page to full sequence in 3 steps
              </h2>
              <p className="text-xl text-slate-400 font-light">
                No setup. No learning curve. Just your emails, ready to send.
              </p>
            </div>
          </AnimatedReveal>

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12">
            {[
              {
                step: "01",
                title: "Describe your product",
                desc: "Tell Designmails what your SaaS does in 2–3 sentences. Who it's for, what problem it solves, what makes it different."
              },
              {
                step: "02",
                title: "AI writes your full sequence",
                desc: "Gemini AI generates 7 professionally written onboarding emails — tailored to your product. Subject lines, preview text, and full email body. Done in under 60 seconds."
              },
              {
                step: "03",
                title: "Edit, export, and send",
                desc: "Fine-tune any email in the visual editor. Preview on mobile and desktop. Export clean HTML or push to your ESP with one click."
              }
            ].map((item, idx) => (
              <AnimatedReveal key={idx} delay={idx * 0.2} direction="up" className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative border-l-2 border-slate-800 pl-8 pb-12 md:pb-0 md:border-l-0 md:border-t-2 md:pl-0 md:pt-12">
                  <span className="absolute -left-[11px] top-0 md:-top-[11px] md:left-0 w-5 h-5 rounded-full bg-[#0f172a] border-4 border-indigo-500" />
                  <span className="text-7xl font-black text-slate-800/30 absolute -top-8 left-8 md:left-0 md:-top-24 z-0 select-none transition-colors group-hover:text-indigo-900/30">{item.step}</span>
                  <div className="relative z-10 mt-8 md:mt-4">
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE 7 EMAILS */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#0b1121]">
        <div className="max-w-5xl mx-auto">
          <AnimatedReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-6">
                A complete onboarding sequence
              </h2>
              <p className="text-xl text-slate-400">
                Every email your new users need, from signup to paid.
              </p>
            </div>
          </AnimatedReveal>

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
              <AnimatedReveal key={idx} delay={idx * 0.05} direction="up" className={idx === 6 ? 'md:col-span-2 md:max-w-md md:mx-auto w-full' : ''}>
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 flex items-start gap-5 hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group cursor-default">
                  <div className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                    Day {email.day}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors">{email.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{email.desc}</p>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <AnimatedReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Everything you need. Nothing you don&apos;t.
              </h2>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedReveal delay={0.1}>
              <FeatureCard 
                title="AI-generated copy" 
                description="Powered by Gemini 1.5 Pro to write persuasive, natural-sounding emails that don't feel like a robot wrote them."
                icon={<Sparkles className="w-6 h-6" />}
                className="h-full"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <FeatureCard 
                title="Mobile + desktop preview" 
                description="See exactly what your users will see. Instantly toggle between desktop and mobile previews while you edit."
                icon={<Eye className="w-6 h-6" />}
                className="h-full"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.3}>
              <FeatureCard 
                title="Clean HTML export" 
                description="Export battle-tested, responsive HTML that works perfectly in Gmail, Outlook, Apple Mail, and everywhere else."
                icon={<Layout className="w-6 h-6" />}
                className="h-full"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.4}>
              <FeatureCard 
                title="ESP integrations" 
                description="Push your completed sequences directly to Resend, Mailgun, or Postmark with a single click."
                icon={<Mail className="w-6 h-6" />}
                badge="Coming Soon"
                className="h-full opacity-60 hover:opacity-100"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.5}>
              <FeatureCard 
                title="Visual editor" 
                description="Tweak the AI's copy, change colors, and swap button links in a notion-style rich text editor."
                icon={<Layout className="w-6 h-6" />}
                className="h-full"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.6}>
              <FeatureCard 
                title="Your data stays yours" 
                description="We don't claim ownership of the emails you generate. You own the copy and the HTML forever."
                icon={<Shield className="w-6 h-6" />}
                className="h-full"
              />
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section id="pricing" className="py-32 px-6 border-t border-white/5 bg-[#0b1121]">
        <div className="max-w-5xl mx-auto">
          <AnimatedReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-6">
                Simple pricing. No surprises.
              </h2>
              <p className="text-xl text-slate-400">
                Start free. Upgrade when you&apos;re ready.
              </p>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <AnimatedReveal delay={0.1}>
              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 flex flex-col h-full hover:border-slate-700 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <p className="text-slate-400 mb-8">Perfect for trying it out.</p>
                <div className="mb-10">
                  <span className="text-6xl font-extrabold text-white tracking-tighter">&#8377;0</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {[
                    "1 workspace",
                    "1 onboarding sequence",
                    "Standard HTML export"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="w-full py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-center transition-all text-lg">
                  Get started free
                </Link>
              </div>
            </AnimatedReveal>

            {/* Pro Tier */}
            <AnimatedReveal delay={0.2}>
              <div className="bg-slate-900 border-2 border-indigo-500 rounded-[2rem] p-8 md:p-12 flex flex-col relative h-full shadow-[0_0_50px_rgba(99,102,241,0.15)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/30">
                  Most popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-slate-400 mb-8">For serious SaaS founders.</p>
                <div className="mb-10 flex items-baseline">
                  <span className="text-6xl font-extrabold text-white tracking-tighter">&#8377;999</span>
                  <span className="text-slate-500 font-medium ml-2 text-xl">/mo</span>
                </div>
                <ul className="space-y-5 mb-12 flex-1">
                  {[
                    "Unlimited workspaces",
                    "Unlimited sequences",
                    "1-click ESP push (soon)",
                    "Priority support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="w-full py-4 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-bold text-center shadow-lg transition-all text-lg">
                  Upgrade to Pro
                </Link>
              </div>
            </AnimatedReveal>
          </div>
          
          <AnimatedReveal delay={0.3}>
            <div className="mt-12 text-center text-sm font-medium text-slate-500">
              Cancel anytime &middot; Billed monthly &middot; Prices in INR
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="py-32 px-6 border-t border-white/5 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto">
          <AnimatedReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Questions? Answered.
              </h2>
            </div>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.2}>
            <FaqAccordion />
          </AnimatedReveal>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="py-32 px-6 bg-gradient-to-br from-indigo-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedReveal>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
              Your first onboarding sequence is free.
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100/90 mb-12 max-w-2xl mx-auto font-light">
              Join SaaS founders who stopped guessing and started converting.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-950 hover:bg-slate-50 font-bold rounded-2xl shadow-2xl transition-all text-xl group"
            >
              Generate my emails now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedReveal>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="pt-20 pb-10 px-6 bg-[#0b1121] border-t border-white/5 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 md:col-span-1">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/40 transition-shadow">
                  <LogoIcon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Designmails
                </span>
              </div>
              <p className="text-slate-400 text-base leading-relaxed">
                The AI Onboarding Email Builder for early-stage SaaS.
              </p>
            </div>

            <div className="md:col-start-2">
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Product</h4>
              <ul className="space-y-4 text-base">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
              <ul className="space-y-4 text-base">
                <li><a href="mailto:support@designmails.com" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-4 text-base">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500">
              &copy; {new Date().getFullYear()} Designmails. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
