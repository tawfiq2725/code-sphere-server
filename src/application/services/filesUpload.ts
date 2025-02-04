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
    const profilePictureUrl = await this.awsConfig.getfile(
      uploadedKey.split("/").pop()!,
      profileKey
    );
    return profilePictureUrl?.split("?")[0]; // Return the static URL
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
      const certUrl = await this.awsConfig.getfile(
        uploadedKey.split("/").pop()!,
        certKey
      );
      uploadedCertificates.push(certUrl.split("?")[0]);
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
    console.log("Uploaded key:", uploadedKey);
    const thumbnailUrl = await this.awsConfig.getfile(
      uploadedKey.split("/").pop()!,
      thumbnailKey
    );
    console.log("Thumbnail URL:", thumbnailUrl);

    return thumbnailUrl?.split("?")[0];
  }

  async uploadCourseVideo(
    courseId: string,
    video: Express.Multer.File
  ): Promise<string | undefined> {
    const videoKey = `course/video/${courseId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(videoKey, video);
    const videoUrl = await this.awsConfig.getfile(
      uploadedKey.split("/").pop()!,
      videoKey
    );
    return videoUrl?.split("?")[0];
  }

  async uploadUserProfileImage(
    userId: string,
    image: Express.Multer.File
  ): Promise<string | undefined> {
    const imageKey = `user/profile/${userId}/`;
    const uploadedKey = await this.awsConfig.uploadFileToS3(imageKey, image);
    const imageUrl = await this.awsConfig.getfile(
      uploadedKey.split("/").pop()!,
      imageKey
    );
    return imageUrl?.split("?")[0];
  }
}
