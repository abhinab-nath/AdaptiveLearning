import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Quiz as QuizType, QuizQuestion, StudentAnswer, Chapter, AIFeedback } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface QuizProps {
  chapter: Chapter;
  quiz: QuizType;
  onComplete: (answers: StudentAnswer[], score: number) => void;
  onBack: () => void;
  onRequestFeedback: (question: QuizQuestion, isCorrect: boolean) => Promise<AIFeedback | null>;
}

export default function Quiz({
  chapter,
  quiz,
  onComplete,
  onBack,
  onRequestFeedback,
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (!showFeedback) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const answer: StudentAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timestamp: Date.now(),
    };

    setAnswers([...answers, answer]);
    setShowFeedback(true);

    setLoadingFeedback(true);
    const feedback = await onRequestFeedback(currentQuestion, isCorrect);
    setAiFeedback(feedback);
    setLoadingFeedback(false);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const totalCorrect = answers.filter((a) => a.isCorrect).length;
      const score = Math.round((totalCorrect / quiz.questions.length) * 100);
      
      onComplete(answers, score);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAiFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{chapter.title} Quiz</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-quiz" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl flex-1">
                {currentQuestion.question}
              </CardTitle>
              <Badge variant="secondary">
                {currentQuestionIndex + 1}/{quiz.questions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showCorrectness = showFeedback;

              let variant: "outline" | "default" | "secondary" = "outline";
              let icon = null;

              if (showCorrectness) {
                if (isCorrect) {
                  variant = "default";
                  icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                } else if (isSelected && !isCorrect) {
                  variant = "secondary";
                  icon = <XCircle className="w-5 h-5 text-destructive" />;
                }
              }

              return (
                <Button
                  key={index}
                  variant={isSelected && !showCorrectness ? "default" : variant}
                  className={`w-full text-left justify-start min-h-12 h-auto py-3 px-4 ${
                    showCorrectness && isCorrect ? "bg-green-500/10 border-green-500 hover:bg-green-500/20" : ""
                  } ${
                    showCorrectness && isSelected && !isCorrect ? "bg-destructive/10 border-destructive" : ""
                  }`}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showFeedback}
                  data-testid={`button-option-${index}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0">
                      {icon || String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {showFeedback && currentQuestion.explanation && (
          <Card className="mt-4 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Explanation</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showFeedback && loadingFeedback && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Getting AI feedback...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {showFeedback && aiFeedback && !loadingFeedback && (
          <Card className="mt-4 border-accent/40 bg-accent/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">✨</span>
                {aiFeedback.type === 'remedial' ? 'Need Help?' : 'Challenge Yourself!'}
              </h3>
              <p className="text-sm mb-3">{aiFeedback.content}</p>
              {aiFeedback.hint && (
                <div className="mt-3 p-3 bg-background/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Hint:</strong> {aiFeedback.hint}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex gap-3">
          {!showFeedback ? (
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              data-testid="button-submit-answer"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleNext}
              data-testid="button-next-question"
            >
              {isLastQuestion ? "View Results" : "Next Question"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
