import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";

export class CreateUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(userData: Omit<Person, "id">): Promise<Person> {
    const { email } = userData;

    // Duplicates
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = new Person(
      userData.name,
      userData.email,
      userData.password,
      userData.role
    );
    return this.userRepository.create(newUser);
  }
}
