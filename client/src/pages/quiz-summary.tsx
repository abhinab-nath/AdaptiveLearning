import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, Home } from "lucide-react";
import type { QuizAttempt, Chapter } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface QuizSummaryProps {
  chapter: Chapter;
  attempt: QuizAttempt;
  onTryAgain: () => void;
  onBackToHome: () => void;
}

export default function QuizSummary({
  chapter,
  attempt,
  onTryAgain,
  onBackToHome,
}: QuizSummaryProps) {
  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const wrongCount = attempt.totalQuestions - correctCount;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-600";
    return "text-destructive";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent work!";
    if (score >= 60) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <p className="text-sm text-muted-foreground">
            {chapter.title} - Grade {chapter.grade}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(attempt.score)}`}>
                {attempt.score}%
              </div>
              <p className="text-xl font-semibold">{getScoreMessage(attempt.score)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-questions">
                {attempt.totalQuestions}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Correct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500" data-testid="text-correct-answers">
                {correctCount}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                Incorrect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive" data-testid="text-wrong-answers">
                {wrongCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attempt.answers.map((answer, index) => (
              <div
                key={answer.questionId}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                data-testid={`result-question-${index + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    answer.isCorrect ? "bg-green-500/10" : "bg-destructive/10"
                  }`}>
                    {answer.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <span className="font-medium">Question {index + 1}</span>
                </div>
                <Badge variant={answer.isCorrect ? "default" : "secondary"}>
                  {answer.isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={onTryAgain}
            data-testid="button-try-again"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={onBackToHome}
            data-testid="button-home"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>

        {attempt.score < 60 && (
          <Card className="border-yellow-600/20 bg-yellow-600/5">
            <CardContent className="py-6">
              <p className="text-sm text-center">
                💡 <strong>Tip:</strong> Review the lesson again to improve your understanding, 
                then try the quiz once more. Practice makes perfect!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
