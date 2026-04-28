import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { datasets } from "@/data/datasets";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Datasets = () => {
  return (
    <AppLayout>
      <div className="container py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Reference cohorts</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Curated transcriptomic starting points</h1>
          <p className="mt-3 text-muted-foreground">
            Six pre-loaded disorder programs spanning neurodegeneration, metabolism, oncology, cardiovascular disease, and infection. Each cohort is tuned to demonstrate how the analyzer moves from signal to network-level interpretation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((d) => (
            <Link key={d.id} to={`/workspace?dataset=${d.id}`}>
              <Card className="h-full border-border/60 transition-smooth hover:border-primary/40 hover:shadow-elegant hover:-translate-y-0.5 group">
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
                  <h3 className="mt-4 font-display text-2xl font-semibold">{d.name}</h3>
                  <p className="mt-1 text-xs font-mono text-muted-foreground">{d.source}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{d.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span><span className="font-semibold text-foreground">{d.genes.length}</span> DEGs</span>
                      <span><span className="font-semibold text-foreground">{d.edges.length}</span> edges</span>
                      <span><span className="font-semibold text-foreground">{d.pathways.length}</span> pathways</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary transition-spring group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Datasets;
