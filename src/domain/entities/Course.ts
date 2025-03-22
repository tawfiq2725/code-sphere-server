// Course entity
export class Course {
  constructor(
    public courseId: string,
    public courseName: string,
    public courseDescription: string,
    public info: string,
    public price: number,
    public prerequisites: string,
    public thumbnail: string,
    public isVisible: boolean,
    public tutorId: string,
    public courseStatus: "pending" | "approved" | "rejected",
    public categoryName: string,
    public sellingPrice?: number,
    public review?: {
      rating?: 1 | 2 | 3 | 4 | 5;
      description?: string;
    }
  ) {}
}
