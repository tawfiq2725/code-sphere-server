import bcrypt from "bcryptjs";

export class Person {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role: "student" | "tutor" | "admin",
    public _id?: string,
    public isVerified: boolean = false,
    public isAdmin: boolean = false,
    public isBlocked: boolean = false,
    public googleId?: string,
    public isTutor: boolean = false,
    public qualification?: string,
    public experience?: number,
    public subjects?: string[],
    public certificates?: string[],
    public tutorStatus?: "pending" | "approved" | "rejected",
    public profile?: string,
    public bio?: string
  ) {}

  async hashPassword(): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
