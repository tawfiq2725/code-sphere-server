import { Person } from "../entities/User";

export interface UserInterface {
  create(user: Person): Promise<Person>;
  findByEmail(email: string): Promise<Person | null>;
  findById(id: string): Promise<Person | null>;
  update(id: string, user: Person): Promise<Person | null>;
  getAllUsers(): Promise<Person[]>;
  getAllTutor(): Promise<Person[]>;
  getAllTutorApplication(): Promise<Person[]>;
  BlockUser(id: string): Promise<Person | null>;
  UnblockUser(id: string): Promise<Person | null>;
  approveTutor(id: string): Promise<Person | null>;
  disapproveTutor(id: string): Promise<Person | null>;
  getProfile(id: string): Promise<Person | null>;
}
