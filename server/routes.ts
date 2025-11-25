import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { studentScoreSchema } from "@shared/schema";
import { z } from "zod";

const AI_FEEDBACK_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

const aiFeedbackRequestSchema = z.object({
  question: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

async function getAIFeedback(question: string, isCorrect: boolean, explanation?: string): Promise<any> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    console.warn("HUGGINGFACE_API_KEY not set, returning fallback feedback");
    return getFallbackFeedback(isCorrect);
  }

  try {
    const prompt = isCorrect
      ? `As a helpful teacher, provide a brief challenging follow-up question related to: "${question}". Keep it under 50 words and make it slightly harder. Format: Just the question, no introduction.`
      : `As a helpful teacher, provide a brief remedial explanation and hint for this incorrect answer to: "${question}". ${explanation ? `The correct explanation is: ${explanation}.` : ''} Keep it under 60 words. Format: Explanation, then "Hint: [your hint]"`;

    const response = await fetch(AI_FEEDBACK_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      console.error("Hugging Face API error:", response.status);
      return getFallbackFeedback(isCorrect);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || "";

    if (isCorrect) {
      return {
        type: "challenge",
        content: generatedText.trim() || "Can you apply this concept to solve a real-world problem?",
      };
    } else {
      const parts = generatedText.split("Hint:");
      return {
        type: "remedial",
        content: parts[0]?.trim() || "Let's review the key concepts again.",
        hint: parts[1]?.trim() || "Try breaking down the problem into smaller steps.",
      };
    }
  } catch (error) {
    console.error("AI feedback error:", error);
    return getFallbackFeedback(isCorrect);
  }
}

function getFallbackFeedback(isCorrect: boolean) {
  if (isCorrect) {
    const challenges = [
      "Can you think of a real-life situation where you would use this concept?",
      "How would you explain this concept to a friend who hasn't learned it yet?",
      "What if the numbers were larger? Would the same principle apply?",
    ];
    return {
      type: "challenge",
      content: challenges[Math.floor(Math.random() * challenges.length)],
    };
  } else {
    const remedial = [
      {
        content: "Let's break this down step by step. Take your time to review the lesson content again.",
        hint: "Focus on understanding the basic definition before moving to examples.",
      },
      {
        content: "Don't worry! Making mistakes is part of learning. Let's review the key concepts.",
        hint: "Try visualizing the problem with pictures or diagrams.",
      },
      {
        content: "This concept can be tricky. Remember to read each part of the question carefully.",
        hint: "Start with what you know, then work your way to what you're solving for.",
      },
    ];
    return {
      type: "remedial",
      ...remedial[Math.floor(Math.random() * remedial.length)],
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/sync", async (req, res) => {
    try {
      const validatedData = studentScoreSchema.parse(req.body);
      await storage.saveScore(validatedData);
      
      const dashboardData = await storage.getDashboardData();
      
      res.json({
        success: true,
        message: "Score synced successfully",
        dashboardData,
      });
    } catch (error) {
      console.error("Sync error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to sync score",
      });
    }
  });

  app.get("/api/dashboard", async (req, res) => {
    try {
      const dashboardData = await storage.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to fetch dashboard data",
      });
    }
  });

  app.post("/api/ai-feedback", async (req, res) => {
    try {
      const { question, isCorrect, explanation } = aiFeedbackRequestSchema.parse(req.body);
      const feedback = await getAIFeedback(question, isCorrect, explanation);
      res.json(feedback);
    } catch (error) {
      console.error("AI feedback error:", error);
      res.status(500).json({
        type: isCorrect ? "challenge" : "remedial",
        content: "Keep up the good work!",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
