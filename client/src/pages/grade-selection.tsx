import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap } from "lucide-react";
import type { Grade } from "@shared/schema";
import classroomImage from "@assets/generated_images/rural_classroom_learning_scene.png";

interface GradeSelectionProps {
  onSelectGrade: (grade: Grade) => void;
}

export default function GradeSelection({ onSelectGrade }: GradeSelectionProps) {
  const grades: Grade[] = [6, 7, 8];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <img
          src={classroomImage}
          alt="Students learning"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <GraduationCap className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Adaptive Learning</h1>
            <p className="text-lg md:text-xl">Select your grade to begin</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {grades.map((grade) => (
            <Card
              key={grade}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => onSelectGrade(grade)}
              data-testid={`card-grade-${grade}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Grade {grade}</CardTitle>
                <CardDescription className="text-base">
                  {grade === 6 && "Introduction to Fractions"}
                  {grade === 7 && "Fractions & Decimals"}
                  {grade === 8 && "Rational Numbers"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  className="w-full"
                  size="lg"
                  data-testid={`button-select-grade-${grade}`}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground">
                <strong>Note:</strong> Lessons can be downloaded for offline learning. 
                Your progress will sync automatically when you're back online.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
