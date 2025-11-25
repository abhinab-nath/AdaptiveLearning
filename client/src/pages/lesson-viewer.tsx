import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import type { LessonContent, Chapter } from "@shared/schema";
import ReactMarkdown from "react-markdown";

interface LessonViewerProps {
  chapter: Chapter;
  lesson: LessonContent;
  onStartQuiz: () => void;
  onBack: () => void;
}

export default function LessonViewer({
  chapter,
  lesson,
  onStartQuiz,
  onBack,
}: LessonViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
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
            <h1 className="text-xl font-bold">{chapter.title}</h1>
            <p className="text-sm text-muted-foreground">Grade {chapter.grade}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Audio Lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={toggleAudio}
                className="gap-2"
                data-testid="button-audio-toggle"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play Audio
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Listen to the lesson explanation
              </p>
            </div>
            <audio
              ref={audioRef}
              src={lesson.audioUrl}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <img
              src={lesson.imageUrl}
              alt="Lesson illustration"
              className="w-full max-h-64 object-contain rounded-lg mb-6"
              data-testid="img-lesson"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-slate max-w-none dark:prose-invert" data-testid="text-lesson-content">
              <ReactMarkdown>{lesson.text}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ready to practice?</h3>
                <p className="text-sm text-muted-foreground">
                  Test your understanding with a quick quiz
                </p>
              </div>
              <Button
                size="lg"
                onClick={onStartQuiz}
                className="w-full md:w-auto"
                data-testid="button-start-quiz"
              >
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
