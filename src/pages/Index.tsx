import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Network, Microscope, Stethoscope, Building2, GraduationCap, Zap, Database, GitBranch, Share2, ShieldCheck, Smartphone } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import heroImage from "@/assets/hero-network.jpg";
import { datasets } from "@/data/datasets";

const audiences = [
  { icon: GraduationCap, title: "Educational", text: "Hands-on systems biology for students. No installs, no command line." },
  { icon: Microscope, title: "Research", text: "Reproducible enrichment, PPI exploration, and network topology metrics." },
  { icon: Stethoscope, title: "Clinical", text: "Translate omics findings into pathway-level insight at the point of care." },
  { icon: Building2, title: "Commercial", text: "Drug-target prioritization and biomarker discovery for industry teams." },
];

const features = [
  { icon: Network, title: "Force-directed PPI graphs", text: "Interactive networks built from STRING/BioGRID-style interactions, rendered in real time." },
  { icon: Database, title: "Curated DEG datasets", text: "Pre-loaded transcriptomes for Parkinson's, Alzheimer's, T2D, BRCA, COVID-19, and more." },
  { icon: GitBranch, title: "Pathway enrichment", text: "KEGG, Reactome and GO biological process terms with adjusted p-values." },
  { icon: Share2, title: "Shareable views", text: "Every analysis has a stable URL — collaborate without exporting screenshots." },
  { icon: Smartphone, title: "PWA — install anywhere", text: "Works offline, installs to your home screen, fully responsive on phone & tablet." },
  { icon: ShieldCheck, title: "Privacy-respecting", text: "All sample analyses run in your browser. No tracking, no uploads required." },
];

const Index = () => {
  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
          width={1600}
          height={1024}
        />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow backdrop-blur">
              <Zap className="h-3 w-3" /> v2.0 — rebuilt for the modern lab
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05] text-white">
              Biological networks,<br />
              <span className="text-gradient">decoded in seconds.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              NetworkAnalyst.ca turns differentially expressed genes into interactive
              networks and pathway insights — for education, research, clinical decision
              support, and commercial discovery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Link to="/workspace">
                  Open the workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link to="/datasets">Browse 6 sample datasets</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                ["6", "disorders"],
                ["90+", "curated genes"],
                ["24", "pathway terms"],
                ["100%", "browser-native"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl text-white">{n}</div>
                  <div className="text-xs uppercase tracking-wider text-white/50">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="container py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Built for</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">One platform, four audiences.</h2>
          <p className="mt-4 text-muted-foreground">
            Whether you're teaching first-year biology or prioritizing drug targets,
            the workspace adapts to your workflow.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Features */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">What's new in v2</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
              Faster. Friendlier.<br /> Anywhere you work.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Datasets preview */}
      <section className="container py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Sample data</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Jump straight into a disorder.</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/datasets">View all datasets <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{d.description}</p>
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

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-10 md:p-16 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white">
                Ready to explore your network?
              </h2>
              <p className="mt-4 text-white/70">
                Open the workspace, pick a disorder, and start interrogating the biology.
                No account required.
              </p>
              <Button size="lg" asChild className="mt-8 bg-white text-primary hover:bg-white/90">
                <Link to="/workspace">Launch workspace <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">NetworkAnalyst.ca</span>
            <span>· Biological networks, decoded.</span>
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
