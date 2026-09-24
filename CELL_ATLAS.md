# Network Pulse Cell Atlas v0.1

Cell Atlas is the spatial front end of Network Pulse, not a claim of live microscopy or a validated mechanistic simulator.

## Hierarchy
organism → organ → tissue → cell population → cell → organelle → pathway → molecular entity → evidence → hypothesis → experiment

## Truth contract
Every visible effect must be measured, computed, reference, inferred, hypothetical or illustrative. Bulk tissue data are never silently relabelled as cell-specific measurements.

## Disease-aware contexts
Parkinson's: substantia nigra → dopaminergic neuron / microglia / astrocyte.
Alzheimer's: hippocampus/cortex → neuron / microglia / astrocyte.
Type 2 diabetes: pancreatic islet → beta / alpha / endothelial.
Breast cancer: mammary tumour → epithelial / fibroblast / immune.
Severe COVID-19: whole blood → monocyte / T cell / neutrophil.
Heart failure: left ventricle → cardiomyocyte / fibroblast / endothelial.

## Dynamic engine
Canvas animation represents bounded RNA, protein, vesicle, calcium, signalling, cargo and energetic particles. Pause and 1×/5×/20× controls are available. Animation is mechanistic illustration unless actual temporal measurements are loaded.

## Evidence mapping
Dataset gene effects are mapped to pathway/process effects. Direct pathway matches are computed; unmatched process motion is labelled illustrative. The inspector exposes genes, pathway, truth state, rationale and evidence IDs.

## Counterfactuals
The homepage can mark a selected gene suppression as a counterfactual state and hands deeper topology calculations to the existing Simulation surface.

## Source adapters
Contracts are prepared for CELLxGENE, Human Protein Atlas, Reactome, Open Targets, UniProt and AlphaFold DB. Production ingestion must snapshot stable IDs, source version/release and retrieval metadata.

## Next production layer
Server-side source ingestion, ontology harmonisation (CL/UBERON/MONDO/EFO/GO/Ensembl), WebGL scene graph, real temporal-omics playback, multicell ligand-receptor communication, protein structure zoom, persisted evidence snapshots and benchmark validation.
