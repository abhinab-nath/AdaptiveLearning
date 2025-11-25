import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, Award, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardData } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface TeacherDashboardProps {
  onBack: () => void;
}

export default function TeacherDashboard({ onBack }: TeacherDashboardProps) {
  const { data: dashboardData, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const allScores = dashboardData ? Object.values(dashboardData).flat() : [];
  const totalStudents = new Set(allScores.map((s) => s.student)).size;
  const averageScore = allScores.length > 0
    ? Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length)
    : 0;
  const topPerformers = allScores.filter((s) => s.score >= 80).length;

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">Monitor student performance</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="text-total-students">
                    {totalStudents}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="text-average-score">
                    {averageScore}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="text-top-performers">
                    {topPerformers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Scored 80% or above</p>
                </CardContent>
              </Card>
            </div>

            {Object.entries(dashboardData || {}).map(([key, scores]) => {
              const [grade, chapter] = key.split(/(?=[A-Z])/);
              
              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {grade.replace('grade', 'Grade ')} - {chapter}
                      </span>
                      <Badge variant="secondary">{scores.length} attempts</Badge>
                    </CardTitle>
                    <CardDescription>Recent quiz submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scores.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No submissions yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {scores.map((score, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            data-testid={`score-entry-${index}`}
                          >
                            <div className="flex-1">
                              <p className="font-medium">{score.student}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(score.timestamp).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <Badge variant={getScoreBadgeVariant(score.score)}>
                              {score.score}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {allScores.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Student quiz results will appear here once they complete their assessments.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
