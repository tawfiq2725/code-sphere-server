import { ChapterInterface } from "../../domain/interface/Chapter";
import { Chapter } from "../../domain/entities/Chapter";
import ChapterS from "../database/chapterSchema";
export class ChapterRepository implements ChapterInterface {
  public async create(chapter: Chapter): Promise<Chapter> {
    return await ChapterS.create(chapter);
  }
  public async findByIdChapterOne(id: string): Promise<Chapter | null> {
    return await ChapterS.findById(id);
  }

  public async findChapterById(id: string): Promise<Chapter | null> {
    return await ChapterS.findOne({ courseId: id });
  }
  public async getCallChapter(id: string): Promise<any> {
    return await ChapterS.find({ courseId: id });
  }
  public async updateChapter(id: string, chapter: any): Promise<any> {
    return await ChapterS.findByIdAndUpdate(id, chapter, {
      new: true,
    });
  }
  public async deleteChapter(id: string): Promise<Chapter | null> {
    return await ChapterS.findByIdAndDelete(id);
  }
}
