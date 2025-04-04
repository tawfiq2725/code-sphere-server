import { UserData } from "../../application/usecases/userLists";
import { Chat } from "../../infrastructure/database/chatSchema";
import { ICourse } from "../../infrastructure/database/courseSchema";
import { UserDocument } from "../../infrastructure/database/userSchema";
import { PaginationOptions } from "../../utils/queryHelper";
import { Course } from "../entities/Course";
import { Person } from "../entities/User";

export interface UserInterface {
  create(user: Person): Promise<Person>;
  findByEmail(email: string): Promise<Person | null>;
  findById(id: string): Promise<Person | null>;
  update(id: string, user: Partial<Person>): Promise<Person | null>;
  getAllUsers(options: PaginationOptions): Promise<UserData>;
  getAllTutor(options: PaginationOptions): Promise<UserData>;
  getAllTutorApplication(options: PaginationOptions): Promise<UserData>;
  BlockUser(id: string): Promise<Person | null>;
  UnblockUser(id: string): Promise<Person | null>;
  approveTutor(id: string): Promise<Person | null>;
  disapproveTutor(id: string): Promise<Person | null>;
  getProfile(id: string): Promise<Person | null>;
  approveCertificate(data: any): Promise<Person | null>;
  googleAuthLogin(userData: any): Promise<{ user: any; isNewUser: boolean }>;
  setRole(userId: string, role: string): Promise<Person | null>;
  getTutors(id: string): Promise<Person[]>;
  getUsers(tutorId: string): Promise<Person[]>;
  myCourses(tutorId: string): Promise<ICourse[] | null>;
  getEnrollStudents(id: string): Promise<UserDocument[] | null>;
  getCertificatesByStudent(id: string): Promise<any>;
  recentMessage(userId: string): Promise<Chat[]>;
  recentMessageT(tutorId: string): Promise<Chat[]>;
}
