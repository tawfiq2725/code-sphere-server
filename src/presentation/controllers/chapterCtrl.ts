import { FileUploadService } from "../../application/services/filesUpload";
import {
  CreateChapter,
  EditChapter,
  GetChapter,
} from "../../application/usecases/Chapter";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { Request, Response } from "express";
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import User from "../../infrastructure/database/userSchema"; // Import User model
import { getUrl } from "../../utils/getUrl";

export class ChapterCtrl {
  constructor(
    private create: CreateChapter,
    private edit: EditChapter,
    private getC: GetChapter,
    private file: FileUploadService
  ) {}

  public async addChapter(req: MulterRequest, res: Response): Promise<void> {
    try {
      const { courseId, chapterName, chapterDescription } = req.body;
      const video = req.file;
      if (!courseId || !chapterName || !chapterDescription || !video) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "All fields are required",
          false
        );
        return;
      }

      const videoUrl = await this.file.uploadCourseVideo(courseId, video);

      if (!videoUrl) {
        sendResponseJson(
          res,
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to upload video",
          false
        );
        return;
      }

      const chapterData = {
        courseId,
        chapterName,
        chapterDescription,
        video: videoUrl,
        status: true,
      };
      await this.create.execute(chapterData);

      await User.updateMany(
        { "courseProgress.courseId": courseId },
        {
          $inc: { "courseProgress.$.totalChapters": 1 },
        }
      );

      sendResponseJson(
        res,
        HttpStatus.CREATED,
        "Chapter added successfully and course progress updated",
        true
      );
    } catch (error) {
      console.error("Error in adding chapter:", error);
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to add chapter",
        false
      );
    }
  }

  public async getChapter(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;

      if (!courseId) {
        sendResponseJson(
          res,
          HttpStatus.BAD_REQUEST,
          "Course id is required",
          false
        );
        return;
      }

      const chapters = await this.getC.execute(courseId);
      if (!chapters) {
        sendResponseJson(res, HttpStatus.NOT_FOUND, "No chapters found", false);
        return;
      }
      for (let chapter of chapters) {
        chapter.video = await getUrl(chapter.video);
      }
      sendResponseJson(res, HttpStatus.OK, "Chapters found", true, chapters);
    } catch (error) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to get chapters",
        false
      );
    }
  }
  public async updateChapter(req: Request, res: Response): Promise<void> {
    try {
      const { chapterId } = req.params;

      const updates = req.body;
      const file = req.file;

      if (file) {
        const videoUrl = await this.file.uploadCourseVideo(chapterId, file);
        updates.video = videoUrl;
        updates.status = true;
      }

      await this.edit.execute(chapterId, updates);

      sendResponseJson(
        res,
        HttpStatus.OK,
        "Chapter updated successfully",
        true
      );
    } catch (err: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        err.message,
        false
      );
    }
  }
}
