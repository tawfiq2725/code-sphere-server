import { Request, Response } from "express";
import {
  GetAllTutor,
  GetAllTutorApplication,
  GetAllUsers,
} from "../../application/usecases/userLists";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { getUrl } from "../../utils/getUrl";
import { GetAllCourse } from "../../application/usecases/Course";

export class AdminCtrl {
  constructor(
    private getAlltutorUsecase: GetAllTutor,
    private getAlltutorApplication: GetAllTutorApplication,
    private getAllUsers: GetAllUsers,
    private courseUsecase: GetAllCourse
  ) {}

  public async getAllUsersList(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const users = await this.getAllUsers.execute({
        page,
        limit,
        search,
        category,
      });
      for (let user of users.data) {
        if (user.profile) {
          user.profile = await getUrl(user.profile);
        }
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "All users fetched successfully",
        true,
        users
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async getAllTutorList(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const users = await this.getAlltutorUsecase.execute({
        page,
        limit,
        search,
        category,
      });
      for (let user of users.data) {
        if (user.profile) {
          user.profile = await getUrl(user.profile);
        }
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "All Tutors fetched successfully",
        true,
        users
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async getAllTutorListApplication(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;

      const users = await this.getAlltutorApplication.execute({
        page,
        limit,
        search,
        category,
      });
      for (let user of users.data) {
        if (user.profile) {
          user.profile = await getUrl(user.profile);
        }
      }
      sendResponseJson(
        res,
        HttpStatus.OK,
        "All Tutors fetched successfully",
        true,
        users
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async BlockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getAllUsers.execBlock(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "User Blocked Successfully",
        true,
        user
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async UnblockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getAllUsers.execUnblock(id);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "User Unblocked Successfully",
        true,
        user
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }
  public async approveTutor(req: Request, res: Response): Promise<void> {
    try {
      const { tutorId } = req.params;
      const user = await this.getAlltutorUsecase.execApprove(tutorId);
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Approved Successfully",
        true,
        user
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async disapproveTutor(req: Request, res: Response): Promise<void> {
    try {
      const { tutorId } = req.params;
      const user = await this.getAlltutorUsecase.execDissAprove(tutorId);

      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Disapproved Successfully",
        true,
        user
      );
    } catch (error: any) {
      sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
    }
  }

  public async GetallCoursesAdmin(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.courseUsecase.execute();
      sendResponseJson(res, HttpStatus.OK, "Courses fetched", true, courses);
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }

  public async toggleCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isVisible } = req.body;
      const course = await this.courseUsecase.execToggleCourse(id, isVisible);
      sendResponseJson(
        res,
        HttpStatus.OK,
        `Course ${isVisible ? "listed" : "unlisted"} successfully`,
        true,
        course
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }

  public async approveOrRejectCourse(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const { courseStatus, percentage } = req.body;
      const course = await this.courseUsecase.execApproveOrReject(
        courseId,
        courseStatus,
        percentage
      );
      sendResponseJson(
        res,
        HttpStatus.OK,
        `Course ${courseStatus} Successfully`,
        true,
        course
      );
    } catch (error: any) {
      sendResponseJson(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Server error",
        false
      );
    }
  }
}
