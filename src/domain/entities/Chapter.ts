export class Chapter {
  constructor(
    public chapterId: number,
    public chapterName: string,
    public chapterDescription: string,
    public video: string,
    public courseId: number
  ) {}
}
