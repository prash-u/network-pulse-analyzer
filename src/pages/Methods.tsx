import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Network, Sigma, FileText } from "lucide-react";

const sections = [
  {
    icon: Network,
    title: "Network assembly",
    body: "Interaction views are seeded from differentially expressed genes and constrained to an illustrative protein-protein interaction backbone. Edge scores create a confidence-weighted picture of how candidate genes cluster into mechanisms.",
  },
  {
    icon: Sigma,
    title: "Topology scoring",
    body: "Node size reflects degree-aware prominence while the force layout balances repulsion, spring attraction, and center bias. The result is optimized for interpretable triage rather than publication-grade graph rendering.",
  },
  {
    icon: GitBranch,
    title: "Pathway prioritization",
    body: "Over-representation outputs are surfaced against KEGG, Reactome, and GO biological process terms. Adjusted p-values and gene overlap help teams move from expression signal to mechanism hypotheses quickly.",
  },
  {
    icon: FileText,
    title: "Traceability",
    body: "Workspace state is URL-addressable, sample cohorts keep public-source attribution, and exported DEG tables preserve the filtered context used to generate the analytical view.",
  },
];

const Methods = () => {
  return (
    <AppLayout>
      <div className="container py-12 max-w-4xl">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">Methods</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">How the analytical layer is structured</h1>
        <p className="mt-3 text-muted-foreground">
          A concise explanation for research teams, translational reviewers, and commercial stakeholders who need to understand what the workspace is actually surfacing.
        </p>

        <div className="mt-10 space-y-4">
          {sections.map((s) => (
            <Card key={s.title} className="border-border/60">
              <CardContent className="p-6 flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border/70 bg-muted/30 p-6">
          <h2 className="font-display text-2xl font-semibold">Data provenance</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Current reference cohorts are sourced from publicly cited transcriptomic studies named in each dataset record, while the pathway layer is expressed through KEGG, Reactome, and GO biological process terminology. The interaction graph is an illustrative curated backbone designed for translational review rather than a claim of exhaustive molecular ground truth.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            For readability and demo control, each built-in cohort currently operates on a compact representative top-15 DEG slice rather than a full transcriptome-wide result table.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border/70 bg-muted/30 p-6">
          <h2 className="font-display text-2xl font-semibold">Interpretation notes</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This product is positioned as a translational exploration surface. It is strong enough for research framing, educational walkthroughs, and commercial storytelling, but any clinically consequential use would still require validated pipelines, governance, and domain-specific review outside the demo layer.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Methods;
