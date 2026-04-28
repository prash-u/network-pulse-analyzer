import type { Disorder, Edge, Gene, Pathway } from "@/data/datasets";

const STORAGE_KEY = "network-pulse-analyzer.custom-cohorts";

type PersistedCohort = Disorder;

const parseGenesCsv = (raw: string): Gene[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const dataLines = lines[0]?.toLowerCase().includes("symbol") ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const [symbol, name, log2FC, pAdj, direction] = line.split(",").map((item) => item.trim());
    const foldChange = Number(log2FC);
    const adjusted = Number(pAdj);

    if (!symbol || !name || Number.isNaN(foldChange) || Number.isNaN(adjusted)) {
      throw new Error(`Invalid gene row: ${line}`);
    }

    return {
      symbol,
      name,
      log2FC: foldChange,
      pAdj: adjusted,
      direction: direction === "up" || direction === "down" ? direction : foldChange >= 0 ? "up" : "down",
    };
  });
};

const parseEdgesCsv = (raw: string): Edge[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];
  const dataLines = lines[0]?.toLowerCase().includes("source") ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const [source, target, score] = line.split(",").map((item) => item.trim());
    const parsedScore = Number(score);

    if (!source || !target || Number.isNaN(parsedScore)) {
      throw new Error(`Invalid edge row: ${line}`);
    }

    return { source, target, score: parsedScore };
  });
};

const parsePathwaysCsv = (raw: string): Pathway[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];
  const dataLines = lines[0]?.toLowerCase().includes("name") ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const [name, source, pValue, genes] = line.split(",").map((item) => item.trim());
    const parsedP = Number(pValue);

    if (!name || !source || Number.isNaN(parsedP)) {
      throw new Error(`Invalid pathway row: ${line}`);
    }

    if (source !== "KEGG" && source !== "Reactome" && source !== "GO:BP") {
      throw new Error(`Invalid pathway source in row: ${line}`);
    }

    return {
      name,
      source,
      pValue: parsedP,
      genes: genes ? genes.split("|").map((gene) => gene.trim()).filter(Boolean) : [],
    } as Pathway;
  });
};

export const createCustomCohort = (input: {
  name: string;
  shortName: string;
  category: Disorder["category"];
  source: string;
  sourceUrl?: string;
  samples: number;
  description: string;
  color: string;
  genesCsv: string;
  edgesCsv?: string;
  pathwaysCsv?: string;
}): PersistedCohort => {
  const genes = parseGenesCsv(input.genesCsv);
  const edges = parseEdgesCsv(input.edgesCsv ?? "");
  const pathways = parsePathwaysCsv(input.pathwaysCsv ?? "");

  return {
    id: `custom:${crypto.randomUUID()}`,
    name: input.name,
    shortName: input.shortName,
    category: input.category,
    source: input.source,
    sourceUrl: input.sourceUrl || undefined,
    samples: input.samples,
    description: input.description,
    color: input.color,
    demoGeneCap: null,
    isCustom: true,
    genes,
    edges,
    pathways,
  };
};

export const listCustomCohorts = (): PersistedCohort[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersistedCohort[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCustomCohort = (cohort: PersistedCohort) => {
  if (typeof window === "undefined") return;
  const existing = listCustomCohorts().filter((item) => item.id !== cohort.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([cohort, ...existing]));
};

export const getCustomCohort = (id: string): PersistedCohort | null => {
  return listCustomCohorts().find((item) => item.id === id) ?? null;
};
