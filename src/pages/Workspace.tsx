import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset, type Disorder } from "@/data/datasets";
import { NetworkGraph } from "@/components/NetworkGraph";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, ArrowDownRight, Search, Download, CircleGauge, Sparkles, Radar, Workflow, FileText, GitFork, ListFilter, ExternalLink, Presentation, Printer } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getCustomCohort, listCustomCohorts } from "@/lib/customCohorts";

const inferSourceUrl = (dataset: Disorder) => {
  if (dataset.sourceUrl) return dataset.sourceUrl;
  if (dataset.source.startsWith("GSE")) {
    const accession = dataset.source.split(" ")[0];
    return `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`;
  }
  if (dataset.source.startsWith("TCGA")) {
    return "https://portal.gdc.cancer.gov/";
  }
  return undefined;
};

const getGeneEvidenceUrl = (symbol: string) => `https://www.ncbi.nlm.nih.gov/gene/?term=${encodeURIComponent(symbol)}`;

const getPathwayEvidenceUrl = (pathwayName: string, source: string) => {
  if (source === "KEGG") return `https://www.genome.jp/dbget-bin/www_bfind?keywords=${encodeURIComponent(pathwayName)}`;
  if (source === "Reactome") return `https://reactome.org/content/query?q=${encodeURIComponent(pathwayName)}`;
  return `https://geneontology.org/search?query=${encodeURIComponent(pathwayName)}`;
};

const Workspace = () => {
  const DEMO_GENE_CAP = 15;
  const [params, setParams] = useSearchParams();
  const datasetId = params.get("dataset") ?? datasets[0].id;
  const allDatasets = useMemo(() => [...datasets, ...listCustomCohorts()], []);
  const dataset = useMemo(() => {
    if (datasetId.startsWith("custom:")) return getCustomCohort(datasetId) ?? datasets[0];
    return getDataset(datasetId) ?? datasets[0];
  }, [datasetId]);

  const [fcThreshold, setFcThreshold] = useState([1.0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string>(datasets[1]?.id ?? datasets[0].id);
  const [focusedPathwayName, setFocusedPathwayName] = useState<string>("lead");

  const compareDataset = useMemo(() => {
    if (!compareId || compareId === dataset.id) return null;
    if (compareId.startsWith("custom:")) return getCustomCohort(compareId);
    return getDataset(compareId) ?? null;
  }, [compareId, dataset.id]);

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

  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredEdges.forEach((edge) => {
      map.set(edge.source, (map.get(edge.source) ?? 0) + 1);
      map.set(edge.target, (map.get(edge.target) ?? 0) + 1);
    });
    return map;
  }, [filteredEdges]);

  const topHubGenes = useMemo(() => {
    return filteredGenes
      .map((gene) => ({ ...gene, degree: degreeMap.get(gene.symbol) ?? 0 }))
      .sort((a, b) => {
        if (b.degree !== a.degree) return b.degree - a.degree;
        return Math.abs(b.log2FC) - Math.abs(a.log2FC);
      })
      .slice(0, 4);
  }, [filteredGenes, degreeMap]);

  const topShiftGenes = useMemo(() => filteredGenes.slice(0, 4), [filteredGenes]);

  const leadPathway = useMemo(() => {
    return [...dataset.pathways]
      .map((pathway) => ({
        ...pathway,
        visibleCount: pathway.genes.filter((gene) => visibleSymbols.has(gene)).length,
      }))
      .sort((a, b) => {
        if (a.pValue !== b.pValue) return a.pValue - b.pValue;
        return b.visibleCount - a.visibleCount;
      })[0];
  }, [dataset.pathways, visibleSymbols]);

  const networkCoverage = dataset.genes.length
    ? Math.round((filteredGenes.length / dataset.genes.length) * 100)
    : 0;
  const pathwayCoverage = leadPathway
    ? `${leadPathway.visibleCount}/${leadPathway.genes.length}`
    : "0/0";
  const meanEdgeScore = filteredEdges.length
    ? filteredEdges.reduce((sum, edge) => sum + edge.score, 0) / filteredEdges.length
    : 0;

  const selectedGene = useMemo(
    () => filteredGenes.find((gene) => gene.symbol === selected) ?? null,
    [filteredGenes, selected]
  );

  const selectedGenePathways = useMemo(() => {
    if (!selectedGene) return [];
    return dataset.pathways.filter((pathway) => pathway.genes.includes(selectedGene.symbol));
  }, [dataset.pathways, selectedGene]);

  const selectedGeneNeighbors = useMemo(() => {
    if (!selectedGene) return [];
    const neighborSymbols = new Set<string>();
    filteredEdges.forEach((edge) => {
      if (edge.source === selectedGene.symbol) neighborSymbols.add(edge.target);
      if (edge.target === selectedGene.symbol) neighborSymbols.add(edge.source);
    });

    return filteredGenes
      .filter((gene) => neighborSymbols.has(gene.symbol))
      .map((gene) => ({
        ...gene,
        degree: degreeMap.get(gene.symbol) ?? 0,
      }))
      .sort((a, b) => {
        if ((b.degree ?? 0) !== (a.degree ?? 0)) return (b.degree ?? 0) - (a.degree ?? 0);
        return Math.abs(b.log2FC) - Math.abs(a.log2FC);
      });
  }, [degreeMap, filteredEdges, filteredGenes, selectedGene]);

  const comparisonMetrics = useMemo(() => {
    if (!compareDataset) return [];
    return [
      { metric: "Samples", active: dataset.samples, compare: compareDataset.samples },
      { metric: "DEGs", active: dataset.genes.length, compare: compareDataset.genes.length },
      { metric: "Edges", active: dataset.edges.length, compare: compareDataset.edges.length },
      { metric: "Pathways", active: dataset.pathways.length, compare: compareDataset.pathways.length },
    ];
  }, [compareDataset, dataset]);

  const compareTopPathway = useMemo(() => {
    if (!compareDataset) return null;
    return [...compareDataset.pathways].sort((a, b) => a.pValue - b.pValue)[0] ?? null;
  }, [compareDataset]);

  const balanceChartData = useMemo(() => {
    if (!compareDataset) return [];
    const compareUp = compareDataset.genes.filter((gene) => gene.direction === "up").length;
    const compareDown = compareDataset.genes.length - compareUp;
    return [
      { label: "Up", active: upCount, compare: compareUp },
      { label: "Down", active: downCount, compare: compareDown },
    ];
  }, [compareDataset, downCount, upCount]);

  const pathwayStrengthData = useMemo(() => {
    const activeScore = leadPathway ? -Math.log10(leadPathway.pValue) : 0;
    const compareScore = compareTopPathway ? -Math.log10(compareTopPathway.pValue) : 0;
    return compareDataset
      ? [
          {
            label: dataset.shortName,
            score: Number(activeScore.toFixed(2)),
            fill: "var(--color-active)",
          },
          {
            label: compareDataset.shortName,
            score: Number(compareScore.toFixed(2)),
            fill: "var(--color-compare)",
          },
        ]
      : [];
  }, [compareDataset, compareTopPathway, dataset.shortName, leadPathway]);

  const analystConclusion = useMemo(() => {
    const strongestGene = topShiftGenes[0];
    const hubGene = topHubGenes[0];
    if (!strongestGene || !hubGene || !leadPathway) {
      return "The current filter leaves too little active signal to generate a meaningful readout.";
    }

    return `${dataset.name} is currently dominated by ${strongestGene.symbol} as the strongest expression shift and ${hubGene.symbol} as the principal hub, with ${leadPathway.name} acting as the lead mechanistic pathway in view.`;
  }, [dataset.name, leadPathway, topHubGenes, topShiftGenes]);

  const analystFrame = useMemo(() => {
    return [
      ["Who", `${dataset.name} cohort drawn from ${dataset.source}.`],
      ["What", `${filteredGenes.length} active DEGs, ${filteredEdges.length} retained interactions, and ${dataset.pathways.length} pathway references in the current program.`],
      ["When", "Most useful during early mechanism review, cross-functional disease-program discussion, and target triage."],
      ["Where", `Biological context anchored in ${dataset.category.toLowerCase()} disease biology.`],
      ["Why", `${leadPathway?.name ?? "Lead pathway"} suggests the strongest explanatory pathway signal under the current threshold.`],
      ["How", `Threshold set to |log2FC| >= ${fcThreshold[0].toFixed(1)}, then interpreted through network connectivity, DEG directionality, and pathway overlap.`],
    ] as const;
  }, [dataset, filteredEdges.length, filteredGenes.length, fcThreshold, leadPathway]);

  const compareSummary = useMemo(() => {
    if (!compareDataset || !compareTopPathway) return null;
    return `${dataset.shortName} vs ${compareDataset.shortName}: ${dataset.shortName} carries ${dataset.genes.length} DEGs and lead pathway ${leadPathway?.name ?? "none"}, while ${compareDataset.shortName} carries ${compareDataset.genes.length} DEGs with ${compareTopPathway.name} as its dominant pathway signal.`;
  }, [compareDataset, compareTopPathway, dataset, leadPathway]);

  const focusedPathway = useMemo(() => {
    if (focusedPathwayName === "lead") return leadPathway ?? null;
    return dataset.pathways.find((pathway) => pathway.name === focusedPathwayName) ?? null;
  }, [dataset.pathways, focusedPathwayName, leadPathway]);

  const focusedPathwayGenes = useMemo(() => {
    if (!focusedPathway) return [];
    return focusedPathway.genes
      .filter((symbol) => visibleSymbols.has(symbol))
      .map((symbol) => filteredGenes.find((gene) => gene.symbol === symbol))
      .filter((gene): gene is NonNullable<typeof gene> => Boolean(gene))
      .sort((a, b) => Math.abs(b.log2FC) - Math.abs(a.log2FC));
  }, [filteredGenes, focusedPathway, visibleSymbols]);

  const focusedPathwayEdges = useMemo(() => {
    if (!focusedPathway) return [];
    const allowed = new Set(focusedPathway.genes);
    return filteredEdges.filter((edge) => allowed.has(edge.source) && allowed.has(edge.target));
  }, [filteredEdges, focusedPathway]);

  const reportMarkdown = useMemo(() => {
    const lines = [
      `# ${dataset.name} report`,
      "",
      "## Cohort",
      `- Source: ${dataset.source}`,
      `- Category: ${dataset.category}`,
      `- Samples: ${dataset.samples}`,
      `- Gene scope: ${dataset.demoGeneCap ? `top ${dataset.demoGeneCap} representative DEGs included in this program` : "custom cohort with user-supplied gene table size"}`,
      "",
      "## Active analytical state",
      `- |log2FC| threshold: ${fcThreshold[0].toFixed(1)}`,
      `- Genes in current view: ${filteredGenes.length}/${dataset.genes.length}`,
      `- Interactions in current view: ${filteredEdges.length}`,
      `- Upregulated genes: ${upCount}`,
      `- Downregulated genes: ${downCount}`,
      `- Lead pathway: ${leadPathway?.name ?? "None"} (${leadPathway?.source ?? "N/A"})`,
      "",
      "## Conclusion",
      analystConclusion,
      "",
      "## Top hub genes",
      ...topHubGenes.map((gene) => `- ${gene.symbol}: degree ${gene.degree}, log2FC ${gene.log2FC.toFixed(2)}, adj.P ${gene.pAdj.toExponential(1)}`),
      "",
      "## Strongest expression shifts",
      ...topShiftGenes.map((gene) => `- ${gene.symbol}: ${gene.name} (${gene.log2FC.toFixed(2)})`),
      "",
      "## Lead pathway genes in view",
      ...(focusedPathwayGenes.length
        ? focusedPathwayGenes.map((gene) => `- ${gene.symbol}: ${gene.log2FC.toFixed(2)}`)
        : ["- No focused pathway genes remain under the current threshold."]),
    ];

    if (compareSummary) {
      lines.push("", "## Comparison summary", compareSummary);
    }

    return lines.join("\n");
  }, [
    DEMO_GENE_CAP,
    analystConclusion,
    compareSummary,
    dataset,
    fcThreshold,
    filteredEdges.length,
    filteredGenes.length,
    focusedPathwayGenes,
    leadPathway,
    topHubGenes,
    topShiftGenes,
    upCount,
    downCount,
  ]);

  const openPrintReport = (mode: "report" | "slides") => {
    const win = window.open("", "_blank", "width=1200,height=900");
    if (!win) {
      toast.error("Could not open print window");
      return;
    }

    const title = mode === "slides" ? `${dataset.name} deck brief` : `${dataset.name} analysis report`;
    const sections = reportMarkdown
      .split("\n\n")
      .map((block) => `<section>${block.split("\n").map((line) => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`).join("")}</section>`)
      .join("");

    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#06101d; color:#edf6ff; margin:0; padding:40px; }
            .shell { max-width:${mode === "slides" ? "1400px" : "960px"}; margin:0 auto; }
            .hero { border:1px solid rgba(157,177,211,0.16); border-radius:28px; padding:32px; background:rgba(6,16,29,0.78); margin-bottom:24px; }
            h1 { margin:0 0 8px; font-size:${mode === "slides" ? "44px" : "34px"}; }
            h2 { margin:24px 0 12px; font-size:${mode === "slides" ? "28px" : "22px"}; color:#8fecff; }
            p { margin:8px 0; line-height:1.6; white-space:pre-wrap; }
            section { border:1px solid rgba(157,177,211,0.12); border-radius:20px; padding:20px; background:rgba(255,255,255,0.03); margin-bottom:16px; }
            .meta { color:rgba(228,235,247,0.72); }
            @media print { body { background:white; color:black; } .hero, section { break-inside: avoid; color:black; background:white; border:1px solid #d3d8e0; } h2 { color:#0f4c7a; } }
          </style>
        </head>
        <body>
          <div class="shell">
            <div class="hero">
              <div class="meta">Network Pulse Analyzer</div>
              <h1>${title}</h1>
              <p class="meta">${dataset.source} · ${dataset.category} · samples ${dataset.samples}</p>
              <p>${analystConclusion}</p>
            </div>
            ${sections}
          </div>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    win.document.close();
  };

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

  const exportReport = () => {
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${dataset.id}-analysis-report.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Exported analysis report");
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
            {inferSourceUrl(dataset) ? (
              <a
                href={inferSourceUrl(dataset)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                View source evidence <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Select value={dataset.id} onValueChange={(v) => setParams({ dataset: v })}>
              <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {allDatasets.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.shortName} — {d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-1.5" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <FileText className="h-4 w-4 mr-1.5" /> Report
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

      <div className="px-4 md:px-8 pb-6 grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signal briefing</div>
                <h2 className="mt-2 font-display text-2xl font-semibold">What stands out in this cohort right now</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Derived signals update as filters change, giving you a faster read on hub pressure, pathway dominance, and how much of the cohort remains analytically active.
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-[10px] font-mono">
                {networkCoverage}% cohort in view
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <CircleGauge className="h-3.5 w-3.5 text-primary" />
                  Lead pathway
                </div>
                <div className="mt-3 text-lg font-semibold text-foreground">{leadPathway?.name ?? "No pathway available"}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {leadPathway ? `${leadPathway.source} · p=${leadPathway.pValue.toExponential(1)} · overlap ${pathwayCoverage}` : "Awaiting pathway signal"}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Radar className="h-3.5 w-3.5 text-primary" />
                  Hub pressure
                </div>
                <div className="mt-3 text-lg font-semibold text-foreground">
                  {topHubGenes[0]?.symbol ?? "No hub"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {topHubGenes[0] ? `${topHubGenes[0].degree} direct links in current view` : "No network signal yet"}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Workflow className="h-3.5 w-3.5 text-primary" />
                  Edge confidence
                </div>
                <div className="mt-3 text-lg font-semibold text-foreground">
                  {filteredEdges.length ? meanEdgeScore.toFixed(2) : "0.00"}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Mean confidence across {filteredEdges.length} active interactions
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fast read</div>
            <div className="mt-3 space-y-3">
              {[
                `Top shifted gene is ${topShiftGenes[0]?.symbol ?? "unavailable"} with |log2FC| ${topShiftGenes[0] ? Math.abs(topShiftGenes[0].log2FC).toFixed(2) : "0.00"}.`,
                `${upCount} upregulated and ${downCount} downregulated genes remain after filtering.`,
                `${topHubGenes.length ? topHubGenes.map((gene) => gene.symbol).join(", ") : "No"} hubs currently dominate the interaction view.`,
              ].map((line) => (
                <div key={line} className="rounded-2xl border border-border/60 bg-white/[0.03] p-3 text-sm text-muted-foreground">
                  <Sparkles className="mr-2 inline h-3.5 w-3.5 text-primary" />
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 md:px-8 pb-6 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Analyst frame</div>
                <h2 className="mt-2 font-display text-2xl font-semibold">Who, what, when, where, why, and how for this active cohort</h2>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-[10px] font-mono">
                conclusion ready
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {analystFrame.map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-primary">{label}</div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.08] p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Conclusion</div>
              <p className="mt-3 text-sm leading-7 text-foreground/90">{analystConclusion}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Compare mode</div>
                <h2 className="mt-2 font-display text-2xl font-semibold">Cross-cohort context without leaving the workspace</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Compare the active program against another cohort to understand whether signal density, directionality, and pathway pressure are unusually strong or broadly shared.
                </p>
              </div>
              <div className="min-w-[220px]">
                <Select value={compareId} onValueChange={setCompareId}>
                  <SelectTrigger><SelectValue placeholder="Choose comparison cohort" /></SelectTrigger>
                  <SelectContent>
                    {allDatasets.filter((item) => item.id !== dataset.id).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.shortName} — {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {compareDataset ? (
              <>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {comparisonMetrics.map((item) => (
                    <div key={item.metric} className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{item.metric}</div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground">{dataset.shortName}</div>
                          <div className="font-mono text-xl text-foreground">{item.active}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{compareDataset.shortName}</div>
                          <div className="font-mono text-xl text-foreground">{item.compare}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Directionality balance</div>
                    <div className="mt-3 h-[210px]">
                      <ChartContainer
                        config={{
                          active: { label: dataset.shortName, color: "hsl(195 100% 78%)" },
                          compare: { label: compareDataset.shortName, color: "hsl(320 85% 72%)" },
                        }}
                        className="h-full w-full"
                      >
                        <BarChart data={balanceChartData}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="label" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="active" fill="var(--color-active)" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="compare" fill="var(--color-compare)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lead pathway strength</div>
                    <div className="mt-3 h-[210px]">
                      <ChartContainer
                        config={{
                          active: { label: dataset.shortName, color: "hsl(195 100% 78%)" },
                          compare: { label: compareDataset.shortName, color: "hsl(320 85% 72%)" },
                        }}
                        className="h-full w-full"
                      >
                        <BarChart data={pathwayStrengthData} layout="vertical" margin={{ left: 10, right: 24 }}>
                          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                          <XAxis type="number" axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} width={60} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                            {pathwayStrengthData.map((entry) => (
                              <Cell key={entry.label} fill={entry.fill} />
                            ))}
                            <LabelList dataKey="score" position="right" className="fill-foreground text-xs" />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.08] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-primary">Comparison conclusion</div>
                  <p className="mt-3 text-sm leading-7 text-foreground/90">{compareSummary}</p>
                </div>
              </>
            ) : (
              <div className="mt-5 text-sm text-muted-foreground">Choose a second cohort to activate compare mode.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 md:px-8 pb-6">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Demo scope note</div>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                  Each reference cohort currently includes the top {DEMO_GENE_CAP} representative DEGs plus a curated interaction and pathway layer for demonstration. This is intentionally a compact analytical slice, not a full untruncated transcriptome export.
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-[10px] font-mono">
                top {DEMO_GENE_CAP} DEG demo layer
              </Badge>
            </div>
          </CardContent>
        </Card>
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
                <TabsTrigger value="insights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Insights</TabsTrigger>
                <TabsTrigger value="focus" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Focus</TabsTrigger>
                <TabsTrigger value="report" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Report</TabsTrigger>
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
                      <div className="mt-2">
                        <a
                          href={getPathwayEvidenceUrl(p.name, p.source)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                        >
                          Open pathway evidence <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {overlap.length} / {p.genes.length} genes in view
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="insights" className="m-0 p-4 space-y-4 max-h-[600px] overflow-auto">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Top hubs in active graph</div>
                  <div className="mt-3 space-y-2">
                    {topHubGenes.map((gene) => (
                      <button
                        key={gene.symbol}
                        onClick={() => setSelected(gene.symbol)}
                        className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3 text-left transition-smooth hover:border-primary/40"
                      >
                        <div>
                          <div className="font-mono font-semibold text-foreground">{gene.symbol}</div>
                          <div className="text-xs text-muted-foreground">{gene.name}</div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="font-mono text-primary">{gene.degree} links</div>
                          <div>|log2FC| {Math.abs(gene.log2FC).toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Strongest expression shifts</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topShiftGenes.map((gene) => (
                      <button
                        key={gene.symbol}
                        onClick={() => setSelected(gene.symbol)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-mono transition-smooth ${
                          gene.direction === "up"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-[hsl(320_85%_72%_/_0.35)] bg-[hsl(320_85%_72%_/_0.10)] text-magenta"
                        }`}
                      >
                        {gene.symbol} {gene.log2FC > 0 ? "+" : ""}
                        {gene.log2FC.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected gene spotlight</div>
                  {selectedGene ? (
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="text-lg font-semibold text-foreground">{selectedGene.symbol}</div>
                        <div className="text-sm text-muted-foreground">{selectedGene.name}</div>
                        <a
                          href={getGeneEvidenceUrl(selectedGene.symbol)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          Gene evidence <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl border border-border/60 bg-white/[0.03] p-3">
                          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expression</div>
                          <div className="mt-2 font-mono text-foreground">{selectedGene.log2FC.toFixed(2)}</div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-white/[0.03] p-3">
                          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current degree</div>
                          <div className="mt-2 font-mono text-foreground">{degreeMap.get(selectedGene.symbol) ?? 0}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Linked pathways</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedGenePathways.length ? selectedGenePathways.map((pathway) => (
                            <span key={pathway.name} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-mono text-primary">
                              {pathway.name}
                            </span>
                          )) : (
                            <span className="text-sm text-muted-foreground">No pathways linked in this demo cohort.</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">First-degree neighbors</div>
                        <div className="mt-2 space-y-2">
                          {selectedGeneNeighbors.length ? selectedGeneNeighbors.slice(0, 6).map((gene) => (
                            <button
                              key={gene.symbol}
                              onClick={() => setSelected(gene.symbol)}
                              className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2 text-left transition-smooth hover:border-primary/40"
                            >
                              <div>
                                <div className="font-mono font-semibold text-foreground">{gene.symbol}</div>
                                <div className="text-xs text-muted-foreground">{gene.name}</div>
                              </div>
                              <div className="text-right text-xs text-muted-foreground">
                                <div className="font-mono text-primary">{gene.degree} links</div>
                                <div>{gene.log2FC.toFixed(2)}</div>
                              </div>
                            </button>
                          )) : (
                            <span className="text-sm text-muted-foreground">No first-degree neighbors remain in the current filtered graph.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-muted-foreground">Select a gene from the graph, table, or pathway panel to open its current cohort summary.</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="focus" className="m-0 p-4 space-y-4 max-h-[600px] overflow-auto">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pathway-specific focus mode</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Narrow the cohort down to one mechanistic pathway and inspect its retained genes, subnetwork edges, and strongest shifts under the current threshold.
                      </p>
                    </div>
                    <div className="w-[240px] max-w-full">
                      <Select value={focusedPathwayName} onValueChange={setFocusedPathwayName}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead pathway</SelectItem>
                          {dataset.pathways.map((pathway) => (
                            <SelectItem key={pathway.name} value={pathway.name}>
                              {pathway.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <ListFilter className="h-3.5 w-3.5 text-primary" />
                      Focused pathway
                    </div>
                    <div className="mt-3 text-lg font-semibold text-foreground">{focusedPathway?.name ?? "No pathway selected"}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{focusedPathway?.source ?? "N/A"}</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <GitFork className="h-3.5 w-3.5 text-primary" />
                      Focus subnetwork
                    </div>
                    <div className="mt-3 text-lg font-semibold text-foreground">{focusedPathwayEdges.length} retained edges</div>
                    <div className="mt-1 text-sm text-muted-foreground">{focusedPathwayGenes.length} pathway genes remain in view</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <CircleGauge className="h-3.5 w-3.5 text-primary" />
                      Focus conclusion
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {focusedPathway
                        ? `${focusedPathway.name} retains ${focusedPathwayGenes.length} visible genes and ${focusedPathwayEdges.length} internal edges under the current threshold.`
                        : "No focus pathway available."}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Genes driving the focused pathway</div>
                  <div className="mt-3 space-y-2">
                    {focusedPathwayGenes.length ? focusedPathwayGenes.map((gene) => (
                      <button
                        key={gene.symbol}
                        onClick={() => setSelected(gene.symbol)}
                        className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3 text-left transition-smooth hover:border-primary/40"
                      >
                        <div>
                          <div className="font-mono font-semibold text-foreground">{gene.symbol}</div>
                          <div className="text-xs text-muted-foreground">{gene.name}</div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className={gene.direction === "up" ? "font-mono text-primary" : "font-mono text-magenta"}>
                            {gene.log2FC > 0 ? "+" : ""}
                            {gene.log2FC.toFixed(2)}
                          </div>
                          <div>adj.P {gene.pAdj.toExponential(1)}</div>
                        </div>
                      </button>
                    )) : (
                      <div className="text-sm text-muted-foreground">No pathway genes remain after filtering. Lower the threshold or choose another pathway.</div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="report" className="m-0 p-4 space-y-4 max-h-[600px] overflow-auto">
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Exportable report view</div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This report summarizes the current cohort, active threshold, lead pathway, dominant hubs, and optional comparison state. Export it as markdown for downstream briefing or documentation.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={exportReport}>
                      <Download className="mr-1.5 h-4 w-4" />
                      Export report
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openPrintReport("report")}>
                      <Printer className="mr-1.5 h-4 w-4" />
                      Print/PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openPrintReport("slides")}>
                      <Presentation className="mr-1.5 h-4 w-4" />
                      Deck brief
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-[hsl(214_68%_7%_/_0.78)] p-4">
                  <pre className="whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{reportMarkdown}</pre>
                </div>
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
                <div className="rounded-md border border-border/60 p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Conclusion</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {analystConclusion}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 p-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Demo limitation</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {dataset.demoGeneCap
                      ? `This reference program currently includes the top ${dataset.demoGeneCap} representative DEGs rather than a full untruncated gene universe. Use it as an interpretable analytical slice, not as a complete transcriptome readout.`
                      : "This is a custom cohort, so gene-table scope depends on the rows you supplied through the intake flow."}
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
