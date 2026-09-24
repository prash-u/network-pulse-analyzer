# Network Pulse Analyzer v2 architecture

## Mission

Network Pulse is an evidence first discovery operating system for turning omics signal into competing mechanisms, explicit contradictions and discriminating experiments.

## Trust boundary

Deterministic code owns identifiers, filtering, graph topology, pathway scores, perturbation calculations and provenance. Reasoning components may interpret these outputs but cannot silently alter them.

## Evidence graph

Objects are addressable nodes: dataset, gene, interaction edge, pathway, calculation, paper, claim and experiment. Every derived object records parent IDs. Claims can therefore be walked backwards to source evidence.

## Agent room

Mechanist proposes the minimum causal story. Skeptic attacks it. Statistician audits quantitative language. Translator checks decision relevance. Experiment proposes falsification. Provenance enforces traceability.

The agents are roles over one shared evidence state, not independent sources of truth.

## Scientific workflow

ingest → normalize → deterministic metrics → evidence graph → competing hypotheses → adversarial review → discriminating experiment → human decision → new evidence

## Production interfaces

A backend should expose versioned adapters for PubMed or Europe PMC, GEO, UniProt, Reactome, STRING, Open Targets and Ensembl. External records should be cached as immutable evidence snapshots with retrieval timestamps and stable source identifiers.

## Safety and validity

The product is a research decision support surface. Clinical claims require separately validated pipelines, governance, intended use controls and domain review. Model generated prose must never masquerade as measured data.

## Roadmap

1. persisted project and run storage
2. literature retrieval and citation resolver
3. source adapters and identifier harmonisation
4. signed content hashed run manifests
5. temporal omics and multiomics evidence layers
6. combination perturbation simulation
7. experiment value of information ranking
8. collaboration, review states and audit history
9. benchmark suite with known biological cases
10. API and reproducible headless runner
