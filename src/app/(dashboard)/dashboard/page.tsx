import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TEMPLATES } from "@/lib/templates";

export default async function DashboardPage() {
  const supabase = createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Retrieve user's workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("brand_name")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  // Retrieve email sequences with nested emails count
  const { data: sequences } = await supabase
    .from("sequences")
    .select(`
      id,
      name,
      status,
      tone,
      created_at,
      emails (id)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Server Action for signing out
  async function handleSignOut() {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  const brandName = workspace?.brand_name || "SaaS";
  const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "there";

  const featuredTemplates = TEMPLATES.filter(t => 
    ["SaaS Onboarding Classic", "Trial to Paid", "Win-back Campaign"].includes(t.name)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {brandName} Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and monitor your automated onboarding email campaigns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="hidden sm:flex px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white font-medium text-sm transition-all items-center gap-2"
          >
            Browse templates
          </Link>
          <Link
            href="/generate"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-indigo-950 font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New</span>
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white font-medium text-sm transition-all"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Grid / Content */}
      {!sequences || sequences.length === 0 ? (
        
        /* Empty State */
        <div className="space-y-8 animate-fade-in pt-4 relative z-10">
          <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome to Designmails, <span className="capitalize">{firstName}</span>
              </h2>
              <p className="text-neutral-400 mt-2 text-sm">
                Start with one of these popular templates — or build your own from scratch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex flex-col hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group"
              >
                <div className="flex flex-col flex-1 space-y-4">
                  <h3 className="font-semibold text-white text-base leading-tight">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white">
                      {template.goal}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                      {template.emailCount} emails
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-auto overflow-x-auto scrollbar-hide">
                    <div className="flex items-center py-1">
                      {template.emails.map((email, idx) => {
                        const colors = ["bg-blue-500/10 text-blue-400 border-blue-500/20", "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "bg-purple-500/10 text-purple-400 border-purple-500/20"];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <div key={idx} className="flex items-center">
                            <span className={`text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-full border ${colorClass}`}>
                              Day {email.dayOffset}
                            </span>
                            {idx < template.emails.length - 1 && (
                              <span className="text-slate-600 mx-2 font-bold">·</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="pt-5 mt-5 border-t border-white/5">
                  <Link
                    href={`/generate?template=${template.id}`}
                    className="block w-full px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-medium text-sm text-center transition-colors border border-indigo-500/30 hover:border-indigo-500"
                  >
                    Use template
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/5">
            <Link href="/templates" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
              Want more options?
            </Link>
            <span className="text-neutral-600">•</span>
            <Link href="/generate" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
              Start from scratch
            </Link>
          </div>
        </div>
      ) : (
        
        /* Sequences List Grid */
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            My Sequences ({sequences.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sequences.map((seq) => {
              const emailCount = seq.emails?.length || 0;
              const formattedDate = new Date(seq.created_at).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              );

              return (
                <div
                  key={seq.id}
                  className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:bg-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-white group-hover:text-neutral-300 transition-colors line-clamp-1 text-sm">
                        {seq.name}
                      </h3>
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                          seq.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/5 text-neutral-400"
                        }`}
                      >
                        {seq.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span className="capitalize">{seq.tone} Tone</span>
                      <span>•</span>
                      <span>{emailCount} emails</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {formattedDate}
                    </span>
                    <Link
                      href={`/sequences/${seq.id}`}
                      className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
