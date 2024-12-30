import bcrypt from "bcryptjs";

export class Person {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: "student" | "tutor" | "admin",
    public isVerified: boolean = false,
    public isAdmin: boolean = false,
    public googleId?: string
  ) {}

  async hashPassword(): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
