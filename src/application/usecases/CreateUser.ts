import { UserInterface } from "../../domain/interface/User";
import { User } from "../../domain/entities/User";

export class CreateUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(userData: Omit<User, "id">): Promise<User> {
    const { email } = userData;

    // Duplicates
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = new User(
      userData.student_name,
      userData.email,
      userData.password,
      userData.role
    );
    return this.userRepository.create(newUser);
  }
}
