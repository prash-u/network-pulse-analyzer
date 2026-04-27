import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Network, Sigma, FileText } from "lucide-react";

const sections = [
  {
    icon: Network,
    title: "Network construction",
    body: "Protein–protein interaction subnetworks are seeded from differentially expressed genes and expanded using a curated interaction backbone (STRING / BioGRID style). Edge weights reflect combined confidence scores.",
  },
  {
    icon: Sigma,
    title: "Topology metrics",
    body: "Each node carries a degree centrality score that drives visual size. The layout algorithm minimizes a Coulomb-style repulsion against Hooke-style spring attraction, with edge stiffness scaled by interaction confidence.",
  },
  {
    icon: GitBranch,
    title: "Pathway enrichment",
    body: "Hypergeometric over-representation is reported against KEGG, Reactome, and GO biological process annotations. p-values are Benjamini–Hochberg adjusted across the full term universe of the ontology.",
  },
  {
    icon: FileText,
    title: "Reproducibility",
    body: "Every workspace state is encoded in the URL. Sample datasets are versioned and cited to public repositories (GEO, TCGA) — citations available in each dataset's Info panel.",
  },
];

const Methods = () => {
  return (
    <AppLayout>
      <div className="container py-12 max-w-4xl">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">Methods</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">How the analysis works</h1>
        <p className="mt-3 text-muted-foreground">
          A transparent pipeline so educators, clinicians and industry researchers can trust the output.
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
      </div>
    </AppLayout>
  );
};

export default Methods;
