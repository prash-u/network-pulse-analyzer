import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Upload, Database, Network, GitBranch } from "lucide-react";
import { toast } from "sonner";
import { createCustomCohort, saveCustomCohort } from "@/lib/customCohorts";
import type { Disorder } from "@/data/datasets";

const defaultGenes = `symbol,name,log2FC,pAdj
GENE1,Example gene 1,2.35,0.000001
GENE2,Example gene 2,-1.84,0.000012
GENE3,Example gene 3,1.22,0.000310`;

const defaultEdges = `source,target,score
GENE1,GENE2,0.86
GENE1,GENE3,0.74`;

const defaultPathways = `name,source,pValue,genes
Example pathway,KEGG,0.000002,GENE1|GENE2
Example response,Reactome,0.000120,GENE1|GENE3`;

const categories: Disorder["category"][] = [
  "Neurodegenerative",
  "Metabolic",
  "Oncology",
  "Infectious",
  "Cardiovascular",
];

const Intake = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [category, setCategory] = useState<Disorder["category"]>("Oncology");
  const [source, setSource] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [samples, setSamples] = useState("50");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("195 100% 78%");
  const [genesCsv, setGenesCsv] = useState(defaultGenes);
  const [edgesCsv, setEdgesCsv] = useState(defaultEdges);
  const [pathwaysCsv, setPathwaysCsv] = useState(defaultPathways);

  const geneCount = useMemo(() => {
    const lines = genesCsv.split(/\r?\n/).filter(Boolean);
    return Math.max(0, lines.length - 1);
  }, [genesCsv]);

  const handleSubmit = () => {
    try {
      const cohort = createCustomCohort({
        name,
        shortName,
        category,
        source,
        sourceUrl,
        samples: Number(samples),
        description,
        color,
        genesCsv,
        edgesCsv,
        pathwaysCsv,
      });

      saveCustomCohort(cohort);
      toast.success("Custom cohort saved");
      navigate(`/workspace?dataset=${encodeURIComponent(cohort.id)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create cohort");
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto w-[min(1480px,calc(100%-28px))] py-5 pb-10">
        <section className="glass-panel p-6 md:p-8">
          <p className="eyebrow">Custom Cohort Intake</p>
          <h1 className="mt-2 text-[clamp(2.3rem,4vw,4rem)] font-semibold text-foreground">Bring your own gene table into the analyzer.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            This intake surface accepts larger custom DEG tables, optional interaction edges, and optional pathway rows. It is the first step beyond the built-in top-15 demo cohorts.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="status-chip !normal-case !tracking-normal">Arbitrary gene counts supported</span>
            <span className="status-chip !normal-case !tracking-normal">Optional edges + pathways</span>
            <span className="status-chip !normal-case !tracking-normal">Browser-stored custom cohorts</span>
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="glass-panel p-6 md:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cohort name" />
              <Input value={shortName} onChange={(e) => setShortName(e.target.value)} placeholder="Short name" />
              <div>
                <Select value={category} onValueChange={(value) => setCategory(value as Disorder["category"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input value={samples} onChange={(e) => setSamples(e.target.value)} placeholder="Samples" />
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source label" />
              <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Source URL (optional)" />
              <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="HSL color token e.g. 195 100% 78%" className="md:col-span-2" />
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the cohort" className="min-h-[100px] md:col-span-2" />
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-foreground">Genes CSV</div>
                <Textarea value={genesCsv} onChange={(e) => setGenesCsv(e.target.value)} className="min-h-[220px] font-mono text-xs" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-foreground">Edges CSV</div>
                <Textarea value={edgesCsv} onChange={(e) => setEdgesCsv(e.target.value)} className="min-h-[140px] font-mono text-xs" />
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold text-foreground">Pathways CSV</div>
                <Textarea value={pathwaysCsv} onChange={(e) => setPathwaysCsv(e.target.value)} className="min-h-[140px] font-mono text-xs" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSubmit} className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Upload className="mr-1.5 h-4 w-4" />
                Create cohort
              </Button>
              <Button variant="outline" asChild>
                <Link to="/workspace">
                  Back to workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-7">
            <div className="space-y-4">
              <Card className="border-border/60 bg-white/[0.03]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    Scope
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Built-in reference cohorts stay capped for readability, but custom cohorts can carry larger DEG lists and are not automatically truncated.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-white/[0.03]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <Network className="h-3.5 w-3.5 text-primary" />
                    Edges
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    If you do not supply edges, the cohort will still load, but the graph will have no interaction structure until edges are added.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/60 bg-white/[0.03]">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <GitBranch className="h-3.5 w-3.5 text-primary" />
                    Pathways
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Pathway rows are optional, but adding them unlocks the same pathway, focus, and reporting surfaces used by the built-in cohorts.
                  </p>
                </CardContent>
              </Card>
              <div className="rounded-[1.5rem] border border-primary/20 bg-primary/[0.08] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Ready state</div>
                <p className="mt-3 text-sm leading-6 text-foreground/90">
                  Current gene rows detected: {geneCount}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Intake;
