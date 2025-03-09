import { ChapterInterface } from "../../domain/interface/Chapter";
import { Chapter } from "../../domain/entities/Chapter";
import ChapterS from "../database/chapterSchema";
export class ChapterRepository implements ChapterInterface {
  public async create(chapter: Chapter): Promise<Chapter> {
    try {
      return await ChapterS.create(chapter);
    } catch (err) {
      console.log(err);
      throw new Error("Something wrong chapter while creating");
    }
  }
  public async findByIdChapterOne(id: string): Promise<Chapter | null> {
    try {
      return await ChapterS.findById(id);
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  public async findChapterById(id: string): Promise<Chapter | null> {
    try {
      return await ChapterS.findOne({ courseId: id });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async getCallChapter(id: string): Promise<any> {
    try {
      return await ChapterS.find({ courseId: id });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async updateChapter(id: string, chapter: any): Promise<any> {
    try {
      return await ChapterS.findByIdAndUpdate(id, chapter, {
        new: true,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
  public async deleteChapter(id: string): Promise<Chapter | null> {
    try {
      return await ChapterS.findByIdAndDelete(id);
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  }
}
