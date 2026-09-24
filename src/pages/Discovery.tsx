import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { datasets, getDataset } from "@/data/datasets";
import { buildEvidenceBundle, buildHypotheses, buildRunManifest } from "@/lib/discoveryEngine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, ShieldCheck, Sparkles, Microscope, FlaskConical, Network, DatabaseZap, Download, Swords, Fingerprint } from "lucide-react";

const Discovery=()=>{
 const [datasetId,setDatasetId]=useState(datasets[0].id); const [run,setRun]=useState(1);
 const dataset=getDataset(datasetId)??datasets[0];
 const hypotheses=useMemo(()=>buildHypotheses(dataset),[dataset,run]);
 const evidence=useMemo(()=>buildEvidenceBundle(dataset),[dataset]);
 const manifest=useMemo(()=>buildRunManifest(dataset),[dataset,run]);
 const exportRun=()=>{const blob=new Blob([JSON.stringify({manifest,hypotheses,evidence},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="network-pulse-"+dataset.id+"-run.json";a.click();URL.revokeObjectURL(url);};
 return <AppLayout><div className="container max-w-[1500px] py-10 space-y-6">
  <section className="glass-panel p-6 md:p-8 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-mesh opacity-70"/><div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
   <div><p className="eyebrow">Discovery OS · run {run}</p><h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight">Interrogate biology, not a chatbot.</h1><p className="mt-4 max-w-3xl text-muted-foreground text-lg">Six analytical roles pressure test competing mechanisms against a deterministic evidence graph, then propose experiments designed to kill weak hypotheses quickly.</p></div>
   <div className="flex flex-wrap gap-2"><Select value={datasetId} onValueChange={v=>{setDatasetId(v);setRun(1)}}><SelectTrigger className="w-[260px]"><SelectValue/></SelectTrigger><SelectContent>{datasets.map(d=><SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select><Button onClick={()=>setRun(v=>v+1)}><Sparkles className="mr-2 h-4 w-4"/>Recompute</Button><Button variant="outline" onClick={exportRun}><Download className="mr-2 h-4 w-4"/>Run bundle</Button></div>
  </div></section>
  <div className="grid md:grid-cols-4 gap-3">{[["Evidence objects",evidence.length,DatabaseZap],["Hypotheses",hypotheses.length,BrainCircuit],["Agent reviews",hypotheses.length*6,Swords],["Run fingerprint",manifest.fingerprint,Fingerprint]].map(([l,v,I])=><Card key={String(l)}><CardContent className="p-5"><div className="flex justify-between text-xs uppercase tracking-wider text-muted-foreground"><span>{l}</span><I className="h-4 w-4 text-primary"/></div><div className="mt-3 text-xl font-semibold break-all">{v}</div></CardContent></Card>)}</div>
  <Tabs defaultValue="hypotheses"><TabsList><TabsTrigger value="hypotheses">Hypotheses</TabsTrigger><TabsTrigger value="agents">Agent room</TabsTrigger><TabsTrigger value="protocol">Protocol</TabsTrigger></TabsList>
   <TabsContent value="hypotheses" className="space-y-4 mt-4">{hypotheses.map(h=><Card key={h.id}><CardContent className="p-6"><div className="grid xl:grid-cols-[1.3fr_.7fr] gap-6"><div><div className="flex gap-2"><Badge>{h.id}</Badge><Badge variant="outline">{h.confidence}% confidence</Badge></div><h2 className="mt-3 text-xl font-semibold">{h.statement}</h2><div className="mt-4 flex flex-wrap gap-2">{h.drivers.map(g=><Badge variant="secondary" key={g}>{g}</Badge>)}</div></div><div className="grid grid-cols-3 gap-2">{[["Support",h.support],["Contradiction",h.contradiction],["Novelty",h.novelty]].map(([l,v])=><div key={String(l)} className="metric-block text-center"><div className="text-xs text-muted-foreground">{l}</div><div className="text-2xl font-mono mt-1">{v}%</div></div>)}</div></div><div className="mt-5 border-t border-border pt-4"><div className="text-xs uppercase tracking-wider text-primary">Discriminating experiment</div><p className="mt-2 text-sm text-muted-foreground">{h.experiment}</p></div></CardContent></Card>)}</TabsContent>
   <TabsContent value="agents" className="mt-4"><div className="grid lg:grid-cols-2 gap-4">{hypotheses[0].findings.map(f=><Card key={f.role}><CardContent className="p-5"><div className="flex justify-between"><div className="font-semibold">{f.role}</div><Badge variant="outline">pressure {f.pressure}</Badge></div><p className="mt-3 text-sm text-muted-foreground">{f.verdict}</p><div className="mt-3 flex flex-wrap gap-1">{f.evidence.map(e=><span className="text-[11px] font-mono bg-muted rounded px-2 py-1" key={e}>{e}</span>)}</div></CardContent></Card>)}</div></TabsContent>
   <TabsContent value="protocol" className="mt-4"><Card><CardContent className="p-6 grid md:grid-cols-3 gap-4">{[[ShieldCheck,"Compute before interpret","Topology, statistics, scores and identifiers are deterministic."],[Microscope,"Falsify before celebrate","Every candidate mechanism ships with a discriminating experiment."],[FlaskConical,"Human gate","The platform proposes. Scientists decide what crosses into the laboratory."]].map(([I,t,b])=><div className="metric-block" key={String(t)}><I className="h-5 w-5 text-primary"/><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{b}</p></div>)}</CardContent></Card></TabsContent>
  </Tabs>
 </div></AppLayout>
};
export default Discovery;
