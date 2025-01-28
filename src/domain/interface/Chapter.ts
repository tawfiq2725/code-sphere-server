import { Chapter } from "../entities/Chapter";

export interface ChapterInterface {
  create(chapter: Chapter): Promise<Chapter>;
  findChapterById(id: string): Promise<Chapter | null>;
  findByIdChapterOne(id: string): Promise<Chapter | null>;
  getCallChapter(id: string): Promise<any>;
  updateChapter(id: string, chapter: any): Promise<any>;
  deleteChapter(id: string): Promise<Chapter | null>;
}
