import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import UserModel, { UserDocument } from "../database/userSchema";
import { PaginationOptions, paginate } from "../../utils/queryHelper";

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
  public async getAllTutorApplication(): Promise<any> {
    const userDocs = await UserModel.find({
      role: "tutor",
      isTutor: false,
    }).exec();
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
}
