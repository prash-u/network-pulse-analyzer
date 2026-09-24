import type { Disorder, Gene, Edge, Pathway } from "@/data/datasets";

export type EvidenceKind = "dataset" | "gene" | "edge" | "pathway" | "calculation" | "claim" | "experiment";

export type EvidenceObject = {
  id: string;
  kind: EvidenceKind;
  label: string;
  source?: string;
  payload: Record<string, unknown>;
  parentIds: string[];
};

export const buildDegreeMap = (edges: Edge[]) => {
  const degree = new Map<string, number>();
  edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  });
  return degree;
};

export const rankGenesByNetworkInfluence = (dataset: Disorder) => {
  const degree = buildDegreeMap(dataset.edges);
  return dataset.genes
    .map((gene) => ({
      ...gene,
      degree: degree.get(gene.symbol) ?? 0,
      influence: (degree.get(gene.symbol) ?? 0) * Math.abs(gene.log2FC),
    }))
    .sort((a, b) => b.influence - a.influence);
};

export const simulateNodeRemoval = (dataset: Disorder, symbol: string) => {
  const removedEdges = dataset.edges.filter((edge) => edge.source === symbol || edge.target === symbol);
  const remainingEdges = dataset.edges.filter((edge) => edge.source !== symbol && edge.target !== symbol);
  const affectedPathways = dataset.pathways.filter((pathway) => pathway.genes.includes(symbol));
  const neighbours = new Set<string>();
  removedEdges.forEach((edge) => neighbours.add(edge.source === symbol ? edge.target : edge.source));
  return {
    symbol,
    removedEdges,
    remainingEdges,
    affectedPathways,
    neighbours: [...neighbours],
    connectivityLoss: dataset.edges.length ? removedEdges.length / dataset.edges.length : 0,
  };
};

export const pathwaySignal = (pathway: Pathway, genes: Gene[]) => {
  const visible = genes.filter((gene) => pathway.genes.includes(gene.symbol));
  const meanMagnitude = visible.length ? visible.reduce((sum, gene) => sum + Math.abs(gene.log2FC), 0) / visible.length : 0;
  return {
    overlap: visible.length,
    enrichmentStrength: pathway.pValue > 0 ? -Math.log10(pathway.pValue) : 0,
    meanMagnitude,
    score: visible.length * meanMagnitude * (pathway.pValue > 0 ? -Math.log10(pathway.pValue) : 0),
  };
};

export const buildEvidenceBundle = (dataset: Disorder): EvidenceObject[] => {
  const items: EvidenceObject[] = [
    {
      id: "dataset:" + dataset.id,
      kind: "dataset",
      label: dataset.name,
      source: dataset.source,
      payload: { samples: dataset.samples, category: dataset.category },
      parentIds: [],
    },
  ];

  dataset.genes.forEach((gene) => items.push({
    id: "gene:" + gene.symbol,
    kind: "gene",
    label: gene.symbol,
    source: dataset.source,
    payload: gene as unknown as Record<string, unknown>,
    parentIds: ["dataset:" + dataset.id],
  }));

  dataset.edges.forEach((edge, index) => items.push({
    id: "edge:" + index,
    kind: "edge",
    label: edge.source + " ↔ " + edge.target,
    payload: edge as unknown as Record<string, unknown>,
    parentIds: ["gene:" + edge.source, "gene:" + edge.target],
  }));

  dataset.pathways.forEach((pathway, index) => items.push({
    id: "pathway:" + index,
    kind: "pathway",
    label: pathway.name,
    source: pathway.source,
    payload: pathway as unknown as Record<string, unknown>,
    parentIds: pathway.genes.map((gene) => "gene:" + gene),
  }));

  return items;
};
