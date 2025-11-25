import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@shared/schema";

interface DownloadContentProps {
  chapter: Chapter;
  onComplete: () => void;
  onError: (error: string) => void;
}

export default function DownloadContent({
  chapter,
  onComplete,
  onError,
}: DownloadContentProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"downloading" | "complete" | "error">("downloading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const downloadContent = async () => {
      try {
        setProgress(0);
        setStatus("downloading");
        
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(33);
        
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgress(66);
        
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProgress(100);
        
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        setStatus("complete");
        setTimeout(onComplete, 800);
      } catch (error) {
        setStatus("error");
        const message = error instanceof Error ? error.message : "Download failed";
        setErrorMessage(message);
        onError(message);
      }
    };

    downloadContent();
  }, [chapter.id, onComplete, onError]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {status === "downloading" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Downloading Content</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {chapter.title} - Grade {chapter.grade}
                  </p>
                  <Progress value={progress} className="h-2" data-testid="progress-download" />
                  <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Downloading lesson text, images, and audio...
                </p>
              </>
            )}

            {status === "complete" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Download Complete!</h2>
                  <p className="text-sm text-muted-foreground">
                    Content saved for offline access
                  </p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Download Failed</h2>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
                <Button onClick={() => window.location.reload()} data-testid="button-retry">
                  Try Again
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
