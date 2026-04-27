import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export const InstallButton = () => {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed || !evt) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:inline-flex gap-1.5"
      onClick={async () => {
        await evt.prompt();
        const choice = await evt.userChoice;
        if (choice.outcome === "accepted") toast.success("Installed!");
        setEvt(null);
      }}
    >
      <Download className="h-3.5 w-3.5" /> Install app
    </Button>
  );
};
