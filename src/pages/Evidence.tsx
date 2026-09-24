import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Database, Network, FileSearch, Calculator, GitBranch, Fingerprint, CheckCircle2 } from "lucide-react";

const Evidence = () => {
  const [datasetId, setDatasetId] = useState(datasets[0].id);
  const dataset = getDataset(datasetId) ?? datasets[0];

  const evidence = useMemo(() => {
    const strongest = [...dataset.genes].sort((a, b) => Math.abs(b.log2FC) - Math.abs(a.log2FC))[0];
    const pathway = [...dataset.pathways].sort((a, b) => a.pValue - b.pValue)[0];
    return [
      { id: "E001", type: "Dataset", label: dataset.source, detail: dataset.samples + " samples · " + dataset.genes.length + " genes represented", icon: Database },
      { id: "E002", type: "Calculation", label: strongest.symbol + " is the largest absolute shift", detail: "log2FC " + strongest.log2FC.toFixed(2) + " · adjusted p " + strongest.pAdj.toExponential(2), icon: Calculator },
      { id: "E003", type: "Pathway", label: pathway.name, detail: pathway.source + " · p " + pathway.pValue.toExponential(2) + " · " + pathway.genes.length + " mapped genes", icon: Network },
      { id: "E004", type: "Graph", label: dataset.edges.length + " curated interactions", detail: "Used for degree based hub analysis and counterfactual topology checks", icon: GitBranch },
      { id: "E005", type: "Provenance", label: "Reproducible analytical lineage", detail: "Every claim can point to source object, transformation and derived metric", icon: Fingerprint },
    ];
  }, [dataset]);

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3">evidence graph</Badge>
            <h1 className="font-display text-4xl font-semibold">Every claim gets receipts</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              A provenance first layer inspired by data integrity principles: attributable, traceable, reproducible, reviewable.
            </p>
          </div>
          <Select value={datasetId} onValueChange={setDatasetId}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {datasets.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Claim lineage</h2>
              </div>
              <div className="rounded-xl border border-border p-5 bg-muted/20">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Claim C001</div>
                <div className="mt-2 text-lg font-medium">
                  {dataset.pathways[0]?.name ?? "Lead pathway"} is a priority mechanistic signal in the current analytical slice.
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {evidence.map(({ id, type, label, detail, icon: Icon }) => (
                  <div key={id} className="rounded-xl border border-border p-4 flex gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-primary" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{id}</Badge>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{type}</span>
                      </div>
                      <div className="mt-2 font-medium">{label}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card><CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4"><FileSearch className="h-4 w-4 text-primary" /><h2 className="font-semibold">Data integrity contract</h2></div>
              <div className="space-y-3 text-sm">
                {[
                  ["Attributable", "Know where every object came from."],
                  ["Legible", "Preserve human readable context and units."],
                  ["Contemporaneous", "Record run metadata at execution time."],
                  ["Original", "Retain source inputs and immutable references."],
                  ["Accurate", "Keep deterministic calculations outside free text reasoning."],
                  ["Complete", "Store contradictions and null results, not only supporting evidence."],
                  ["Consistent", "Version prompts, models, transforms and schemas."],
                  ["Enduring", "Export evidence bundles with stable identifiers."],
                  ["Available", "Make review paths accessible from every claim."],
                ].map(([term, desc]) => (
                  <div key={term} className="rounded-lg bg-muted/30 p-3">
                    <div className="font-medium">{term}</div>
                    <div className="text-muted-foreground mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </CardContent></Card>

            <Card><CardContent className="p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Run fingerprint</div>
              <div className="mt-3 font-mono text-sm break-all">npa:v2:{dataset.id}:evidence:deterministic:001</div>
              <p className="mt-3 text-sm text-muted-foreground">
                This demo fingerprint is intentionally transparent. A production backend can replace it with signed run manifests and immutable content hashes.
              </p>
            </CardContent></Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Evidence;
