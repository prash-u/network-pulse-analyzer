import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Database,
  GitBranch,
  Microscope,
  Network,
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
            <p className="eyebrow">Positioning</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold">A product surface, not a clone.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              This should feel like its own translational analysis platform. The first screen now leads with the product, the analytical promise, and the working surface rather than generic light-section marketing.
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
            <p className="eyebrow">Workspace preview</p>
            <div className="mt-4 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,12,24,0.7),rgba(3,8,18,0.92))] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">Network-driven cohort review</div>
                  <div className="mt-1 text-sm text-muted-foreground">Choose a program, filter signal, inspect hubs, validate pathway pressure.</div>
                </div>
                <span className="status-chip !normal-case !tracking-normal">
                  <BrainCircuit className="mr-1.5 h-3.5 w-3.5" />
                  DEG to pathway flow
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Expression", "Threshold the cohort by |log2FC| and keep only the strongest signal in view."],
                  ["Network", "Highlight neighbours and visually rank interaction hubs at a glance."],
                  ["Pathways", "Inspect ranked terms beside the active network instead of switching tools."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-sm font-semibold text-foreground">{title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
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
      </main>
    </AppLayout>
  );
};

export default Index;
