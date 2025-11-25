import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3 } from "lucide-react";
import type { Grade, Chapter, QuizAttempt, AIFeedback, QuizQuestion } from "@shared/schema";
import { dbManager } from "@/lib/indexeddb";
import { LESSON_CONTENT, QUIZZES } from "@/lib/content-data";
import { OfflineIndicator, useOnlineStatus } from "@/components/offline-indicator";
import { useToast } from "@/hooks/use-toast";

import GradeSelection from "@/pages/grade-selection";
import ChapterSelection from "@/pages/chapter-selection";
import DownloadContent from "@/pages/download-content";
import LessonViewer from "@/pages/lesson-viewer";
import Quiz from "@/pages/quiz";
import QuizSummary from "@/pages/quiz-summary";
import TeacherDashboard from "@/pages/teacher-dashboard";

type AppState =
  | { screen: "grade-selection" }
  | { screen: "chapter-selection"; grade: Grade }
  | { screen: "downloading"; grade: Grade; chapter: Chapter }
  | { screen: "lesson"; grade: Grade; chapter: Chapter }
  | { screen: "quiz"; grade: Grade; chapter: Chapter }
  | { screen: "summary"; grade: Grade; chapter: Chapter; attempt: QuizAttempt }
  | { screen: "teacher-dashboard" };

function App() {
  const [state, setState] = useState<AppState>({ screen: "grade-selection" });
  const [downloadedChapters, setDownloadedChapters] = useState<Set<string>>(new Set());
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    dbManager.init().catch(console.error);
  }, []);

  useEffect(() => {
    if (isOnline) {
      syncPendingAttempts();
    }
  }, [isOnline]);

  const syncPendingAttempts = async () => {
    try {
      const attempts = await dbManager.getPendingAttempts();
      if (attempts.length === 0) return;

      for (const attempt of attempts) {
        const response = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: attempt.studentId || `Student ${Math.floor(Math.random() * 1000)}`,
            grade: attempt.grade,
            chapter: attempt.chapterId,
            score: attempt.score,
            timestamp: attempt.timestamp,
          }),
        });

        if (response.ok) {
          console.log("Synced attempt:", attempt.chapterId);
        }
      }

      await dbManager.clearAttempts();
      
      toast({
        title: "Synced successfully",
        description: `${attempts.length} quiz result${attempts.length > 1 ? 's' : ''} uploaded to server`,
      });
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  const handleSelectGrade = (grade: Grade) => {
    setState({ screen: "chapter-selection", grade });
  };

  const handleSelectChapter = async (chapter: Chapter) => {
    const existingLesson = await dbManager.getLesson(chapter.id);
    
    if (existingLesson) {
      setState({ screen: "lesson", grade: chapter.grade, chapter });
    } else {
      setState({ screen: "downloading", grade: chapter.grade, chapter });
    }
  };

  const handleDownloadComplete = async () => {
    if (state.screen !== "downloading") return;

    const lesson = LESSON_CONTENT[state.chapter.id];
    const quiz = QUIZZES[state.chapter.id];

    if (lesson && quiz) {
      await dbManager.saveLesson(lesson);
      await dbManager.saveQuiz(quiz);
      
      setDownloadedChapters(prev => new Set(prev).add(state.chapter.id));
      
      setState({ screen: "lesson", grade: state.grade, chapter: state.chapter });
    }
  };

  const handleStartQuiz = () => {
    if (state.screen === "lesson") {
      setState({ screen: "quiz", grade: state.grade, chapter: state.chapter });
    }
  };

  const handleQuizComplete = async (answers: any[], score: number) => {
    if (state.screen !== "quiz") return;

    const attempt: QuizAttempt = {
      chapterId: state.chapter.id,
      grade: state.grade,
      answers,
      score,
      totalQuestions: answers.length,
      timestamp: Date.now(),
      studentId: `Student ${Math.floor(Math.random() * 1000)}`,
    };

    await dbManager.saveAttempt(attempt);

    if (isOnline) {
      try {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: attempt.studentId,
            grade: attempt.grade,
            chapter: state.chapter.id,
            score: attempt.score,
            timestamp: attempt.timestamp,
          }),
        });
        
        toast({
          title: "Score saved!",
          description: "Your results have been uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Saved offline",
          description: "Your score will sync when you're back online",
          variant: "default",
        });
      }
    } else {
      toast({
        title: "Saved offline",
        description: "Your score will sync when you're back online",
        variant: "default",
      });
    }

    setState({ screen: "summary", grade: state.grade, chapter: state.chapter, attempt });
  };

  const handleRequestFeedback = async (question: QuizQuestion, isCorrect: boolean): Promise<AIFeedback | null> => {
    if (!isOnline) {
      return null;
    }

    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          isCorrect,
          explanation: question.explanation,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const feedback = await response.json();
      return feedback;
    } catch (error) {
      console.error("Failed to get AI feedback:", error);
      return null;
    }
  };

  const handleBackToHome = () => {
    setState({ screen: "grade-selection" });
  };

  const handleTryAgain = () => {
    if (state.screen === "summary") {
      setState({ screen: "quiz", grade: state.grade, chapter: state.chapter });
    }
  };

  const handleBack = () => {
    if (state.screen === "chapter-selection") {
      setState({ screen: "grade-selection" });
    } else if (state.screen === "lesson" || state.screen === "quiz") {
      setState({ screen: "chapter-selection", grade: state.grade });
    } else if (state.screen === "teacher-dashboard") {
      setState({ screen: "grade-selection" });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OfflineIndicator />
        
        {state.screen === "grade-selection" && (
          <div>
            <div className="fixed top-4 right-4 z-20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setState({ screen: "teacher-dashboard" })}
                className="gap-2"
                data-testid="button-teacher-dashboard"
              >
                <BarChart3 className="w-4 h-4" />
                Teacher Dashboard
              </Button>
            </div>
            <GradeSelection onSelectGrade={handleSelectGrade} />
          </div>
        )}

        {state.screen === "chapter-selection" && (
          <ChapterSelection
            grade={state.grade}
            onSelectChapter={handleSelectChapter}
            onBack={handleBack}
            downloadedChapters={downloadedChapters}
          />
        )}

        {state.screen === "downloading" && (
          <DownloadContent
            chapter={state.chapter}
            onComplete={handleDownloadComplete}
            onError={(error) => {
              console.error(error);
              toast({
                title: "Download failed",
                description: error,
                variant: "destructive",
              });
            }}
          />
        )}

        {state.screen === "lesson" && (
          <LessonViewer
            chapter={state.chapter}
            lesson={LESSON_CONTENT[state.chapter.id]}
            onStartQuiz={handleStartQuiz}
            onBack={handleBack}
          />
        )}

        {state.screen === "quiz" && (
          <Quiz
            chapter={state.chapter}
            quiz={QUIZZES[state.chapter.id]}
            onComplete={handleQuizComplete}
            onBack={handleBack}
            onRequestFeedback={handleRequestFeedback}
          />
        )}

        {state.screen === "summary" && (
          <QuizSummary
            chapter={state.chapter}
            attempt={state.attempt}
            onTryAgain={handleTryAgain}
            onBackToHome={handleBackToHome}
          />
        )}

        {state.screen === "teacher-dashboard" && (
          <TeacherDashboard onBack={handleBack} />
        )}

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
