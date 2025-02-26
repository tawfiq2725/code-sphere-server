import { PaginationOptions } from "../../utils/queryHelper";
import { Person } from "../entities/User";

export interface UserInterface {
  create(user: Person): Promise<Person>;
  findByEmail(email: string): Promise<Person | null>;
  findById(id: string): Promise<Person | null>;
  update(id: string, user: Person): Promise<Person | null>;
  getAllUsers(options: PaginationOptions): Promise<Person[]>;
  getAllTutor(options: PaginationOptions): Promise<Person[]>;
  getAllTutorApplication(options: PaginationOptions): Promise<Person[]>;
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
}
