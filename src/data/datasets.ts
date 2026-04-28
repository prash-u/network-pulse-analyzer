// Sample differentially expressed gene (DEG) datasets across human disorders.
// Each dataset includes top genes with log2FoldChange & adjusted p-value,
// curated protein-protein interaction edges (subset, illustrative),
// and pathway enrichment results.

export type Disorder = {
  id: string;
  name: string;
  shortName: string;
  category: "Neurodegenerative" | "Metabolic" | "Oncology" | "Infectious" | "Cardiovascular";
  source: string;
  sourceUrl?: string;
  samples: number;
  description: string;
  color: string; // hsl token suffix
  demoGeneCap?: number | null;
  isCustom?: boolean;
  genes: Gene[];
  edges: Edge[];
  pathways: Pathway[];
};

export type Gene = {
  symbol: string;
  name: string;
  log2FC: number;
  pAdj: number;
  direction: "up" | "down";
};

export type Edge = { source: string; target: string; score: number };

export type Pathway = {
  name: string;
  source: "KEGG" | "Reactome" | "GO:BP";
  pValue: number;
  genes: string[];
};

const mk = (s: string, n: string, l: number, p: number): Gene => ({
  symbol: s,
  name: n,
  log2FC: l,
  pAdj: p,
  direction: l >= 0 ? "up" : "down",
});

export const datasets: Disorder[] = [
  {
    id: "parkinsons",
    name: "Parkinson's Disease",
    shortName: "PD",
    category: "Neurodegenerative",
    source: "GSE7621 — Substantia Nigra",
    samples: 25,
    color: "190 100% 55%",
    description:
      "Substantia nigra transcriptomic profile contrasting PD patients vs healthy controls.",
    genes: [
      mk("SNCA", "Alpha-synuclein", 2.84, 1.2e-8),
      mk("LRRK2", "Leucine-rich repeat kinase 2", 1.92, 4.1e-6),
      mk("PARK7", "DJ-1", -1.45, 2.8e-5),
      mk("PINK1", "PTEN-induced kinase 1", -1.78, 7.4e-6),
      mk("PRKN", "Parkin RBR E3 ligase", -2.11, 9.2e-7),
      mk("GBA", "Glucocerebrosidase", -1.32, 5.6e-5),
      mk("MAPT", "Microtubule-associated protein tau", 1.61, 1.1e-4),
      mk("UCHL1", "Ubiquitin C-terminal hydrolase L1", -1.92, 3.3e-6),
      mk("TH", "Tyrosine hydroxylase", -3.21, 8.4e-9),
      mk("DDC", "DOPA decarboxylase", -2.14, 2.2e-6),
      mk("VPS35", "Vacuolar protein sorting 35", 1.25, 8.9e-4),
      mk("ATP13A2", "ATPase 13A2", -1.55, 4.5e-5),
      mk("DJ1", "Protein deglycase DJ-1", -1.41, 6.7e-5),
      mk("HTRA2", "HtrA serine peptidase 2", 1.18, 2.1e-3),
      mk("FBXO7", "F-box only protein 7", -1.33, 9.8e-4),
    ],
    edges: [
      { source: "SNCA", target: "LRRK2", score: 0.92 },
      { source: "SNCA", target: "PRKN", score: 0.88 },
      { source: "SNCA", target: "MAPT", score: 0.81 },
      { source: "PINK1", target: "PRKN", score: 0.97 },
      { source: "PARK7", target: "PINK1", score: 0.85 },
      { source: "LRRK2", target: "GBA", score: 0.74 },
      { source: "TH", target: "DDC", score: 0.89 },
      { source: "UCHL1", target: "PRKN", score: 0.78 },
      { source: "VPS35", target: "LRRK2", score: 0.72 },
      { source: "ATP13A2", target: "PINK1", score: 0.69 },
      { source: "HTRA2", target: "PARK7", score: 0.66 },
      { source: "FBXO7", target: "PRKN", score: 0.71 },
      { source: "DJ1", target: "PARK7", score: 0.95 },
      { source: "TH", target: "SNCA", score: 0.64 },
    ],
    pathways: [
      { name: "Parkinson disease", source: "KEGG", pValue: 2.1e-12, genes: ["SNCA", "LRRK2", "PINK1", "PRKN", "PARK7", "UCHL1"] },
      { name: "Mitophagy", source: "Reactome", pValue: 4.3e-9, genes: ["PINK1", "PRKN", "PARK7", "FBXO7"] },
      { name: "Dopamine biosynthesis", source: "GO:BP", pValue: 1.2e-7, genes: ["TH", "DDC", "GBA"] },
      { name: "Ubiquitin-mediated proteolysis", source: "KEGG", pValue: 3.8e-6, genes: ["PRKN", "UCHL1", "FBXO7"] },
    ],
  },
  {
    id: "alzheimers",
    name: "Alzheimer's Disease",
    shortName: "AD",
    category: "Neurodegenerative",
    source: "GSE5281 — Hippocampus & Cortex",
    samples: 161,
    color: "320 85% 65%",
    description:
      "Multi-region brain expression profiling in late-onset Alzheimer's vs age-matched controls.",
    genes: [
      mk("APP", "Amyloid precursor protein", 2.12, 4.5e-7),
      mk("APOE", "Apolipoprotein E", 2.78, 1.1e-9),
      mk("PSEN1", "Presenilin 1", 1.65, 3.2e-5),
      mk("PSEN2", "Presenilin 2", 1.42, 8.1e-5),
      mk("MAPT", "Tau", 2.31, 5.6e-8),
      mk("BACE1", "Beta-secretase 1", 1.88, 2.4e-6),
      mk("CLU", "Clusterin", 2.05, 6.7e-7),
      mk("TREM2", "Triggering receptor on myeloid cells 2", 1.94, 4.2e-6),
      mk("CR1", "Complement receptor 1", 1.77, 1.2e-5),
      mk("BIN1", "Bridging integrator 1", -1.48, 3.4e-4),
      mk("PICALM", "PI clathrin assembly protein", -1.62, 5.5e-5),
      mk("SORL1", "Sortilin-related receptor", -1.91, 2.1e-6),
      mk("ABCA7", "ATP binding cassette A7", 1.55, 9.3e-5),
      mk("CD33", "CD33 antigen", 1.71, 4.1e-5),
      mk("MS4A6A", "Membrane-spanning 4A 6A", 1.43, 1.8e-4),
    ],
    edges: [
      { source: "APP", target: "BACE1", score: 0.96 },
      { source: "APP", target: "PSEN1", score: 0.93 },
      { source: "PSEN1", target: "PSEN2", score: 0.91 },
      { source: "APOE", target: "CLU", score: 0.84 },
      { source: "APOE", target: "TREM2", score: 0.78 },
      { source: "MAPT", target: "APP", score: 0.81 },
      { source: "TREM2", target: "CD33", score: 0.76 },
      { source: "BIN1", target: "PICALM", score: 0.74 },
      { source: "SORL1", target: "APP", score: 0.82 },
      { source: "ABCA7", target: "APOE", score: 0.7 },
      { source: "CR1", target: "CLU", score: 0.69 },
      { source: "MS4A6A", target: "TREM2", score: 0.67 },
    ],
    pathways: [
      { name: "Alzheimer disease", source: "KEGG", pValue: 1.4e-13, genes: ["APP", "APOE", "PSEN1", "PSEN2", "MAPT", "BACE1"] },
      { name: "Amyloid fiber formation", source: "Reactome", pValue: 5.2e-10, genes: ["APP", "PSEN1", "BACE1", "APOE"] },
      { name: "Microglia activation", source: "GO:BP", pValue: 2.3e-7, genes: ["TREM2", "CD33", "CR1", "MS4A6A"] },
      { name: "Endocytosis", source: "KEGG", pValue: 7.1e-6, genes: ["BIN1", "PICALM", "SORL1"] },
    ],
  },
  {
    id: "diabetes-t2",
    name: "Type 2 Diabetes",
    shortName: "T2D",
    category: "Metabolic",
    source: "GSE25724 — Pancreatic Islets",
    samples: 13,
    color: "38 95% 60%",
    description:
      "Pancreatic islet beta-cell expression in T2D donors vs non-diabetic controls.",
    genes: [
      mk("INS", "Insulin", -2.95, 3.2e-9),
      mk("GCK", "Glucokinase", -1.88, 1.4e-6),
      mk("TCF7L2", "Transcription factor 7-like 2", 2.21, 2.1e-7),
      mk("KCNJ11", "Potassium channel Kir6.2", -1.56, 5.4e-5),
      mk("ABCC8", "Sulfonylurea receptor 1", -1.71, 2.2e-5),
      mk("HNF1A", "HNF1 homeobox A", -1.32, 8.7e-4),
      mk("PPARG", "PPAR gamma", -1.45, 3.3e-4),
      mk("IRS1", "Insulin receptor substrate 1", -2.04, 4.5e-7),
      mk("IRS2", "Insulin receptor substrate 2", -1.87, 1.8e-6),
      mk("SLC2A2", "GLUT2 glucose transporter", -2.31, 6.7e-8),
      mk("PDX1", "Pancreatic and duodenal homeobox 1", -1.92, 9.1e-7),
      mk("MAFA", "MAF bZIP transcription factor A", -2.18, 2.4e-7),
      mk("GLP1R", "Glucagon-like peptide 1 receptor", -1.41, 4.2e-4),
      mk("ADIPOQ", "Adiponectin", -1.78, 1.1e-5),
      mk("LEP", "Leptin", 1.95, 7.8e-6),
    ],
    edges: [
      { source: "INS", target: "GCK", score: 0.92 },
      { source: "INS", target: "PDX1", score: 0.94 },
      { source: "INS", target: "MAFA", score: 0.89 },
      { source: "KCNJ11", target: "ABCC8", score: 0.97 },
      { source: "IRS1", target: "IRS2", score: 0.93 },
      { source: "TCF7L2", target: "INS", score: 0.78 },
      { source: "PPARG", target: "ADIPOQ", score: 0.85 },
      { source: "HNF1A", target: "GCK", score: 0.81 },
      { source: "SLC2A2", target: "GCK", score: 0.83 },
      { source: "GLP1R", target: "INS", score: 0.74 },
      { source: "LEP", target: "ADIPOQ", score: 0.71 },
      { source: "PDX1", target: "MAFA", score: 0.86 },
    ],
    pathways: [
      { name: "Type II diabetes mellitus", source: "KEGG", pValue: 8.2e-11, genes: ["INS", "GCK", "KCNJ11", "ABCC8", "IRS1", "IRS2"] },
      { name: "Insulin secretion", source: "KEGG", pValue: 1.7e-9, genes: ["INS", "GCK", "KCNJ11", "ABCC8", "GLP1R"] },
      { name: "Maturity onset diabetes of the young", source: "KEGG", pValue: 4.5e-8, genes: ["HNF1A", "PDX1", "GCK", "MAFA"] },
      { name: "Adipocytokine signaling", source: "KEGG", pValue: 2.1e-5, genes: ["PPARG", "ADIPOQ", "LEP", "IRS1"] },
    ],
  },
  {
    id: "breast-cancer",
    name: "Breast Cancer",
    shortName: "BRCA",
    category: "Oncology",
    source: "TCGA-BRCA — Tumor vs Normal",
    samples: 1097,
    color: "350 80% 60%",
    description:
      "Tumor vs adjacent-normal expression profiles from The Cancer Genome Atlas.",
    genes: [
      mk("BRCA1", "Breast cancer 1", -2.45, 1.1e-9),
      mk("BRCA2", "Breast cancer 2", -2.12, 4.3e-8),
      mk("TP53", "Tumor protein p53", -1.78, 8.1e-7),
      mk("ERBB2", "HER2 / Erb-B2", 3.21, 2.4e-12),
      mk("ESR1", "Estrogen receptor 1", 2.85, 1.2e-10),
      mk("PGR", "Progesterone receptor", 2.01, 5.7e-8),
      mk("MYC", "MYC proto-oncogene", 2.74, 6.8e-10),
      mk("CCND1", "Cyclin D1", 2.43, 3.1e-9),
      mk("PIK3CA", "PI3K catalytic subunit alpha", 1.92, 4.2e-7),
      mk("PTEN", "Phosphatase and tensin homolog", -1.85, 2.3e-6),
      mk("AKT1", "AKT serine/threonine kinase 1", 1.66, 1.4e-5),
      mk("MKI67", "Marker of proliferation Ki-67", 3.45, 8.7e-13),
      mk("EGFR", "Epidermal growth factor receptor", 1.81, 5.2e-6),
      mk("CDH1", "E-cadherin", -2.31, 3.8e-9),
      mk("KRT5", "Keratin 5", 1.74, 1.1e-5),
    ],
    edges: [
      { source: "BRCA1", target: "BRCA2", score: 0.95 },
      { source: "BRCA1", target: "TP53", score: 0.88 },
      { source: "TP53", target: "MYC", score: 0.82 },
      { source: "TP53", target: "CCND1", score: 0.79 },
      { source: "ERBB2", target: "EGFR", score: 0.91 },
      { source: "ERBB2", target: "PIK3CA", score: 0.86 },
      { source: "PIK3CA", target: "AKT1", score: 0.93 },
      { source: "PTEN", target: "AKT1", score: 0.9 },
      { source: "ESR1", target: "PGR", score: 0.92 },
      { source: "ESR1", target: "CCND1", score: 0.78 },
      { source: "MYC", target: "MKI67", score: 0.74 },
      { source: "CDH1", target: "KRT5", score: 0.66 },
      { source: "BRCA1", target: "MKI67", score: 0.69 },
    ],
    pathways: [
      { name: "Breast cancer", source: "KEGG", pValue: 3.4e-14, genes: ["BRCA1", "BRCA2", "TP53", "ERBB2", "ESR1", "PIK3CA"] },
      { name: "PI3K-Akt signaling", source: "KEGG", pValue: 7.8e-11, genes: ["PIK3CA", "AKT1", "PTEN", "ERBB2", "EGFR"] },
      { name: "Cell cycle", source: "Reactome", pValue: 2.1e-9, genes: ["MYC", "CCND1", "MKI67", "TP53"] },
      { name: "Estrogen signaling", source: "KEGG", pValue: 5.3e-8, genes: ["ESR1", "PGR", "CCND1"] },
    ],
  },
  {
    id: "covid19",
    name: "COVID-19 Severe",
    shortName: "COV",
    category: "Infectious",
    source: "GSE157103 — Whole Blood",
    samples: 126,
    color: "158 70% 50%",
    description:
      "Whole-blood transcriptomic signatures of severe COVID-19 vs mild/healthy.",
    genes: [
      mk("ACE2", "Angiotensin-converting enzyme 2", 2.14, 3.2e-7),
      mk("TMPRSS2", "Transmembrane serine protease 2", 1.78, 1.4e-5),
      mk("IL6", "Interleukin 6", 3.45, 8.1e-12),
      mk("TNF", "Tumor necrosis factor", 2.91, 4.3e-10),
      mk("IFNG", "Interferon gamma", 2.34, 6.7e-8),
      mk("CXCL10", "C-X-C motif chemokine 10", 3.12, 1.1e-11),
      mk("STAT1", "Signal transducer STAT1", 2.05, 3.4e-7),
      mk("IRF7", "Interferon regulatory factor 7", 1.92, 7.8e-7),
      mk("ISG15", "ISG15 ubiquitin-like modifier", 2.81, 5.2e-9),
      mk("MX1", "MX dynamin-like GTPase 1", 2.45, 2.1e-8),
      mk("OAS1", "2'-5'-oligoadenylate synthetase 1", 2.12, 9.4e-8),
      mk("IFIT1", "Interferon-induced protein with TPRs 1", 2.67, 4.5e-9),
      mk("CD4", "CD4 antigen", -1.78, 1.2e-5),
      mk("CD8A", "CD8 alpha", -1.92, 4.3e-6),
      mk("PTPRC", "CD45", -1.31, 8.7e-4),
    ],
    edges: [
      { source: "ACE2", target: "TMPRSS2", score: 0.91 },
      { source: "IL6", target: "TNF", score: 0.93 },
      { source: "IL6", target: "STAT1", score: 0.86 },
      { source: "IFNG", target: "STAT1", score: 0.95 },
      { source: "STAT1", target: "IRF7", score: 0.88 },
      { source: "IRF7", target: "ISG15", score: 0.84 },
      { source: "ISG15", target: "MX1", score: 0.87 },
      { source: "MX1", target: "OAS1", score: 0.82 },
      { source: "OAS1", target: "IFIT1", score: 0.85 },
      { source: "CXCL10", target: "STAT1", score: 0.79 },
      { source: "CD4", target: "CD8A", score: 0.92 },
      { source: "CD8A", target: "PTPRC", score: 0.78 },
      { source: "TNF", target: "CXCL10", score: 0.74 },
    ],
    pathways: [
      { name: "Coronavirus disease (COVID-19)", source: "KEGG", pValue: 1.2e-15, genes: ["ACE2", "TMPRSS2", "IL6", "TNF", "STAT1"] },
      { name: "Type I interferon signaling", source: "Reactome", pValue: 4.5e-12, genes: ["IRF7", "ISG15", "MX1", "OAS1", "IFIT1", "STAT1"] },
      { name: "Cytokine storm", source: "GO:BP", pValue: 2.3e-10, genes: ["IL6", "TNF", "IFNG", "CXCL10"] },
      { name: "T cell receptor signaling", source: "KEGG", pValue: 8.1e-6, genes: ["CD4", "CD8A", "PTPRC"] },
    ],
  },
  {
    id: "cardiovascular",
    name: "Heart Failure",
    shortName: "HF",
    category: "Cardiovascular",
    source: "GSE57338 — Left Ventricle",
    samples: 313,
    color: "0 75% 60%",
    description:
      "Left ventricular gene expression in dilated/ischemic cardiomyopathy vs non-failing hearts.",
    genes: [
      mk("NPPA", "Atrial natriuretic peptide", 3.21, 1.1e-11),
      mk("NPPB", "Brain natriuretic peptide", 3.45, 4.2e-12),
      mk("MYH7", "Myosin heavy chain 7", 2.14, 6.7e-8),
      mk("ACTA1", "Skeletal alpha-actin", 1.92, 3.4e-7),
      mk("MYH6", "Myosin heavy chain 6", -2.31, 8.1e-9),
      mk("ATP2A2", "SERCA2", -1.78, 5.2e-6),
      mk("PLN", "Phospholamban", -1.45, 4.3e-4),
      mk("RYR2", "Ryanodine receptor 2", -1.62, 1.2e-5),
      mk("SCN5A", "Sodium channel Nav1.5", -1.31, 9.4e-4),
      mk("KCNH2", "hERG potassium channel", -1.55, 3.3e-4),
      mk("TNNI3", "Cardiac troponin I", 1.78, 4.5e-6),
      mk("TNNT2", "Cardiac troponin T", 1.65, 1.4e-5),
      mk("COL1A1", "Collagen I alpha 1", 2.45, 7.8e-9),
      mk("COL3A1", "Collagen III alpha 1", 2.12, 2.1e-8),
      mk("TGFB1", "Transforming growth factor beta 1", 1.88, 4.2e-7),
    ],
    edges: [
      { source: "NPPA", target: "NPPB", score: 0.97 },
      { source: "MYH7", target: "MYH6", score: 0.94 },
      { source: "MYH7", target: "ACTA1", score: 0.81 },
      { source: "ATP2A2", target: "PLN", score: 0.96 },
      { source: "RYR2", target: "ATP2A2", score: 0.84 },
      { source: "SCN5A", target: "KCNH2", score: 0.78 },
      { source: "TNNI3", target: "TNNT2", score: 0.92 },
      { source: "COL1A1", target: "COL3A1", score: 0.95 },
      { source: "TGFB1", target: "COL1A1", score: 0.86 },
      { source: "TGFB1", target: "COL3A1", score: 0.83 },
      { source: "NPPB", target: "MYH7", score: 0.74 },
    ],
    pathways: [
      { name: "Dilated cardiomyopathy", source: "KEGG", pValue: 2.3e-12, genes: ["MYH7", "MYH6", "ACTA1", "TNNI3", "TNNT2"] },
      { name: "Cardiac muscle contraction", source: "KEGG", pValue: 5.4e-10, genes: ["ATP2A2", "PLN", "RYR2", "MYH7"] },
      { name: "ECM-receptor interaction", source: "KEGG", pValue: 8.7e-9, genes: ["COL1A1", "COL3A1", "TGFB1"] },
      { name: "Adrenergic signaling in cardiomyocytes", source: "KEGG", pValue: 3.2e-7, genes: ["NPPA", "NPPB", "PLN", "ATP2A2"] },
    ],
  },
];

export const getDataset = (id: string) => datasets.find((d) => d.id === id);
