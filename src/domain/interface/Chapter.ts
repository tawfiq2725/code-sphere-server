import { Chapter } from "../entities/Chapter";

export interface ChapterInterface {
  create(chapter: Chapter): Promise<Chapter>;
  findChapterById(id: string): Promise<Chapter | null>;
  getAllChapters(): Promise<Chapter[]>;
  updateChapter(id: string, chapter: Chapter): Promise<Chapter | null>;
  deleteChapter(id: string): Promise<Chapter | null>;
}
