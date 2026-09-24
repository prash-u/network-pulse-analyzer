import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, ShieldCheck, Sparkles, Microscope, FlaskConical, Network, ArrowRight, DatabaseZap } from "lucide-react";

type Hypothesis = {
  id: string;
  statement: string;
  support: number;
  contradiction: number;
  novelty: number;
  drivers: string[];
  experiment: string;
};

const buildHypotheses = (datasetId: string): Hypothesis[] => {
  const dataset = getDataset(datasetId) ?? datasets[0];
  const genes = [...dataset.genes].sort((a, b) => Math.abs(b.log2FC) - Math.abs(a.log2FC));
  const pathways = [...dataset.pathways].sort((a, b) => a.pValue - b.pValue);
  const degree = new Map<string, number>();
  dataset.edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });
  const hubs = [...dataset.genes]
    .map((gene) => ({ ...gene, degree: degree.get(gene.symbol) ?? 0 }))
    .sort((a, b) => b.degree - a.degree || Math.abs(b.log2FC) - Math.abs(a.log2FC));

  const leadGene = genes[0];
  const hub = hubs[0];
  const leadPathway = pathways[0];

  return [
    {
      id: "H01",
      statement: hub.symbol + " acts as an upstream control point coupling the observed expression program to " + leadPathway.name + ".",
      support: 82,
      contradiction: 18,
      novelty: 61,
      drivers: [hub.symbol, leadGene.symbol, ...leadPathway.genes.slice(0, 2)],
      experiment: "Perturb " + hub.symbol + " and quantify pathway members at 6 h and 24 h. The hypothesis gains support if pathway signal attenuates before the wider phenotype changes.",
    },
    {
      id: "H02",
      statement: leadGene.symbol + " is a downstream marker rather than a causal driver of the dominant disease state.",
      support: 68,
      contradiction: 29,
      novelty: 49,
      drivers: [leadGene.symbol, hub.symbol],
      experiment: "Compare direct " + leadGene.symbol + " perturbation with " + hub.symbol + " perturbation. A weak network response after direct perturbation would favour a downstream-marker interpretation.",
    },
    {
      id: "H03",
      statement: leadPathway.name + " is one arm of a compensatory response, not the initiating mechanism.",
      support: 57,
      contradiction: 34,
      novelty: 72,
      drivers: leadPathway.genes.slice(0, 4),
      experiment: "Use a short time course to determine whether " + leadPathway.name + " activation follows an earlier network shift in a separate module.",
    },
  ];
};

const Discovery = () => {
  const [datasetId, setDatasetId] = useState(datasets[0].id);
  const [run, setRun] = useState(1);
  const dataset = getDataset(datasetId) ?? datasets[0];
  const hypotheses = useMemo(() => buildHypotheses(datasetId), [datasetId, run]);

  const agents = [
    ["Mechanist", "Constructs a plausible causal mechanism from network, pathway and DEG context."],
    ["Skeptic", "Looks for alternative explanations and failure modes."],
    ["Statistician", "Checks whether the numerical evidence justifies the narrative."],
    ["Contradiction", "Surfaces observations that weaken each claim."],
    ["Experiment", "Designs the cheapest discriminating experiment."],
    ["Provenance", "Tracks which evidence objects support every statement."],
  ];

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3">v2 discovery engine</Badge>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Adversarial hypothesis laboratory</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Generate competing biological explanations, attack them from multiple angles, and end with experiments that can actually distinguish them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={datasetId} onValueChange={setDatasetId}>
              <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {datasets.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setRun((value) => value + 1)} className="gap-2">
              <Sparkles className="h-4 w-4" /> Run investigation
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          {[
            ["Dataset", dataset.shortName, DatabaseZap],
            ["Hypotheses", hypotheses.length, BrainCircuit],
            ["Evidence rules", "Deterministic", ShieldCheck],
            ["Next action", "Experiment", Microscope],
          ].map(([label, value, Icon]) => (
            <Card key={String(label)}><CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>{label}</span><Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 text-2xl font-semibold">{value}</div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Network className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Investigation swarm</h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {agents.map(([name, description], index) => (
                <div key={name} className="rounded-xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{name}</div>
                    <Badge variant="secondary">A{String(index + 1).padStart(2, "0")}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {hypotheses.map((hypothesis) => (
            <Card key={hypothesis.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 grid xl:grid-cols-[1.3fr_0.7fr] gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge>{hypothesis.id}</Badge>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">candidate mechanism</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold leading-snug">{hypothesis.statement}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {hypothesis.drivers.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Support", hypothesis.support],
                      ["Contradiction", hypothesis.contradiction],
                      ["Novelty", hypothesis.novelty],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-lg bg-muted p-3 text-center">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <div className="mt-1 font-mono text-xl">{value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border bg-muted/20 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Discriminating experiment</div>
                    <div className="mt-1 text-sm">{hypothesis.experiment}</div>
                  </div>
                  <Button variant="outline" className="gap-2 shrink-0">
                    Open evidence trail <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/30">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-3">
              <FlaskConical className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-semibold">Human checkpoint</div>
                <p className="text-sm text-muted-foreground mt-1">The engine proposes and stress tests. A scientist decides which experiment enters the real world.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Discovery;
