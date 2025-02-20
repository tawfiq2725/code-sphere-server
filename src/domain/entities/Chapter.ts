export class Chapter {
  constructor(
    public courseId: string,
    public chapterName: string,
    public chapterDescription: string,
    public video: string,
    public status: boolean,
    public id?: string
  ) {}
}
