import type { LessonContent, Quiz, QuizAttempt } from "@shared/schema";

const DB_NAME = "AdaptiveLearningDB";
const DB_VERSION = 1;

const STORES = {
  LESSONS: "lessons",
  QUIZZES: "quizzes",
  ATTEMPTS: "attempts",
  IMAGES: "images",
  AUDIO: "audio",
} as const;

export class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.LESSONS)) {
          db.createObjectStore(STORES.LESSONS, { keyPath: "chapterId" });
        }
        if (!db.objectStoreNames.contains(STORES.QUIZZES)) {
          db.createObjectStore(STORES.QUIZZES, { keyPath: "chapterId" });
        }
        if (!db.objectStoreNames.contains(STORES.ATTEMPTS)) {
          const attemptStore = db.createObjectStore(STORES.ATTEMPTS, { autoIncrement: true });
          attemptStore.createIndex("chapterId", "chapterId", { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.IMAGES)) {
          db.createObjectStore(STORES.IMAGES, { keyPath: "url" });
        }
        if (!db.objectStoreNames.contains(STORES.AUDIO)) {
          db.createObjectStore(STORES.AUDIO, { keyPath: "url" });
        }
      };
    });
  }

  async saveLesson(lesson: LessonContent): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LESSONS], "readwrite");
      const store = transaction.objectStore(STORES.LESSONS);
      const request = store.put(lesson);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLesson(chapterId: string): Promise<LessonContent | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LESSONS], "readonly");
      const store = transaction.objectStore(STORES.LESSONS);
      const request = store.get(chapterId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveQuiz(quiz: Quiz): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUIZZES], "readwrite");
      const store = transaction.objectStore(STORES.QUIZZES);
      const request = store.put(quiz);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getQuiz(chapterId: string): Promise<Quiz | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.QUIZZES], "readonly");
      const store = transaction.objectStore(STORES.QUIZZES);
      const request = store.get(chapterId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAttempt(attempt: QuizAttempt): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ATTEMPTS], "readwrite");
      const store = transaction.objectStore(STORES.ATTEMPTS);
      const request = store.add(attempt);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingAttempts(): Promise<QuizAttempt[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ATTEMPTS], "readonly");
      const store = transaction.objectStore(STORES.ATTEMPTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAttempts(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.ATTEMPTS], "readwrite");
      const store = transaction.objectStore(STORES.ATTEMPTS);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveBlob(storeName: string, url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put({ url, blob });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getBlob(storeName: string, url: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbManager = new IndexedDBManager();
