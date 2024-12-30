import { Person } from "../entities/User";

export interface UserInterface {
  create(user: Person): Promise<Person>;
  findByEmail(email: string): Promise<Person | null>;
  findById(id: string): Promise<Person | null>;
  update(id: string, user: Person): Promise<Person | null>;
}
