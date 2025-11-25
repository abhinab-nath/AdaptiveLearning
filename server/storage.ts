import { type InsertStudentScore, type DashboardData } from "@shared/schema";
import { promises as fs } from "fs";
import path from "path";

export interface IStorage {
  saveScore(score: InsertStudentScore): Promise<void>;
  getDashboardData(): Promise<DashboardData>;
}

const SCORES_FILE = path.join(process.cwd(), "scores.json");

export class FileStorage implements IStorage {
  private async ensureScoresFile(): Promise<void> {
    try {
      await fs.access(SCORES_FILE);
    } catch {
      await fs.writeFile(SCORES_FILE, JSON.stringify({}));
    }
  }

  private async readScores(): Promise<DashboardData> {
    await this.ensureScoresFile();
    const content = await fs.readFile(SCORES_FILE, "utf-8");
    return JSON.parse(content);
  }

  private async writeScores(data: DashboardData): Promise<void> {
    await fs.writeFile(SCORES_FILE, JSON.stringify(data, null, 2));
  }

  async saveScore(score: InsertStudentScore): Promise<void> {
    const scores = await this.readScores();
    const key = `grade${score.grade}${score.chapter.replace(/\s+/g, "")}`;

    if (!scores[key]) {
      scores[key] = [];
    }

    scores[key].push({
      student: score.studentId,
      score: score.score,
      timestamp: score.timestamp,
    });

    await this.writeScores(scores);
  }

  async getDashboardData(): Promise<DashboardData> {
    return await this.readScores();
  }
}

export const storage = new FileStorage();
