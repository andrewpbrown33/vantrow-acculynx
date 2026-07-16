import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstimateBuilder } from "@/components/estimate-builder";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New estimate",
};

export default async function NewEstimatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStore();
  const job = await store.getJob(id);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/pipeline" className="hover:text-foreground">
          Pipeline
        </Link>{" "}
        <span aria-hidden="true">/</span>{" "}
        <Link href={`/jobs/${job.id}`} className="hover:text-foreground">
          {job.title}
        </Link>{" "}
        <span aria-hidden="true">/</span> New estimate
      </nav>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-dark">
        Build estimate
      </h1>

      <div className="mt-8">
        <EstimateBuilder jobId={job.id} jobTitle={job.title} />
      </div>
    </div>
  );
}
