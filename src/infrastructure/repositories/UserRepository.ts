import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import UserModel, { UserDocument } from "../database/userSchema";
import { PaginationOptions, paginate } from "../../utils/queryHelper";
import Course, { ICourse } from "../database/courseSchema";
import ChatModel from "../database/chatSchema";

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
      userDoc.courseProgress ?? []
    );
  }

  public async create(user: Person): Promise<Person> {
    const userDoc = new UserModel(user);
    await userDoc.save();
    return this.maptoEntity(userDoc);
  }

  public async findByEmail(email: string): Promise<Person | null> {
    const userDoc = await UserModel.findOne({ email }).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async findById(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async update(
    id: string,
    user: Partial<Person>
  ): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(id, user, {
      new: true,
    }).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async getAllUsers(options: PaginationOptions): Promise<any> {
    const userQuery = { role: "student" };
    const userDocs = await paginate(UserModel, options, userQuery);
    return userDocs;
  }

  public async getAllTutor(options: PaginationOptions): Promise<any> {
    const tutorQuery = { role: "tutor", isTutor: true };
    const userDocs = await paginate(UserModel, options, tutorQuery);
    return userDocs;
  }
  public async getAllTutorApplication(
    options: PaginationOptions
  ): Promise<any> {
    const tutorQuery = { role: "tutor", isTutor: false };
    const userDocs = await paginate(UserModel, options, tutorQuery);
    return userDocs;
  }

  public async BlockUser(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    ).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async UnblockUser(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    ).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async approveTutor(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      { isTutor: true },
      { new: true }
    ).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }

  public async disapproveTutor(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      { isTutor: false },
      { new: true }
    ).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }
  public async getProfile(id: string): Promise<Person | null> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? this.maptoEntity(userDoc) : null;
  }
  public async findUserIdByEmail(email: string): Promise<string | null> {
    const userDoc = await UserModel.findOne({ email }).select("_id").exec();
    return userDoc ? userDoc._id : null;
  }
  public async getUserProfileImage(id: string): Promise<any> {
    const userDoc = await UserModel.findById(id).select("profile").exec();
    return userDoc ? userDoc.profile : null;
  }

  public async getEnrollStudents(courseId: string): Promise<any> {
    const userDocs = await UserModel.find({
      courseProgress: {
        $elemMatch: { courseId: courseId },
      },
    }).exec();
    return userDocs;
  }
  public async approveCertificate(data: any): Promise<any> {
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
  }
  public async getCertificatesByStudent(studentId: string): Promise<any> {
    const userDoc = await UserModel.findById(studentId);
    return userDoc ? userDoc.CourseCertificate : null;
  }

  public async googleAuthLogin(
    userData: any
  ): Promise<{ user: any; isNewUser: boolean }> {
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
  }

  public async setRole(
    userId: string,
    role: "student" | "tutor" | "admin"
  ): Promise<Person | null> {
    const userData = await UserModel.findById(userId).exec();
    if (!userData) {
      throw new Error("User not found");
    }

    userData.role = role;
    await userData.save();
    return this.maptoEntity(userData);
  }

  public async getTutors(studentId: string): Promise<Person[]> {
    const student = await UserModel.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const courseIds = student.courseProgress
      ? student.courseProgress.map((item) => item.courseId)
      : [];
    const courses = await Course.find({ courseId: { $in: courseIds } });
    const tutorIds = courses.map((course) => course.tutorId);
    const uniqueTutorIds = [...new Set(tutorIds)];
    const tutors = await UserModel.find({
      _id: { $in: uniqueTutorIds },
      role: "tutor",
    });

    const tutorsWithUnread = await Promise.all(
      tutors.map(async (tutorDoc) => {
        const tutor = this.maptoEntity(tutorDoc);
        const chat = await ChatModel.findOne({
          tutorId: tutorDoc._id,
          userId: studentId,
        });
        const unreadCount = chat
          ? chat.messages.filter((msg) => msg.sender === "tutor" && !msg.read)
              .length
          : 0;
        return Object.assign(tutor, { unreadCount });
      })
    );

    return tutorsWithUnread;
  }
  public async getUsers(tutorId: string): Promise<Person[]> {
    // 1. Get tutor's courses
    const courses = await Course.find({ tutorId });
    if (!courses.length) return [];

    // 2. Extract course IDs and find enrolled students
    const tutorCourseIds = courses.map((course: ICourse) => course.courseId);
    const studentDocs = await UserModel.find({
      role: "student",
      courseProgress: { $elemMatch: { courseId: { $in: tutorCourseIds } } },
    });

    // 3. Calculate unread messages from students (by checking each message’s read flag)
    const studentsWithUnread = await Promise.all(
      studentDocs.map(async (studentDoc) => {
        const student = this.maptoEntity(studentDoc);
        const chat = await ChatModel.findOne({
          tutorId,
          userId: studentDoc._id,
        });

        // Count unread messages sent by the student
        const unreadCount = chat
          ? chat.messages.filter((msg) => msg.sender === "student" && !msg.read)
              .length
          : 0;

        return Object.assign(student, { unreadCount });
      })
    );

    return studentsWithUnread;
  }
}
