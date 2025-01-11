import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
export const getTutorProfile = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const email = req.query.email as string;
    const user = await userRepository.findByEmail(email);
    sendResponseJson(res, HttpStatus.OK, "Tutor Profile", true, user);
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const { name, email, qualification, subjects, experience } = req.body;
    const certificates = req.files as Express.Multer.File[] | undefined;

    // Upload files to Cloudinary
    const uploadedFiles: string[] = [];
    if (certificates) {
      for (const file of certificates) {
        const uploadPromise = new Promise<string>((resolve, reject) => {
          const readableStream = new Readable();
          readableStream.push(file.buffer);
          readableStream.push(null); // Mark the end of the stream

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: file.mimetype.startsWith("image/")
                ? "image"
                : "raw",
              folder: "tutor_certificates",
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) return resolve(result.secure_url);
            }
          );

          readableStream.pipe(uploadStream);
        });

        const uploadedUrl = await uploadPromise;
        uploadedFiles.push(uploadedUrl);
      }
    }

    // Update profile data
    const updatedData = {
      name,
      email,
      qualification,
      subjects,
      experience,
      certificates: uploadedFiles,
    };
    const id = req.params.id;
    const user = await userRepository.update(id, updatedData);
    sendResponseJson(res, HttpStatus.OK, "Profile Updated", true, user);
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};

export const getTutorCertificates = async (req: Request, res: Response) => {
  try {
    const userRepository = new UserRepository();
    const id = req.params.id;
    const user = await userRepository.findById(id);
    if (user) {
      sendResponseJson(
        res,
        HttpStatus.OK,
        "Tutor Certificates",
        true,
        user.certificates
      );
    } else {
      sendResponseJson(res, HttpStatus.NOT_FOUND, "User not found", false);
    }
  } catch (error: any) {
    sendResponseJson(res, HttpStatus.BAD_REQUEST, error.message, false);
  }
};
