import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ExportButton from "./ExportButton";

export default async function SequenceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Retrieve email sequence and verify ownership
  const { data: sequence } = await supabase
    .from("sequences")
    .select(`
      id,
      name,
      status,
      tone,
      created_at
    `)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sequence) {
    notFound();
  }

  // Retrieve email steps sorted by position
  const { data: emails } = await supabase
    .from("emails")
    .select("id, day_offset, subject, preview_text, position")
    .eq("sequence_id", params.id)
    .order("position", { ascending: true });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Navigation Header */}
      <div className="space-y-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to dashboard</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-900">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {sequence.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                {sequence.tone} Tone
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 capitalize">
                {sequence.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExportButton
              sequenceId={sequence.id}
              sequenceName={sequence.name}
              emailsCount={emails?.length || 0}
            />
          </div>
        </div>
      </div>

      {/* Emails Timeline List */}
      <div className="space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email Sequence Timeline ({emails?.length || 0} Steps)
        </h2>

        {!emails || emails.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/20 border border-slate-900 rounded-2xl">
            <p className="text-sm text-slate-400">No email steps found for this sequence.</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-[2px] before:bg-slate-900 before:pointer-events-none">
            {emails.map((email, idx) => {
              // Custom text names matching typical SaaS campaign stages
              const stages = [
                "Welcome Email",
                "Key Feature Highlight",
                "Social Proof / Trust",
                "Check-in / Personal Reachout",
                "Upgrade Nudge / Offer",
                "Win-back / Retention",
                "Final Call to Action"
              ];
              const stageName = stages[idx] || `Step ${idx + 1}`;

              return (
                <div key={email.id} className="relative pl-12 group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-6 rounded-2xl transition-all duration-300">
                  
                  {/* Timeline Node Badge */}
                  <div className="absolute left-4 top-[26px] w-8 h-8 rounded-full bg-slate-950 border-2 border-indigo-600 flex items-center justify-center text-xs font-bold text-indigo-400 z-10 shadow-lg shadow-indigo-600/5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {email.day_offset}
                  </div>

                  {/* Email Content Details */}
                  <div className="space-y-2 max-w-2xl flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        Day {email.day_offset}
                      </span>
                      <span className="text-slate-700">•</span>
                      <span className="text-xs font-semibold text-slate-400">
                        {stageName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                      {email.subject}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {email.preview_text || "No preview text configured."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      href={`/sequences/${sequence.id}/emails/${email.id}/edit`}
                      className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Email</span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
