import type { Chapter, LessonContent, Quiz } from "@shared/schema";
import fractionsImage from "@assets/generated_images/fractions_learning_visual_diagram.png";

export const CHAPTERS: Chapter[] = [
  {
    id: "grade6-fractions",
    grade: 6,
    title: "Fractions",
    subject: "Mathematics",
  },
  {
    id: "grade7-fractions",
    grade: 7,
    title: "Fractions and Decimals",
    subject: "Mathematics",
  },
  {
    id: "grade8-fractions",
    grade: 8,
    title: "Rational Numbers",
    subject: "Mathematics",
  },
];

export const LESSON_CONTENT: Record<string, LessonContent> = {
  "grade6-fractions": {
    chapterId: "grade6-fractions",
    text: `# Understanding Fractions

A fraction represents a part of a whole. When we divide something into equal parts, each part is a fraction of the whole.

## Key Concepts:

**Numerator**: The top number shows how many parts we have.
**Denominator**: The bottom number shows how many equal parts the whole is divided into.

### Examples:

- **1/2** means 1 out of 2 equal parts (one half)
- **1/4** means 1 out of 4 equal parts (one quarter)
- **3/4** means 3 out of 4 equal parts (three quarters)

## Visual Understanding:

When you cut a pizza into 4 equal slices and take 1 slice, you have 1/4 of the pizza. If you take 3 slices, you have 3/4 of the pizza.

Practice thinking about fractions in everyday life - sharing food, dividing time, or measuring ingredients!`,
    imageUrl: fractionsImage,
    audioUrl: "/audio/fractions-lesson.mp3",
  },
  "grade7-fractions": {
    chapterId: "grade7-fractions",
    text: `# Fractions and Decimals

Fractions and decimals are two ways to represent parts of a whole. Understanding how they relate helps in solving many real-world problems.

## Converting Fractions to Decimals:

To convert a fraction to a decimal, divide the numerator by the denominator.

### Examples:

- **1/2 = 0.5** (1 divided by 2)
- **1/4 = 0.25** (1 divided by 4)
- **3/4 = 0.75** (3 divided by 4)

## Comparing Values:

Decimals make it easier to compare fractions. Which is bigger: 3/5 or 2/3?

Convert to decimals:
- 3/5 = 0.6
- 2/3 = 0.666...

So 2/3 is slightly larger than 3/5!`,
    imageUrl: fractionsImage,
    audioUrl: "/audio/fractions-lesson.mp3",
  },
  "grade8-fractions": {
    chapterId: "grade8-fractions",
    text: `# Rational Numbers

Rational numbers include all fractions, whole numbers, and their negatives. They can be expressed as a ratio of two integers.

## What are Rational Numbers?

A rational number is any number that can be written as p/q where:
- p and q are integers
- q ≠ 0 (we cannot divide by zero)

### Examples of Rational Numbers:

- **5** can be written as 5/1
- **-3** can be written as -3/1
- **0.5** can be written as 1/2
- **0.333...** can be written as 1/3

## Operations with Rational Numbers:

When adding or subtracting fractions, find a common denominator first. When multiplying, multiply numerators together and denominators together.

Understanding rational numbers is essential for algebra and advanced mathematics!`,
    imageUrl: fractionsImage,
    audioUrl: "/audio/fractions-lesson.mp3",
  },
};

export const QUIZZES: Record<string, Quiz> = {
  "grade6-fractions": {
    chapterId: "grade6-fractions",
    questions: [
      {
        id: "grade6-q1",
        question: "What does the numerator in a fraction represent?",
        options: [
          "The total number of equal parts",
          "How many parts we have",
          "The size of each part",
          "The whole number",
        ],
        correctAnswer: 1,
        explanation: "The numerator (top number) shows how many parts we have out of the total.",
      },
      {
        id: "grade6-q2",
        question: "If you eat 2 slices of a pizza cut into 8 equal slices, what fraction did you eat?",
        options: ["1/8", "2/8", "2/6", "1/4"],
        correctAnswer: 1,
        explanation: "You ate 2 out of 8 slices, which is 2/8. This can also be simplified to 1/4.",
      },
      {
        id: "grade6-q3",
        question: "Which fraction is larger: 1/2 or 1/4?",
        options: ["1/4", "1/2", "They are equal", "Cannot be determined"],
        correctAnswer: 1,
        explanation: "1/2 means half of something, while 1/4 means a quarter. Half is larger than a quarter.",
      },
    ],
  },
  "grade7-fractions": {
    chapterId: "grade7-fractions",
    questions: [
      {
        id: "grade7-q1",
        question: "What is 3/4 as a decimal?",
        options: ["0.25", "0.5", "0.75", "0.8"],
        correctAnswer: 2,
        explanation: "3/4 = 3 ÷ 4 = 0.75",
      },
      {
        id: "grade7-q2",
        question: "Which is larger: 0.6 or 2/3?",
        options: ["0.6", "2/3", "They are equal", "Cannot be determined"],
        correctAnswer: 1,
        explanation: "2/3 = 0.666..., which is slightly larger than 0.6",
      },
      {
        id: "grade7-q3",
        question: "Convert 0.5 to a fraction:",
        options: ["1/5", "1/2", "5/10", "Both B and C"],
        correctAnswer: 3,
        explanation: "0.5 = 1/2, which is also equal to 5/10. Both represent the same value.",
      },
    ],
  },
  "grade8-fractions": {
    chapterId: "grade8-fractions",
    questions: [
      {
        id: "grade8-q1",
        question: "Which of these is NOT a rational number?",
        options: ["5", "-3/4", "0", "√2"],
        correctAnswer: 3,
        explanation: "√2 is irrational because it cannot be expressed as a ratio of two integers. It's approximately 1.414...",
      },
      {
        id: "grade8-q2",
        question: "Express 0.333... as a fraction:",
        options: ["1/3", "3/10", "33/100", "1/30"],
        correctAnswer: 0,
        explanation: "The repeating decimal 0.333... equals exactly 1/3.",
      },
      {
        id: "grade8-q3",
        question: "What is -5 expressed as a rational number?",
        options: ["-5/1", "5/-1", "Both A and B", "Cannot be expressed"],
        correctAnswer: 2,
        explanation: "Both -5/1 and 5/-1 equal -5, so both are correct representations.",
      },
    ],
  },
};
