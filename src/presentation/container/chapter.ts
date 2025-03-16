import { ChapterRepository } from "../../infrastructure/repositories/ChapterRepository";
import { CreateChapter } from "../../application/usecases/Chapter";
import { EditChapter } from "../../application/usecases/Chapter";
import { GetChapter } from "../../application/usecases/Chapter";
import { FileUploadService } from "../../application/services/filesUpload";
import { ChapterCtrl } from "../controllers/chapterCtrl";

const chapterRepo = new ChapterRepository();
const create = new CreateChapter(chapterRepo);
const edit = new EditChapter(chapterRepo);
const getc = new GetChapter(chapterRepo);
const file = new FileUploadService();

export const chapterCtrlDI = new ChapterCtrl(create, edit, getc, file);
