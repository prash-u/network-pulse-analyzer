import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { NetworkGraph } from "@/components/NetworkGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownRight, Search, Download } from "lucide-react";
import { toast } from "sonner";

const Workspace = () => {
  const [params, setParams] = useSearchParams();
  const datasetId = params.get("dataset") ?? datasets[0].id;
  const dataset = getDataset(datasetId) ?? datasets[0];

  const [fcThreshold, setFcThreshold] = useState([1.0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filteredGenes = useMemo(() => {
    return dataset.genes
      .filter((g) => Math.abs(g.log2FC) >= fcThreshold[0])
      .filter((g) => !search || g.symbol.toLowerCase().includes(search.toLowerCase()) || g.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => Math.abs(b.log2FC) - Math.abs(a.log2FC));
  }, [dataset, fcThreshold, search]);

  const visibleSymbols = useMemo(() => new Set(filteredGenes.map((g) => g.symbol)), [filteredGenes]);
  const filteredEdges = useMemo(
    () => dataset.edges.filter((e) => visibleSymbols.has(e.source) && visibleSymbols.has(e.target)),
    [dataset, visibleSymbols]
  );

  const upCount = filteredGenes.filter((g) => g.direction === "up").length;
  const downCount = filteredGenes.length - upCount;

  const exportCSV = () => {
    const rows = [["symbol", "name", "log2FC", "pAdj", "direction"], ...filteredGenes.map((g) => [g.symbol, g.name, g.log2FC, g.pAdj, g.direction])];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataset.id}-degs.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported DEG table");
  };

  return (
    <AppLayout>
      <div className="border-b border-border bg-muted/30">
        <div className="px-4 md:px-8 py-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/datasets" className="hover:text-foreground">Datasets</Link>
              <span>/</span>
              <span>{dataset.category}</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-semibold flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: `hsl(${dataset.color})`, boxShadow: `0 0 12px hsl(${dataset.color} / 0.6)` }}
              />
              {dataset.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-mono">{dataset.source} · n={dataset.samples}</p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Translational view of the cohort: inspect network hubs, differential-expression balance, and pathway candidates from one interactive surface.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dataset.id} onValueChange={(v) => setParams({ dataset: v })}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {datasets.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.shortName} — {d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1.5" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "DEGs shown", value: filteredGenes.length, hint: `of ${dataset.genes.length} total` },
          { label: "Upregulated", value: upCount, hint: "log2FC ≥ 0", color: "text-primary" },
          { label: "Downregulated", value: downCount, hint: "log2FC < 0", color: "text-magenta" },
          { label: "Interactions", value: filteredEdges.length, hint: "PPI edges in view" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              <div className={`mt-1 font-display text-3xl font-semibold ${s.color ?? ""}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="px-4 md:px-8 pb-10 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4">
        <Card className="border-border/60 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
              <div>
                <h2 className="font-display text-lg font-semibold">Interaction network</h2>
                <p className="text-xs text-muted-foreground">Filter by absolute log2 fold change, then inspect hubs and local neighbourhood structure.</p>
              </div>
              <div className="flex items-center gap-3 min-w-[260px]">
                <span className="text-xs text-muted-foreground whitespace-nowrap">|log2FC| ≥ {fcThreshold[0].toFixed(1)}</span>
                <Slider value={fcThreshold} onValueChange={setFcThreshold} min={0} max={3.5} step={0.1} className="flex-1" />
              </div>
            </div>
            <div className="h-[560px]">
              <NetworkGraph
                genes={filteredGenes}
                edges={filteredEdges}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-0">
            <Tabs defaultValue="genes" className="w-full">
              <TabsList className="w-full rounded-none border-b border-border bg-transparent justify-start h-auto p-0">
                <TabsTrigger value="genes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Genes</TabsTrigger>
                <TabsTrigger value="pathways" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Pathways</TabsTrigger>
                <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Info</TabsTrigger>
              </TabsList>

              <TabsContent value="genes" className="m-0 p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gene symbol or name…" className="pl-8 h-9" />
                </div>
                <div className="max-h-[520px] overflow-auto -mx-4">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background/95 backdrop-blur border-b border-border">
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Gene</th>
                        <th className="px-2 py-2 font-medium text-right">log2FC</th>
                        <th className="px-4 py-2 font-medium text-right">p.adj</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGenes.map((g) => (
                        <tr
                          key={g.symbol}
                          className={`border-b border-border/40 cursor-pointer transition-smooth hover:bg-muted/50 ${selected === g.symbol ? "bg-primary/5" : ""}`}
                          onClick={() => setSelected(selected === g.symbol ? null : g.symbol)}
                        >
                          <td className="px-4 py-2">
                            <div className="font-mono font-semibold">{g.symbol}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[180px]">{g.name}</div>
                          </td>
                          <td className="px-2 py-2 text-right font-mono">
                            <span className={`inline-flex items-center gap-0.5 ${g.direction === "up" ? "text-primary" : "text-magenta"}`}>
                              {g.direction === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {g.log2FC.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-mono text-xs text-muted-foreground">
                            {g.pAdj.toExponential(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredGenes.length === 0 && (
                    <div className="p-8 text-center text-sm text-muted-foreground">No genes match your filters.</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pathways" className="m-0 p-4 space-y-3 max-h-[600px] overflow-auto">
                {dataset.pathways.map((p) => {
                  const overlap = p.genes.filter((g) => visibleSymbols.has(g));
                  return (
                    <div key={p.name} className="rounded-md border border-border p-3 transition-smooth hover:border-primary/40">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-medium text-sm">{p.name}</h4>
                          <Badge variant="secondary" className="mt-1 text-[10px] font-mono">{p.source}</Badge>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-mono text-primary">{p.pValue.toExponential(1)}</div>
                          <div className="text-muted-foreground">p-value</div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.genes.map((g) => (
                          <button
                            key={g}
                            onClick={() => setSelected(g)}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-smooth ${
                              overlap.includes(g)
                                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {overlap.length} / {p.genes.length} genes in view
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="info" className="m-0 p-4 space-y-4 text-sm">
                <p className="text-muted-foreground">{dataset.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Source</div>
                    <div className="font-mono text-sm mt-1">{dataset.source}</div>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Samples</div>
                    <div className="font-mono text-sm mt-1">n = {dataset.samples}</div>
                  </div>
                </div>
                <div className="rounded-md border border-border/60 p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Translational fit</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Suitable for research demonstration, translational discussion, and commercial storytelling around pathway prioritization, disease mechanism, and candidate target framing.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sample data is curated for demonstration purposes. Connect your own counts matrix
                  to run reproducible analyses.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Workspace;
