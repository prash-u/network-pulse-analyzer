import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { buildEvidenceBundle, buildHypotheses, buildRunManifest } from "@/lib/discoveryEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Search, Fingerprint, GitBranch, Database, Dna, FlaskConical } from "lucide-react";

const icon={dataset:Database,gene:Dna,edge:GitBranch,pathway:FlaskConical};
const Evidence=()=>{
 const [datasetId,setDatasetId]=useState(datasets[0].id); const [q,setQ]=useState("");
 const dataset=getDataset(datasetId)??datasets[0]; const bundle=useMemo(()=>buildEvidenceBundle(dataset),[dataset]); const hypotheses=useMemo(()=>buildHypotheses(dataset),[dataset]); const manifest=useMemo(()=>buildRunManifest(dataset),[dataset]);
 const filtered=bundle.filter(e=>(e.label+" "+e.kind+" "+(e.source??"")).toLowerCase().includes(q.toLowerCase()));
 return <AppLayout><div className="container max-w-[1500px] py-10 space-y-6">
  <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5"><div><p className="eyebrow">Evidence graph</p><h1 className="mt-2 text-4xl md:text-5xl font-semibold">Every conclusion has ancestry.</h1><p className="mt-3 max-w-3xl text-muted-foreground">Trace claims through genes, pathways, interactions and source cohorts. Supporting and contradicting evidence live in the same graph.</p></div><Select value={datasetId} onValueChange={setDatasetId}><SelectTrigger className="w-[280px]"><SelectValue/></SelectTrigger><SelectContent>{datasets.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
  <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-5">
   <div className="space-y-4"><Card><CardContent className="p-6"><ShieldCheck className="h-5 w-5 text-primary"/><div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Run manifest</div><div className="mt-2 font-mono text-sm break-all">{manifest.fingerprint}</div><div className="mt-4 grid grid-cols-2 gap-2"><div className="metric-block"><div className="text-xs text-muted-foreground">Objects</div><div className="text-2xl mt-1">{bundle.length}</div></div><div className="metric-block"><div className="text-xs text-muted-foreground">Hypotheses</div><div className="text-2xl mt-1">{hypotheses.length}</div></div></div></CardContent></Card>
   <Card><CardContent className="p-6"><div className="flex gap-2 items-center"><Fingerprint className="h-4 w-4 text-primary"/><h2 className="font-semibold">Integrity contract</h2></div><div className="mt-4 space-y-2">{["Attributable","Legible","Contemporaneous","Original","Accurate","Complete","Consistent","Enduring","Available"].map(x=><div key={x} className="flex items-center justify-between border-b border-border/50 py-2 text-sm"><span>{x}</span><Badge variant="outline">enforced by design</Badge></div>)}</div></CardContent></Card></div>
   <Card><CardContent className="p-6"><div className="relative mb-4"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="pl-9" placeholder="Search evidence IDs, genes, pathways or sources" value={q} onChange={e=>setQ(e.target.value)}/></div><div className="space-y-2 max-h-[720px] overflow-auto pr-1">{filtered.map(e=>{const I=icon[e.kind as keyof typeof icon]??ShieldCheck;return <div key={e.id} className="rounded-xl border border-border bg-muted/20 p-4 flex gap-3"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><I className="h-4 w-4 text-primary"/></div><div className="min-w-0"><div className="flex flex-wrap gap-2"><Badge variant="secondary">{e.id}</Badge><span className="text-xs uppercase text-muted-foreground">{e.kind}</span></div><div className="mt-2 font-medium">{e.label}</div><div className="mt-1 text-xs text-muted-foreground">{e.source??"derived evidence"} · parents: {e.parentIds.length?e.parentIds.join(", "):"root"}</div></div></div>})}</div></CardContent></Card>
  </div>
 </div></AppLayout>
};
export default Evidence;
