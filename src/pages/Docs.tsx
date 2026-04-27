import { AppLayout } from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Docs = () => {
  return (
    <AppLayout>
      <div className="container py-12 max-w-4xl">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">Documentation</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Get started in 60 seconds</h1>

        <ol className="mt-10 space-y-6">
          {[
            ["Pick a dataset", "Open the Datasets page and click any disorder. The workspace will load with curated DEGs and interactions."],
            ["Filter by fold change", "Drag the |log2FC| slider in the workspace to focus on the most differentially expressed genes."],
            ["Explore the network", "Hover or click any node to highlight its first-degree neighbours and trace pathway membership."],
            ["Inspect pathways", "Switch to the Pathways tab in the right sidebar to see KEGG / Reactome / GO terms ranked by adjusted p-value."],
            ["Export your view", "Use the Export button to download the filtered DEG table as CSV for downstream analysis."],
          ].map(([t, body], i) => (
            <li key={t} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-display font-semibold shadow-glow">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Card className="mt-12 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold">Install the app</h3>
              <p className="text-sm text-muted-foreground">Works offline. Add to home screen on iOS, Android, macOS, Windows.</p>
            </div>
            <Button asChild className="bg-gradient-primary shadow-glow">
              <Link to="/workspace">Open workspace <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Docs;
