import { AwsConfig } from "../../config/awsConfig"; // Adjust the import path as needed

export class FileUploadService {
  private awsConfig: AwsConfig;

  constructor() {
    this.awsConfig = new AwsConfig();
  }

  async uploadProfilePhoto(
    userId: string,
    profilePhoto: Express.Multer.File
  ): Promise<string | undefined> {
    const profileKey = `tutor/profile/${userId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(
      profileKey,
      profilePhoto
    );

    return uploadedKey;
  }

  async uploadCertificates(
    userId: string,
    certificates: Express.Multer.File[]
  ): Promise<string[]> {
    const uploadedCertificates: string[] = [];
    for (const certificate of certificates) {
      const certKey = `tutor/certificates/${userId}/`;
      const uploadedKey = await this.awsConfig.uploadFileToS3(
        certKey,
        certificate
      );
      uploadedCertificates.push(uploadedKey);
    }
    return uploadedCertificates;
  }

  async uploadCourseThumbnail(
    courseId: string,
    thumbnail: Express.Multer.File
  ): Promise<string | undefined> {
    console.log("Uploading course thumbnail");
    const thumbnailKey = `course/thumbnail/${courseId}/`;
    console.log("Thumbnail key:", thumbnailKey);
    const uploadedKey = await this.awsConfig.uploadFileToS3(
      thumbnailKey,
      thumbnail
    );
    return uploadedKey;
  }

  async uploadCourseVideo(
    courseId: string,
    video: Express.Multer.File
  ): Promise<string | undefined> {
    const videoKey = `course/video/${courseId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(videoKey, video);

    return uploadedKey;
  }

  async uploadUserProfileImage(
    userId: string,
    image: Express.Multer.File
  ): Promise<string | undefined> {
    const imageKey = `user/profile/${userId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(imageKey, image);
    return uploadedKey;
  }

  async uploadCourseCertificate(
    userId: string,
    certificate: Express.Multer.File
  ): Promise<string | undefined> {
    console.log("Uploading course certificate");
    console.log("User ID:", userId, "Certificate:", certificate);
    const certKey = `student/certificate/${userId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(
      certKey,
      certificate
    );

    return uploadedKey;
  }

  async getPresignedUrl(filename: string, folder: string): Promise<string> {
    return this.awsConfig.getfile(filename, folder);
  }
}
