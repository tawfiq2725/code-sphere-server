export class User {
  constructor(
    public student_name: string,
    public email: string,
    public password: string,
    public role: "student",
    public isVerified: boolean = false,
    public isAdmin: boolean = false,
    public googleId?: string
  ) {}
}
