import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import UserModel, { UserDocument } from "../database/userSchema";
import { PaginationOptions, paginate } from "../../utils/queryHelper";
import CourseS, { ICourse } from "../database/courseSchema";
import { UserData } from "../../application/usecases/userLists";
import ChatModel, { Chat } from "../database/chatSchema";
import { Course } from "../../domain/entities/Course";

export class UserRepository implements UserInterface {
  private maptoEntity(userDoc: UserDocument): Person {
    return new Person(
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.role ?? "student",
      userDoc._id,
      userDoc.isVerified,
      userDoc.isAdmin,
      userDoc.isBlocked,
      userDoc.googleId,
      userDoc.isTutor,
      userDoc.qualification,
      userDoc.experience,
      userDoc.subjects,
      userDoc.certificates,
      userDoc.tutorStatus,
      userDoc.profile,
      userDoc.bio,
      userDoc.courseProgress ?? [],
      userDoc.reason
    );
  }

  public async create(user: Person): Promise<Person> {
    try {
      const userDoc = new UserModel(user);
      await userDoc.save();
      return this.maptoEntity(userDoc);
    } catch (err) {
      console.log(err);
      throw new Error("User already exists");
    }
  }

  public async findByEmail(email: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findOne({ email }).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async findById(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findById(id).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async update(
    id: string,
    user: Partial<Person>
  ): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(id, user, {
        new: true,
      }).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async getAllUsers(options: PaginationOptions): Promise<UserData> {
    try {
      const userQuery = { role: "student" };
      console.log("userQuery", userQuery);
      const userDocs = await paginate(UserModel, options, userQuery);
      console.log("userQuery", userDocs);
      return {
        data: userDocs.data.map((doc) => this.maptoEntity(doc)),
        pagination: userDocs.pagination,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting");
    }
  }

  public async getAllTutor(options: PaginationOptions): Promise<UserData> {
    try {
      const tutorQuery = { role: "tutor", isTutor: true };
      const userDocs = await paginate(UserModel, options, tutorQuery);
      return {
        data: userDocs.data.map((doc) => this.maptoEntity(doc)),
        pagination: userDocs.pagination,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting");
    }
  }
  public async getAllTutorApplication(
    options: PaginationOptions
  ): Promise<UserData> {
    try {
      const tutorQuery = {
        role: "tutor",
        isTutor: false,
      };
      const userDocs = await paginate(UserModel, options, tutorQuery);
      return {
        data: userDocs.data.map((doc) => this.maptoEntity(doc)),
        pagination: userDocs.pagination,
      };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting");
    }
  }

  public async BlockUser(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { isBlocked: true },
        { new: true }
      ).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async UnblockUser(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { isBlocked: false },
        { new: true }
      ).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async approveTutor(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { isTutor: true },
        { new: true }
      ).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async disapproveTutor(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { isTutor: false },
        { new: true }
      ).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async getProfile(id: string): Promise<Person | null> {
    try {
      const userDoc = await UserModel.findById(id).exec();
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async findUserIdByEmail(email: string): Promise<string | null> {
    try {
      const userDoc = await UserModel.findOne({ email }).select("_id").exec();
      return userDoc ? userDoc._id : null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async getUserProfileImage(id: string): Promise<string | undefined> {
    try {
      const userDoc = await UserModel.findById(id).select("profile").exec();
      return userDoc ? userDoc.profile : "";
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public async getEnrollStudents(
    courseId: string
  ): Promise<UserDocument[] | null> {
    try {
      const userDocs = await UserModel.find({
        courseProgress: { $elemMatch: { courseId } },
      }).exec();

      return userDocs || null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async approveCertificate(data: any): Promise<any> {
    try {
      console.log("studentDAta", data);
      console.log(data.studentId);
      const userDoc = await UserModel.findByIdAndUpdate(
        data.studentId,
        {
          $push: {
            CourseCertificate: {
              courseId: data.courseId,
              status: data.status,
              certificateUrl: data.certificateUrl,
              issuedDate: data.issueDate, // Changed to match the schema field
              approvedBy: data.approvedBy,
            },
          },
        },
        { new: true }
      ).exec();
      console.log("updated successfully");
      return userDoc ? this.maptoEntity(userDoc) : null;
    } catch (err) {
      console.log(err);
    }
  }
  public async getCertificatesByStudent(studentId: string): Promise<any> {
    try {
      const userDoc = await UserModel.findById(studentId);
      return userDoc ? userDoc.CourseCertificate : null;
    } catch (err) {
      console.log(err);
    }
  }

  public async googleAuthLogin(
    userData: any
  ): Promise<{ user: any; isNewUser: boolean }> {
    try {
      const { email, name, googleId, picture } = userData;
      let user = await UserModel.findOne({ email }).exec();
      let isNewUser = false;
      if (!user) {
        user = new UserModel({
          email,
          name,
          googleId,
          isVerified: true,
          profile: picture,
        });
        await user.save();
        isNewUser = true;
      }
      return { user, isNewUser };
    } catch (err) {
      console.log(err);
      throw new Error("Error in google auth login");
    }
  }

  public async setRole(
    userId: string,
    role: "student" | "tutor" | "admin"
  ): Promise<Person | null> {
    try {
      const userData = await UserModel.findById(userId).exec();
      if (!userData) {
        throw new Error("User not found");
      }
      userData.role = role;
      await userData.save();
      return this.maptoEntity(userData);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async getTutors(studentId: string): Promise<Person[]> {
    try {
      const student = await UserModel.findById(studentId);
      if (!student) {
        throw new Error("Student not found");
      }
      const courseIds = student.courseProgress
        ? student.courseProgress.map((item) => item.courseId)
        : [];
      const courses = await CourseS.find({ courseId: { $in: courseIds } });
      const tutorIds = courses.map((course) => course.tutorId);
      const uniqueTutorIds = [...new Set(tutorIds)];
      const tutors = await UserModel.find({
        _id: { $in: uniqueTutorIds },
        role: "tutor",
      });

      return tutors.map((tutor) => this.maptoEntity(tutor));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async getUsers(tutorId: string): Promise<Person[]> {
    try {
      const courses = await CourseS.find({ tutorId });

      if (!courses || courses.length === 0) {
        return [];
      }
      const tutorCourseIds = courses.map((course: ICourse) => course.courseId);

      const students = await UserModel.find({
        role: "student",
        courseProgress: { $elemMatch: { courseId: { $in: tutorCourseIds } } },
      });

      return students.map((student: UserDocument) => this.maptoEntity(student));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  public async myCourses(tutorId: string): Promise<ICourse[] | null> {
    try {
      const courses = await CourseS.find({ tutorId });

      if (!courses || courses.length === 0) {
        return [];
      }
      return courses;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public async recentMessage(userId: string): Promise<Chat[]> {
    try {
      const chats = await ChatModel.find({ userId }).populate<{
        tutorId: UserDocument;
      }>("tutorId");
      const result = chats.map((chat) => {
        let latestMessage = "";
        let latestMessageTime: string = "";

        if (chat.messages && chat.messages.length > 0) {
          const sortedMessages = chat.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          const lastMsg = sortedMessages[sortedMessages.length - 1];
          latestMessage = lastMsg.message || "";
          latestMessageTime = lastMsg.createdAt
            ? new Date(lastMsg.createdAt).toISOString()
            : "";
        }

        return {
          chatId: chat._id,
          tutorId: chat.tutorId?.id,
          tutorName: chat.tutorId?.name,
          latestMessage,
          latestMessageTime,
        };
      });
      return result;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
  public async recentMessageT(tutorId: string): Promise<Chat[]> {
    try {
      const chats = await ChatModel.find({ tutorId }).populate<{
        userId: UserDocument;
      }>("userId");
      const result = chats.map((chat) => {
        let latestMessage = "";
        let latestMessageTime: string = "";

        if (chat.messages && chat.messages.length > 0) {
          const sortedMessages = chat.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          const lastMsg = sortedMessages[sortedMessages.length - 1];
          latestMessage = lastMsg.message || "";
          latestMessageTime = lastMsg.createdAt
            ? new Date(lastMsg.createdAt).toISOString()
            : "";
        }

        return {
          chatId: chat._id,
          studentId: chat.userId?._id,
          studentName: chat.userId?.name,
          latestMessage,
          latestMessageTime,
        };
      });
      return result;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
