import { UserInterface } from "../../domain/interface/User";
import { Person } from "../../domain/entities/User";
import jwt from "jsonwebtoken";
import { configJwt } from "../../config/ConfigSetup";

export class LoginUser {
  constructor(private userRepository: UserInterface) {}

  public async execute(
    email: string,
    password: string
  ): Promise<{ user: Person; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user.email, role: user.role },
      configJwt.jwtSecret!,
      { expiresIn: "1h" }
    );

    return { user, token };
  }
}
