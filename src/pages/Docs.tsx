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
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Run the platform in under a minute</h1>

        <ol className="mt-10 space-y-6">
          {[
            ["Choose a biological program", "Open any reference cohort to preload differentially expressed genes, interaction edges, and ranked pathways."],
            ["Focus the signal", "Use the absolute log2 fold-change threshold to remove background genes and concentrate the network on higher-amplitude changes."],
            ["Inspect interaction structure", "Hover or select nodes to highlight local neighbourhoods and understand which genes sit closest to the network core."],
            ["Review pathway evidence", "Open the Pathways tab to compare enriched mechanisms, overlap genes, and p-values without leaving the main workspace."],
            ["Export the current evidence slice", "Download the filtered DEG table as CSV when you want to reuse or share the exact state under discussion."],
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
              <h3 className="font-display text-xl font-semibold">Install the app shell</h3>
              <p className="text-sm text-muted-foreground">Keep the analyzer available offline for demos, teaching sessions, and quick review meetings across mobile and desktop.</p>
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
