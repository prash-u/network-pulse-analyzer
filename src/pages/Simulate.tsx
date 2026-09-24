import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Orbit, Network, Activity, GitBranch, RotateCcw, FlaskConical } from "lucide-react";

const Simulate = () => {
  const [datasetId, setDatasetId] = useState(datasets[0].id);
  const dataset = getDataset(datasetId) ?? datasets[0];
  const [target, setTarget] = useState(dataset.genes[0].symbol);
  const [applied, setApplied] = useState(false);

  const metrics = useMemo(() => {
    const originalEdges = dataset.edges.length;
    const removedEdges = dataset.edges.filter((e) => e.source === target || e.target === target).length;
    const remaining = originalEdges - removedEdges;
    const degreeLoss = originalEdges ? Math.round((removedEdges / originalEdges) * 100) : 0;
    const affectedPathways = dataset.pathways.filter((p) => p.genes.includes(target)).length;
    const neighbors = new Set<string>();
    dataset.edges.forEach((edge) => {
      if (edge.source === target) neighbors.add(edge.target);
      if (edge.target === target) neighbors.add(edge.source);
    });
    return { originalEdges, removedEdges, remaining, degreeLoss, affectedPathways, neighbors: [...neighbors] };
  }, [dataset, target]);

  const chooseDataset = (id: string) => {
    const next = getDataset(id) ?? datasets[0];
    setDatasetId(id);
    setTarget(next.genes[0].symbol);
    setApplied(false);
  };

  return (
    <AppLayout>
      <div className="px-4 md:px-8 py-8 space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3">counterfactual biology</Badge>
            <h1 className="font-display text-4xl font-semibold">What changes if this node disappears?</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Deterministically recompute local network structure first, then reason about biological consequences second.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={datasetId} onValueChange={chooseDataset}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>{datasets.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={target} onValueChange={(value) => { setTarget(value); setApplied(false); }}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>{dataset.genes.map((g) => <SelectItem key={g.symbol} value={g.symbol}>{g.symbol}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={() => setApplied(true)} className="gap-2"><Orbit className="h-4 w-4" /> Simulate knockout</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          {[
            ["Original edges", metrics.originalEdges, Network],
            ["Edges removed", applied ? metrics.removedEdges : 0, GitBranch],
            ["Connectivity loss", applied ? metrics.degreeLoss + "%" : "0%", Activity],
            ["Pathways touched", applied ? metrics.affectedPathways : 0, FlaskConical],
          ].map(([label, value, Icon]) => (
            <Card key={String(label)}><CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground"><span>{label}</span><Icon className="h-4 w-4 text-primary" /></div>
              <div className="mt-3 text-2xl font-semibold">{value}</div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1fr_1fr] gap-5">
          <Card><CardContent className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Counterfactual target</div>
                <div className="mt-1 text-2xl font-semibold">{target}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setApplied(false)} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset</Button>
            </div>
            <div className="mt-5 rounded-xl border border-border p-5">
              <div className="text-sm font-medium">Immediate graph consequences</div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div>Remaining interactions: <span className="text-foreground">{applied ? metrics.remaining : metrics.originalEdges}</span></div>
                <div>First degree neighbours affected: <span className="text-foreground">{applied ? metrics.neighbors.length : 0}</span></div>
                <div>Pathway memberships touched: <span className="text-foreground">{applied ? metrics.affectedPathways : 0}</span></div>
              </div>
              {applied && metrics.neighbors.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">{metrics.neighbors.map((n) => <Badge key={n} variant="outline">{n}</Badge>)}</div>
              )}
            </div>
          </CardContent></Card>

          <Card><CardContent className="p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Interpretation layer</div>
            {!applied ? (
              <p className="mt-3 text-muted-foreground">Run the knockout to generate a topology grounded interpretation.</p>
            ) : (
              <div className="mt-3 space-y-4">
                <p>
                  Removing <strong>{target}</strong> deletes {metrics.removedEdges} direct interaction{metrics.removedEdges === 1 ? "" : "s"} and changes {metrics.affectedPathways} pathway context{metrics.affectedPathways === 1 ? "" : "s"} in this analytical slice.
                </p>
                <div className="rounded-xl bg-muted/30 p-4">
                  <div className="font-medium">Testable next step</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Prioritise measurements in the affected first degree neighbours before broad phenotyping. If they remain unchanged despite the predicted local collapse, the current interaction model is likely incomplete or context dependent.
                  </p>
                </div>
              </div>
            )}
          </CardContent></Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Simulate;
