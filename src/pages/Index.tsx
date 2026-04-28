import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Building2,
  CircleGauge,
  Cpu,
  Database,
  FileSearch2,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Microscope,
  Network,
  Share2,
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
    text: "Interrogate transcriptomic signal, inspect interaction structure, and document pathway evidence in one browser-native flow.",
  },
  {
    icon: Stethoscope,
    title: "Clinical",
    text: "Frame high-priority genes, disease pathways, and biomarker candidates in language suitable for translational review.",
  },
  {
    icon: Building2,
    title: "Commercial",
    text: "Support indication scouting, target prioritization, and portfolio storytelling for biotech and pharma teams.",
  },
  {
    icon: GraduationCap,
    title: "Training",
    text: "Use the same interface for teaching systems biology without reducing the experience to a classroom toy.",
  },
];

const features = [
  {
    icon: Network,
    title: "Interactive PPI reasoning",
    text: "Force-directed networks reveal hubs, first-degree neighbours, and expression direction without leaving the workspace.",
  },
  {
    icon: GitBranch,
    title: "Pathway prioritization",
    text: "Rank KEGG, Reactome, and GO:BP terms with overlap context so teams can move from genes to mechanism.",
  },
  {
    icon: Database,
    title: "Curated disease starters",
    text: "Begin with cross-domain transcriptomic examples spanning neurodegeneration, oncology, metabolism, infection, and cardiovascular biology.",
  },
  {
    icon: Share2,
    title: "Portable analysis states",
    text: "Deep-link into dataset-specific views so collaborators can review the same network context instantly.",
  },
  {
    icon: Smartphone,
    title: "Installable field access",
    text: "Progressive web app packaging keeps the platform usable across mobile, desktop, and offline environments.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Sample analyses stay client-side, making the demo safe to share with research, clinical, and commercial stakeholders.",
  },
];

const readiness = [
  {
    icon: FlaskConical,
    title: "Evidence-led input",
    text: "Start from differential expression, not a dashboard theater layer. Every screen stays anchored in genes, edges, and pathway evidence.",
  },
  {
    icon: CircleGauge,
    title: "Decision-ready summaries",
    text: "Expose DEG counts, up/down balance, interaction density, and pathway overlap fast enough for live review sessions.",
  },
  {
    icon: Cpu,
    title: "Modern delivery",
    text: "Installable, responsive, and browser-native so the same product demo works in a lab meeting, clinic room, or partner call.",
  },
  {
    icon: FileSearch2,
    title: "Differentiated narrative",
    text: "Position the product as its own translational analysis platform rather than a branded mirror of an existing public site.",
  },
];

const Index = () => {
  return (
    <AppLayout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-90" />
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
          width={1600}
          height={1024}
        />
        <div className="relative min-h-[calc(100svh-3.5rem)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,hsl(190_100%_62%_/_0.18),transparent_22%),radial-gradient(circle_at_18%_82%,hsl(320_85%_62%_/_0.12),transparent_28%)]" />
          <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-[1440px] items-end gap-10 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.65fr)] lg:px-14 lg:py-16">
            <div className="max-w-4xl self-center animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary-glow backdrop-blur">
                <Zap className="h-3 w-3" /> Network Pulse Analyzer
              </div>
              <h1 className="mt-6 max-w-4xl font-display text-[clamp(3.3rem,8vw,7.4rem)] font-semibold leading-[0.92] text-white">
                Translational network
                <br />
                intelligence for
                <br />
                <span className="text-gradient">research, clinic, and market.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
                Turn differential expression into pathway-ranked, interaction-aware biological insight with a portfolio-ready workspace built for serious demonstrations, discovery conversations, and evidence review.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
                  <Link to="/workspace">
                    Launch the analyzer <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/methods">Review the methods</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 self-end lg:pb-4">
              {[
                ["Research layer", "Differential expression, network topology, and pathway context in one workspace."],
                ["Clinical layer", "Faster interpretation for biomarker and mechanism review conversations."],
                ["Commercial layer", "Target prioritization framing that reads well in partner-facing demos."],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 text-white/82 backdrop-blur-xl animate-fade-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary-glow">{title}</div>
                  <p className="mt-2 text-sm leading-6">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["6", "disease programs"],
              ["90+", "curated genes"],
              ["24", "ranked pathways"],
              ["100%", "browser-native"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-foreground md:text-4xl">{n}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Built for execution</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">One product language across four contexts.</h2>
          <p className="mt-4 text-muted-foreground">
            The interface stays consistent while the framing shifts from mechanistic exploration to translational communication.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <Card key={a.title} className="border-border/60 transition-smooth hover:border-primary/40 hover:shadow-elegant">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-glow">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="container py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Platform capabilities</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
              A cleaner product story
              <br />
              for high-stakes biology.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-lg border border-border bg-card p-6 transition-smooth hover:border-primary/40 hover:shadow-card">
                <f.icon className="h-6 w-6 text-primary transition-spring group-hover:scale-110" />
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-start">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Readiness standard</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Upgrade the demo into a platform narrative.</h2>
            <p className="mt-4 text-muted-foreground">
              The goal is not to imitate another public site. It is to present a differentiated translational analysis product with better language, stronger visual coherence, and a clearer path from signal to decision.
            </p>
          </div>
          <div className="grid gap-4">
            {readiness.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Reference cohorts</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Start from curated biological programs.</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/datasets">View all datasets <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((d) => (
            <Link key={d.id} to={`/workspace?dataset=${d.id}`}>
              <Card className="h-full border-border/60 transition-smooth hover:border-primary/40 hover:shadow-elegant hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                      style={{ background: `hsl(${d.color} / 0.15)`, color: `hsl(${d.color})` }}
                    >
                      {d.category}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">n={d.samples}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{d.name}</h3>
                  <p className="mt-1 text-xs font-mono text-muted-foreground">{d.source}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{d.genes.length} DEGs</span>
                    <span>·</span>
                    <span>{d.edges.length} interactions</span>
                    <span>·</span>
                    <span>{d.pathways.length} pathways</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-10 shadow-elegant md:p-16">
            <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">Ready to review the network signal?</h2>
              <p className="mt-4 text-white/70">
                Open the analyzer, choose a cohort, and move from differential expression to network-level interpretation without leaving the browser.
              </p>
              <Button size="lg" asChild className="mt-8 bg-white text-primary hover:bg-white/90">
                <Link to="/workspace">Launch workspace <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">Network Pulse Analyzer</span>
            <span>· Translational biological network intelligence.</span>
          </div>
          <div className="flex gap-5">
            <Link to="/methods" className="hover:text-foreground">Methods</Link>
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <Link to="/datasets" className="hover:text-foreground">Datasets</Link>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
};

export default Index;
