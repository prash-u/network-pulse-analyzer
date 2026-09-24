import type { Disorder, Edge, Gene, Pathway } from "@/data/datasets";

export type EvidenceKind = "dataset" | "gene" | "edge" | "pathway" | "calculation" | "claim" | "experiment" | "paper";
export type EvidenceObject = { id:string; kind:EvidenceKind; label:string; source?:string; payload:Record<string,unknown>; parentIds:string[] };
export type AgentRole = "Mechanist" | "Skeptic" | "Statistician" | "Translator" | "Experiment" | "Provenance";
export type AgentFinding = { role:AgentRole; verdict:string; evidence:string[]; pressure:number };
export type Hypothesis = { id:string; statement:string; support:number; contradiction:number; novelty:number; confidence:number; drivers:string[]; evidenceIds:string[]; findings:AgentFinding[]; experiment:string };

export const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));

export const buildDegreeMap=(edges:Edge[])=>{
  const degree=new Map<string,number>();
  edges.forEach(e=>{ degree.set(e.source,(degree.get(e.source)??0)+1); degree.set(e.target,(degree.get(e.target)??0)+1); });
  return degree;
};

export const rankGenesByNetworkInfluence=(dataset:Disorder)=>{
  const degree=buildDegreeMap(dataset.edges);
  return dataset.genes.map(g=>({...g,degree:degree.get(g.symbol)??0,influence:(degree.get(g.symbol)??0)*Math.abs(g.log2FC)*Math.max(1,-Math.log10(g.pAdj))}))
    .sort((a,b)=>b.influence-a.influence);
};

export const pathwaySignal=(pathway:Pathway,genes:Gene[])=>{
  const visible=genes.filter(g=>pathway.genes.includes(g.symbol));
  const meanMagnitude=visible.length?visible.reduce((s,g)=>s+Math.abs(g.log2FC),0)/visible.length:0;
  const enrichmentStrength=pathway.pValue>0?-Math.log10(pathway.pValue):0;
  return {overlap:visible.length,enrichmentStrength,meanMagnitude,score:visible.length*meanMagnitude*enrichmentStrength};
};

export const simulateNodeRemoval=(dataset:Disorder,symbol:string)=>{
  const removedEdges=dataset.edges.filter(e=>e.source===symbol||e.target===symbol);
  const remainingEdges=dataset.edges.filter(e=>e.source!==symbol&&e.target!==symbol);
  const affectedPathways=dataset.pathways.filter(p=>p.genes.includes(symbol));
  const neighbours=new Set<string>();
  removedEdges.forEach(e=>neighbours.add(e.source===symbol?e.target:e.source));
  return {symbol,removedEdges,remainingEdges,affectedPathways,neighbours:[...neighbours],connectivityLoss:dataset.edges.length?removedEdges.length/dataset.edges.length:0};
};

export const buildEvidenceBundle=(dataset:Disorder):EvidenceObject[]=>{
  const root="dataset:"+dataset.id;
  const out:EvidenceObject[]=[{id:root,kind:"dataset",label:dataset.name,source:dataset.source,payload:{samples:dataset.samples,category:dataset.category},parentIds:[]}];
  dataset.genes.forEach(g=>out.push({id:"gene:"+g.symbol,kind:"gene",label:g.symbol,source:dataset.source,payload:{symbol:g.symbol,name:g.name,log2FC:g.log2FC,pAdj:g.pAdj,direction:g.direction},parentIds:[root]}));
  dataset.edges.forEach((e,i)=>out.push({id:"edge:"+i,kind:"edge",label:e.source+" ↔ "+e.target,payload:{...e},parentIds:["gene:"+e.source,"gene:"+e.target]}));
  dataset.pathways.forEach((p,i)=>out.push({id:"pathway:"+i,kind:"pathway",label:p.name,source:p.source,payload:{name:p.name,pValue:p.pValue,genes:p.genes},parentIds:p.genes.map(g=>"gene:"+g)}));
  return out;
};

export const buildHypotheses=(dataset:Disorder):Hypothesis[]=>{
  const ranked=rankGenesByNetworkInfluence(dataset);
  const pathways=[...dataset.pathways].map((p,i)=>({p,i,signal:pathwaySignal(p,dataset.genes)})).sort((a,b)=>b.signal.score-a.signal.score);
  const hub=ranked[0], shift=[...dataset.genes].sort((a,b)=>Math.abs(b.log2FC)-Math.abs(a.log2FC))[0], lead=pathways[0];
  const mk=(id:string,statement:string,drivers:string[],base:number,novelty:number,experiment:string):Hypothesis=>{
    const hubDegree=hub.degree;
    const support=clamp(Math.round(base+Math.min(14,hubDegree*3)+Math.min(8,lead.signal.overlap)));
    const contradiction=clamp(Math.round(100-support+Math.max(4,18-lead.signal.enrichmentStrength)));
    const confidence=clamp(Math.round((support+(100-contradiction))/2));
    const evidenceIds=[...new Set(drivers.map(g=>"gene:"+g).concat(["pathway:"+lead.i]))];
    const findings:AgentFinding[]=[
      {role:"Mechanist",verdict:"Network topology and pathway overlap provide a coherent mechanistic route.",evidence:evidenceIds,pressure:support},
      {role:"Skeptic",verdict:"Association does not establish directionality; compensation and cell composition remain alternatives.",evidence:["dataset:"+dataset.id],pressure:contradiction},
      {role:"Statistician",verdict:"Signal is strongest where effect magnitude, adjusted significance and graph degree agree.",evidence:drivers.map(g=>"gene:"+g),pressure:confidence},
      {role:"Translator",verdict:"Prioritise claims that survive both pathway context and perturbation logic.",evidence:["pathway:"+lead.i],pressure:Math.round((support+novelty)/2)},
      {role:"Experiment",verdict:"Use an early time course and orthogonal perturbation to separate cause from marker.",evidence:evidenceIds,pressure:88},
      {role:"Provenance",verdict:"All numeric inputs resolve to deterministic evidence objects; interpretation remains explicitly labelled.",evidence:evidenceIds,pressure:100},
    ];
    return {id,statement,support,contradiction,novelty,confidence,drivers,evidenceIds,findings,experiment};
  };
  return [
    mk("H01",hub.symbol+" is a network control point coupling the observed expression state to "+lead.p.name+".",[hub.symbol,...lead.p.genes.slice(0,3)],62,64,"Perturb "+hub.symbol+" and measure pathway members at 1 h, 6 h and 24 h. An early pathway collapse before phenotype supports upstream control."),
    mk("H02",shift.symbol+" is primarily a state marker rather than the initiating driver.",[shift.symbol,hub.symbol],52,48,"Compare direct "+shift.symbol+" perturbation with "+hub.symbol+" perturbation. Divergent network responses discriminate marker from driver."),
    mk("H03",lead.p.name+" represents a compensatory programme activated after an earlier network disturbance.",lead.p.genes.slice(0,4),46,78,"Run a dense early time course. A reproducible upstream module preceding "+lead.p.name+" supports compensation rather than initiation."),
  ];
};

export const buildRunManifest=(dataset:Disorder)=>{
  const evidence=buildEvidenceBundle(dataset);
  const hypotheses=buildHypotheses(dataset);
  return {schema:"npa.discovery.run.v2",datasetId:dataset.id,source:dataset.source,evidenceCount:evidence.length,hypothesisCount:hypotheses.length,deterministic:true,engine:"network-pulse-v2",fingerprint:["npa","v2",dataset.id,dataset.genes.length,dataset.edges.length,dataset.pathways.length].join(":")};
};
