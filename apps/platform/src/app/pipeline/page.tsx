import type { Metadata } from "next";
import Link from "next/link";
import { jobDisplayValueCents } from "@/lib/job";
import { formatUsd } from "@/lib/money";
import { getSession } from "@/lib/session";
import { STAGE_META, STAGE_ORDER } from "@/lib/stages";
import { getStore } from "@/lib/store";
import type { Contact, Job } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pipeline",
};

interface Card {
  job: Job;
  contact: Contact | undefined;
  valueCents: number | null;
}

export default async function PipelinePage() {
  const { org } = await getSession();
  const store = getStore();
  const byStage = await store.jobsByStage(org.id);

  async function toCards(jobs: Job[]): Promise<Card[]> {
    return Promise.all(
      jobs.map(async (job) => {
        const bundle = await store.getJobBundle(job.id);
        return {
          job,
          contact: bundle?.contact,
          valueCents: bundle ? jobDisplayValueCents(bundle) : null,
        };
      }),
    );
  }

  const columns = await Promise.all(
    STAGE_ORDER.map(async (stage) => ({
      stage,
      cards: await toCards(byStage[stage]),
    })),
  );
  const deadCards = await toCards(byStage.dead);
  const totalJobs = columns.reduce((n, c) => n + c.cards.length, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Pipeline
          </h1>
          <p className="mt-1 text-sm text-muted">
            {org.name} &middot; {totalJobs} active job
            {totalJobs === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/leads/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          New lead
        </Link>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ stage, cards }) => {
          const meta = STAGE_META[stage];
          return (
            <section
              key={stage}
              className="flex w-72 shrink-0 flex-col rounded-xl border border-foreground/10 bg-foreground/[0.02]"
              aria-label={meta.label}
            >
              <header className="flex items-center justify-between gap-2 border-b border-foreground/10 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${meta.dotClass}`}
                    aria-hidden="true"
                  />
                  {meta.label}
                </span>
                <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-muted">
                  {cards.length}
                </span>
              </header>
              <div className="flex flex-1 flex-col gap-2 p-2">
                {cards.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-muted">
                    No jobs
                  </p>
                ) : (
                  cards.map(({ job, contact, valueCents }) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block rounded-lg border border-foreground/10 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {job.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {contact?.name ?? "Unknown contact"}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand-dark">
                          {valueCents === null ? "—" : formatUsd(valueCents)}
                        </span>
                        {job.priority === "high" && (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-700">
                            High
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {deadCards.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-muted">
            Dead ({deadCards.length})
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {deadCards.map(({ job, contact }) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-block rounded-lg border border-foreground/10 bg-white px-3 py-2 text-xs text-muted hover:text-foreground"
                >
                  {job.title} &middot; {contact?.name ?? "Unknown"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
