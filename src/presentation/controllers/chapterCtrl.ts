import { FileUploadService } from "../../application/services/filesUpload";
import {
  CreateChapter,
  EditChapter,
  GetChapter,
} from "../../application/usecases/Chapter";
import { ChapterRepository } from "../../infrastructure/repositories/ChapterRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { Request, Response } from "express";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const addChapter = async (
  req: MulterRequest,
  res: Response
): Promise<any> => {
  try {
    console.log("entering the add chapter controller");
    const { courseId, chapterName, chapterDescription } = req.body;
    console.log("courseId", courseId);
    console.log("chapterName", chapterName);
    console.log("chapterDescription", chapterDescription);
    const video = req.file;
    if (!courseId || !chapterName || !chapterDescription || !video) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "All fields are required",
        false
      );
    }
    console.log("start video");
    const videoUrl = await new FileUploadService().uploadCourseVideo(
      courseId,
      video
    );

    if (!videoUrl) {
      return sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload video",
        false
      );
    }

    console.log("video uploaded");
    const chapterData = {
      courseId,
      chapterName,
      chapterDescription,
      video: videoUrl,
      status: true,
    };
    const repositories = new ChapterRepository();
    const chapter = new CreateChapter(repositories);
    await chapter.execute(chapterData);
    console.log("chapter added successfully");
    return sendResponseJson(
      res,
      HttpStatus.CREATED,
      "Chapter added successfully",
      true
    );
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to add chapter",
      false
    );
  }
};
export const getChapter = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;

    if (!courseId) {
      return sendResponseJson(
        res,
        HttpStatus.BAD_REQUEST,
        "Course id is required",
        false
      );
    }
    const repositories = new ChapterRepository();
    const chapter = new GetChapter(repositories);
    const chapters = await chapter.execute(courseId);
    if (!chapters) {
      return sendResponseJson(
        res,
        HttpStatus.NOT_FOUND,
        "No chapters found",
        false
      );
    }
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Chapters found",
      true,
      chapters
    );
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get chapters",
      false
    );
  }
};
export const updateChapter = async (req: Request, res: Response) => {
  const { chapterId } = req.params;

  const updates = req.body;
  const file = req.file;

  if (file) {
    const videoUrl = await new FileUploadService().uploadCourseVideo(
      chapterId,
      file
    );
    updates.video = videoUrl;
    updates.status = true;
  }

  const repository = new ChapterRepository();
  const chapter = new EditChapter(repository);
  await chapter.execute(chapterId, updates);

  return sendResponseJson(
    res,
    HttpStatus.OK,
    "Chapter updated successfully",
    true
  );
};
export const deleteChapter = async (req: Request, res: Response) => {};
