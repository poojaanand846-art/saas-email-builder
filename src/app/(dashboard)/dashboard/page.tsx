import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-900">
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
            href="/generate"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Sequence</span>
          </Link>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-sm transition-all"
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      {/* Main Grid / Content */}
      {!sequences || sequences.length === 0 ? (
        
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a2 2 0 00-2-2H2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">No email sequences generated</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Create an onboarding sequence customized for your SaaS brand using Claude AI.
          </p>
          <Link
            href="/generate"
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/10 transition-all"
          >
            Generate your first sequence
          </Link>
        </div>
      ) : (
        
        /* Sequences List Grid */
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Your Sequences ({sequences.length})
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
                  className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800/80 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {seq.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          seq.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border border-slate-700/50"
                        }`}
                      >
                        {seq.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="capitalize">{seq.tone} Tone</span>
                      <span className="text-slate-600">•</span>
                      <span>{emailCount} emails</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-950/60">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Created {formattedDate}
                    </span>
                    <Link
                      href={`/sequences/${seq.id}`}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>View Sequence</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
