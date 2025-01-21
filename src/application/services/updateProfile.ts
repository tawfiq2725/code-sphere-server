import { FileUploadService } from "./filesUpload";
import { UserRepository } from "../../infrastructure/repositories/UserRepository"; // Adjust the import path as needed

export class UpdateProfileService {
  private fileUploadService: FileUploadService;
  private userRepository: UserRepository;

  constructor() {
    this.fileUploadService = new FileUploadService();
    this.userRepository = new UserRepository();
  }

  async updateProfile(data: {
    name: string;
    email: string;
    qualification: string;
    subjects: string[];
    experience: number;
    files: {
      profilePhoto?: Express.Multer.File;
      certificates?: Express.Multer.File[];
    };
  }): Promise<any> {
    const { name, email, qualification, subjects, experience, files } = data;

    // Validate required fields
    if (!name || !email || !qualification || !subjects || !experience) {
      throw new Error("All fields are required");
    }

    // Find the user ID by email
    const userId = await this.userRepository.findUserIdByEmail(email);
    if (!userId) {
      throw new Error(`User not found for email: ${email}`);
    }

    // Upload profile photo and certificates
    const profilePictureUrl = files.profilePhoto
      ? await this.fileUploadService.uploadProfilePhoto(
          userId,
          files.profilePhoto
        )
      : undefined;

    const certificates = files.certificates
      ? await this.fileUploadService.uploadCertificates(
          userId,
          files.certificates
        )
      : [];

    // Prepare fields to update
    const updateFields = {
      name,
      email,
      qualification,
      subjects,
      experience: Number(experience),
      profile: profilePictureUrl,
      certificates,
    };

    // Update the user in the database
    return await this.userRepository.update(userId, updateFields);
  }
}
