import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpenCheck, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Grade, Chapter } from "@shared/schema";
import { CHAPTERS } from "@/lib/content-data";

interface ChapterSelectionProps {
  grade: Grade;
  onSelectChapter: (chapter: Chapter) => void;
  onBack: () => void;
  downloadedChapters: Set<string>;
}

export default function ChapterSelection({
  grade,
  onSelectChapter,
  onBack,
  downloadedChapters,
}: ChapterSelectionProps) {
  const chapters = CHAPTERS.filter((c) => c.grade === grade);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Grade {grade}</h1>
            <p className="text-sm text-muted-foreground">Choose a chapter to study</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4">
          {chapters.map((chapter) => {
            const isDownloaded = downloadedChapters.has(chapter.id);
            
            return (
              <Card
                key={chapter.id}
                className="hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => onSelectChapter(chapter)}
                data-testid={`card-chapter-${chapter.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpenCheck className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl">{chapter.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {chapter.subject}
                      </CardDescription>
                    </div>
                    {isDownloaded && (
                      <Badge variant="secondary" className="gap-1">
                        <Download className="w-3 h-3" />
                        Downloaded
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full md:w-auto"
                    data-testid={`button-open-chapter-${chapter.id}`}
                  >
                    {isDownloaded ? "Open Lesson" : "Download & Start"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {chapters.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No chapters available for this grade yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
