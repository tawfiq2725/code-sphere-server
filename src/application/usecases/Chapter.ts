import { Chapter } from "../../domain/entities/Chapter";
import { ChapterInterface } from "../../domain/interface/Chapter";

export class CreateChapter {
  constructor(private chapterRepository: ChapterInterface) {}
  public async execute(chapterData: Omit<Chapter, "id">): Promise<Chapter> {
    const newChapter = new Chapter(
      chapterData.courseId,
      chapterData.chapterName,
      chapterData.chapterDescription,
      chapterData.video,
      chapterData.status
    );

    return this.chapterRepository.create(newChapter);
  }
}

export class GetChapter {
  constructor(private chapterRepository: ChapterInterface) {}
  public async execute(courseId: string): Promise<any> {
    const chapters = await this.chapterRepository.getCallChapter(courseId);
    return chapters;
  }
}

export class EditChapter {
  constructor(private chapterRepository: ChapterInterface) {}
  public async execute(chapterId: string, updates: Partial<any>): Promise<any> {
    const existingChapter = await this.chapterRepository.findByIdChapterOne(
      chapterId
    );
    if (!existingChapter) {
      throw new Error("Chapter not found");
    }

    const updatedChapter = await this.chapterRepository.updateChapter(
      chapterId,
      updates
    );
    return updatedChapter;
  }
}
