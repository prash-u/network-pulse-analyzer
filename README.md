# Network Pulse Analyzer

Network Pulse Analyzer is a dark-first translational network analysis web app for turning differential expression signals into interpretable biological stories.

It is designed for:
- research review
- translational and clinical framing
- biotech / pharma strategy conversations
- internal demo and product storytelling

The app is intentionally positioned as an analytical surface, not a full upstream omics ingestion pipeline.

## Product Summary

The core experience starts from a cohort of differentially expressed genes and exposes:
- interaction network structure
- DEG directionality and amplitude
- pathway prioritization
- hub discovery
- cross-cohort comparison
- exportable report views

It ships with built-in reference cohorts and now also supports browser-stored custom cohorts created through an intake flow.

## Current Capabilities

### Built-in reference cohorts
- Six curated disease programs across neurodegeneration, metabolism, oncology, cardiovascular disease, and infection
- Each cohort includes representative genes, curated edges, and pathway rows
- Built-in cohorts are intentionally compact for readability during live analytical review

### Workspace analysis
- Interactive force-directed network graph
- Fold-change thresholding
- Searchable gene table
- Pathway panel with overlap-aware pathway interpretation
- Derived signal briefing
- Analyst framing with explicit conclusion text
- Pathway focus mode
- Gene spotlight with first-degree neighbors
- Compare mode against another cohort

### Reporting and export
- DEG CSV export
- Markdown report export
- Print/PDF-ready branded report window
- Slide / deck brief print window

### Provenance and evidence
- Dataset source labels
- External source links when available
- Gene evidence links
- Pathway evidence links
- Explicit scope notes and demo limitations

### Custom cohort intake
- Create a custom cohort from pasted CSV inputs
- Support larger custom DEG tables than the built-in demo cohorts
- Optional interaction edge CSV
- Optional pathway CSV
- Stored in browser local storage

## Important Limitation

Built-in reference cohorts currently use a compact representative DEG layer.

In practice, that means:
- built-in demo programs are capped to a top-15 DEG-style slice for readability
- they are not full untruncated transcriptome-wide result tables
- custom cohorts are the path for larger user-supplied gene tables

This limitation is surfaced in the UI and is intentional rather than hidden.

## Routes

- `/` — landing page / product overview
- `/workspace` — main analysis workspace
- `/datasets` — built-in reference cohorts
- `/intake` — custom cohort intake
- `/methods` — analytical framing and provenance
- `/docs` — user-facing usage notes

## Built-in Data Model

The app centers on the `Disorder` type in [src/data/datasets.ts](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/data/datasets.ts):

- `name`, `shortName`, `category`
- `source`, optional `sourceUrl`
- `samples`
- `description`
- `color`
- optional `demoGeneCap`
- optional `isCustom`
- `genes`
- `edges`
- `pathways`

### Gene

Each gene row contains:
- `symbol`
- `name`
- `log2FC`
- `pAdj`
- `direction`

### Edge

Each edge contains:
- `source`
- `target`
- `score`

### Pathway

Each pathway contains:
- `name`
- `source` (`KEGG`, `Reactome`, `GO:BP`)
- `pValue`
- `genes`

## Custom Cohort Intake Format

Custom cohorts are created from CSV text areas in `/intake`.

### Genes CSV

Required columns:

```csv
symbol,name,log2FC,pAdj
GENE1,Example gene 1,2.35,0.000001
GENE2,Example gene 2,-1.84,0.000012
GENE3,Example gene 3,1.22,0.000310
```

Optional `direction` column is supported:

```csv
symbol,name,log2FC,pAdj,direction
GENE1,Example gene 1,2.35,0.000001,up
GENE2,Example gene 2,-1.84,0.000012,down
```

If `direction` is omitted, it is inferred from `log2FC`.

### Edges CSV

Optional:

```csv
source,target,score
GENE1,GENE2,0.86
GENE1,GENE3,0.74
```

### Pathways CSV

Optional:

```csv
name,source,pValue,genes
Example pathway,KEGG,0.000002,GENE1|GENE2
Example response,Reactome,0.000120,GENE1|GENE3
```

Notes:
- `genes` uses `|` as the separator
- `source` must be one of `KEGG`, `Reactome`, or `GO:BP`

## Analytical Philosophy

This project is strongest when used to answer:
- which genes are shifting the most?
- which genes anchor the interaction graph?
- which pathway appears to dominate the current readout?
- how does one cohort compare against another?
- what evidence slice should be exported into a review discussion?

It is not yet intended to replace:
- full DEG generation pipelines
- full ID harmonization workflows
- large-scale enrichment suites
- validated clinical decision tools

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS
- Radix UI
- Sonner
- TanStack Query

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run TypeScript checks:

```bash
npx tsc --noEmit
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Key Files

- [src/pages/Index.tsx](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/pages/Index.tsx)
  Product landing page and analytical framing

- [src/pages/Workspace.tsx](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/pages/Workspace.tsx)
  Main analytical surface

- [src/pages/Intake.tsx](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/pages/Intake.tsx)
  Custom cohort intake flow

- [src/data/datasets.ts](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/data/datasets.ts)
  Built-in cohort definitions and data model

- [src/lib/customCohorts.ts](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/lib/customCohorts.ts)
  Browser-side custom cohort parsing and storage

- [src/components/NetworkGraph.tsx](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/components/NetworkGraph.tsx)
  Lightweight interactive force-directed graph

- [src/pages/Methods.tsx](/Users/prashantumrekar/Documents/GitHub/network-pulse-analyzer/src/pages/Methods.tsx)
  Provenance and interpretation framing

## Future Directions

The most natural next expansions are:
- richer custom cohort schema detection
- importers for standard DEG / enrichment outputs
- larger cohort and pathway handling at scale
- better pathway-specific evidence linking
- stronger export formatting
- deeper systems-biology layers downstream of the DEG-first analysis surface

## Status

This is a serious demo-grade translational analysis product with:
- branded product framing
- built-in disease programs
- custom cohort support
- evidence-aware workspace interactions
- comparison and reporting layers

It is intentionally beyond a visualization toy, but not yet a full end-to-end omics platform.
