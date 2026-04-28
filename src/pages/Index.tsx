import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CircleGauge,
  Database,
  Dna,
  GitBranch,
  HeartPulse,
  Layers3,
  Microscope,
  Network,
  Orbit,
  ScanSearch,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import heroImage from "@/assets/hero-network.jpg";
import { datasets } from "@/data/datasets";

const audiences = [
  {
    icon: Microscope,
    title: "Research",
    text: "Inspect DEG structure, pathway overlap, and protein interaction hubs without leaving the browser.",
  },
  {
    icon: Stethoscope,
    title: "Clinical",
    text: "Support translational review with a cleaner view of candidate genes, mechanisms, and pathway pressure.",
  },
  {
    icon: Building2,
    title: "Commercial",
    text: "Present indication logic, target rationale, and disease-program storytelling in a sharper product surface.",
  },
];

const capabilities = [
  {
    icon: Network,
    title: "Interaction graph",
    text: "Force-directed network view with expression direction, neighbourhood focus, and degree-aware emphasis.",
  },
  {
    icon: GitBranch,
    title: "Pathway layer",
    text: "KEGG, Reactome, and GO:BP context surfaced next to the active cohort rather than hidden in a separate tool.",
  },
  {
    icon: Database,
    title: "Reference cohorts",
    text: "Six cross-domain transcriptomic starters spanning neurodegeneration, oncology, metabolism, infection, and cardiovascular biology.",
  },
  {
    icon: ShieldCheck,
    title: "Private-by-default demoing",
    text: "Browser-native analysis flow that is easy to share without turning the product into a data-handling risk.",
  },
];

const workflow = [
  {
    title: "Choose a cohort",
    text: "Start from a disease program with curated genes, interaction edges, and ranked pathways already loaded.",
  },
  {
    title: "Focus the signal",
    text: "Filter by fold change, isolate the strongest expression changes, and keep the graph readable during live review.",
  },
  {
    title: "Read mechanism fast",
    text: "Move between hub structure and pathway enrichment without switching products or exporting intermediate files.",
  },
];

const provenance = [
  {
    icon: Dna,
    title: "Expression cohorts",
    text: "Reference programs are derived from public transcriptomic studies cited by source, including GEO-style and TCGA-style cohorts represented in the dataset metadata.",
  },
  {
    icon: Network,
    title: "Interaction layer",
    text: "Network views use a curated illustrative interaction backbone to simulate the kind of protein-protein reasoning users expect from translational network analysis.",
  },
  {
    icon: Layers3,
    title: "Pathway knowledge",
    text: "Mechanism ranking is framed through KEGG, Reactome, and GO biological process terms so pathway language stays familiar to research and translational teams.",
  },
  {
    icon: ScanSearch,
    title: "Current input scope",
    text: "Today the product is strongest as a cohort-driven exploration surface. It ships with curated reference programs rather than full custom upload and preprocessing workflows.",
  },
];

const analyticalFrame = [
  {
    label: "Who",
    text: "Research teams, translational reviewers, and biotech strategy groups that need a fast biological read without opening a full wet-lab pipeline.",
  },
  {
    label: "What",
    text: "A DEG-first network analysis surface that combines cohort signal, interaction structure, and pathway evidence in one place.",
  },
  {
    label: "When",
    text: "Use it early in hypothesis generation, indication review, demo sessions, internal prioritization, and cross-functional disease-program discussions.",
  },
  {
    label: "Where",
    text: "Best suited to browser-native review environments: lab meetings, translational calls, diligence rooms, and internal portfolio reviews.",
  },
  {
    label: "Why",
    text: "Because raw DEG tables are too flat, and pathway spreadsheets are too fragmented, to quickly explain mechanism-level consequence.",
  },
  {
    label: "How",
    text: "Start from a reference cohort, filter expression strength, inspect hubs, validate pathway dominance, and export the evidence slice that supports the current readout.",
  },
];

const programSnapshots = datasets.slice(0, 3).map((dataset) => ({
  id: dataset.id,
  name: dataset.name,
  category: dataset.category,
  source: dataset.source,
  strongestGene: [...dataset.genes].sort((a, b) => Math.abs(b.log2FC) - Math.abs(a.log2FC))[0],
  leadPathway: [...dataset.pathways].sort((a, b) => a.pValue - b.pValue)[0],
  edgeDensity: `${dataset.edges.length} edges / ${dataset.genes.length} genes`,
  color: dataset.color,
}));

const operatingSignals = [
  {
    icon: CircleGauge,
    title: "Signal intensity",
    text: "Rank cohorts by fold-change amplitude, DEG balance, and connectivity so the most consequential biology surfaces first.",
  },
  {
    icon: Orbit,
    title: "Hub discovery",
    text: "Use interaction density and neighborhood structure to identify the genes most likely to anchor mechanism-level interpretation.",
  },
  {
    icon: HeartPulse,
    title: "Pathway pressure",
    text: "Translate gene-level movement into pathway-level language fast enough for translational reviews and strategy sessions.",
  },
];

const Index = () => {
  return (
    <AppLayout>
      <main className="mx-auto w-[min(1480px,calc(100%-28px))] py-5 pb-10">
        <section className="glass-panel relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
          <img
            src={heroImage}
            alt=""
            className="absolute inset-y-0 right-0 hidden h-full w-[46%] object-cover opacity-20 mix-blend-screen lg:block"
            width={1600}
            height={1024}
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.6fr)] lg:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow">Network Pulse Analyzer</p>
              <h1 className="mt-2 text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[0.92] text-foreground">
                Translational network
                <br />
                intelligence for
                <br />
                research, clinic, and market.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Turn differential expression into pathway-ranked, interaction-aware biological insight with the same dark lab-grade product language as the rest of the pulse portfolio.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  <Link to="/workspace">
                    Launch workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/10 bg-white/5 text-foreground hover:bg-white/10 hover:text-foreground">
                  <Link to="/datasets">Browse cohorts</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="status-chip !normal-case !tracking-normal">6 disease programs</span>
                <span className="status-chip !normal-case !tracking-normal">24 ranked pathways</span>
                <span className="status-chip !normal-case !tracking-normal">Browser-native PWA</span>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ["Signal layer", "Differential expression, pathway context, and interaction structure in one continuous review surface."],
                ["Decision layer", "Readable enough for live research review, clinical framing, and partner-facing product demos."],
                ["Delivery layer", "Dark-first, installable, and visually aligned with Neural Pulse Play and Live Vision Model Lab."],
              ].map(([title, text]) => (
                <div key={title} className="metric-block">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">Who it serves</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">One interface, three real use cases.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              This section exists because the same analysis surface has to hold up in different rooms: research review, translational discussion, and commercial storytelling.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {audiences.map((audience) => (
                <div key={audience.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <audience.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{audience.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">Only the layers the product actually has.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              These are the core product surfaces that justify dedicated explanation on the page today. Anything thinner should stay out of the landing page until the tool grows.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div key={capability.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <capability.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{capability.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)]">
          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">Reference cohorts</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">Curated biological programs ready to inspect.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Open a cohort and move directly into the workspace. Each starter is set up to demonstrate how the analyzer reads from signal to mechanism.
            </p>

            <div className="mt-6 space-y-3">
              {datasets.slice(0, 4).map((dataset) => (
                <Link
                  key={dataset.id}
                  to={`/workspace?dataset=${dataset.id}`}
                  className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 transition-smooth hover:border-primary/40 hover:bg-white/[0.07]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: `hsl(${dataset.color})`, boxShadow: `0 0 10px hsl(${dataset.color} / 0.7)` }}
                      />
                      <span>{dataset.category}</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{dataset.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{dataset.source}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">A three-step workflow that matches the actual tool.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The analyzer really does three things well today: it loads a cohort, lets you focus the signal, and helps you read network-plus-pathway context quickly. That is enough to justify this final section.
            </p>

            <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,12,24,0.7),rgba(3,8,18,0.92))] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">Network-driven cohort review</div>
                  <div className="mt-1 text-sm text-muted-foreground">From DEG signal to interaction structure to pathway interpretation.</div>
                </div>
                <span className="status-chip !normal-case !tracking-normal">
                  <BrainCircuit className="mr-1.5 h-3.5 w-3.5" />
                  DEG to pathway flow
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {workflow.map((step) => (
                  <div key={step.title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-sm font-semibold text-foreground">{step.title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="status-chip !normal-case !tracking-normal">
                  <Smartphone className="mr-1.5 h-3.5 w-3.5" />
                  Installable PWA
                </span>
                <span className="status-chip !normal-case !tracking-normal">
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Browser-native demoing
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 glass-panel p-6 md:p-7">
          <p className="eyebrow">Data provenance</p>
          <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">What the analyzer knows, and where that knowledge comes from.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            This section earns its place because trust matters in this category. The product needs to be clear about its current biological inputs, network knowledge layers, and where the analytical vocabulary comes from.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {provenance.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 glass-panel p-6 md:p-7">
          <p className="eyebrow">Analytical frame</p>
          <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">Who, what, when, where, why, and how this product is meant to be used.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            This section exists because the product now has enough shape to define its operating frame clearly. It should help users understand not just what the analyzer shows, but the role it plays in a real scientific workflow.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {analyticalFrame.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-primary">{item.label}</div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.7rem] border border-primary/20 bg-primary/[0.08] p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Conclusion</div>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-foreground/90">
              Network Pulse Analyzer is most valuable when a team needs to move from transcriptomic change to mechanism-level narrative quickly. It is not the final answer engine, but it is a strong front-end analytical surface for deciding what deserves deeper experimental, clinical, or commercial attention next.
            </p>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">Program snapshots</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">Three disease stories, already shaped for analysis.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              This section exists because the product has real built-in programs, not placeholder demo cards. Each cohort already contains enough structure to tell a useful mechanistic story.
            </p>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {programSnapshots.map((snapshot) => (
                <Link
                  key={snapshot.id}
                  to={`/workspace?dataset=${snapshot.id}`}
                  className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 transition-smooth hover:border-primary/40 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{snapshot.category}</div>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: `hsl(${snapshot.color})`, boxShadow: `0 0 10px hsl(${snapshot.color} / 0.75)` }}
                    />
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-foreground">{snapshot.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{snapshot.source}</p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Strongest shift</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        {snapshot.strongestGene.symbol}
                        <span className="ml-2 font-mono text-primary">{snapshot.strongestGene.log2FC.toFixed(2)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Lead pathway</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{snapshot.leadPathway.name}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Network coverage</div>
                      <div className="mt-1 text-sm text-muted-foreground">{snapshot.edgeDensity}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 md:p-7">
            <p className="eyebrow">Operating signals</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">A denser analytical surface, not just a prettier one.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              These are the signal types the product should keep getting better at exposing. They map directly to how scientists and strategy teams read the workspace.
            </p>

            <div className="mt-6 space-y-4">
              {operatingSignals.map((signal) => (
                <div key={signal.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <signal.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold text-foreground">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{signal.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Index;
