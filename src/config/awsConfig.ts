import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";

export class AwsConfig {
  private bucketName: string;
  private region: string;
  private s3client: S3Client;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME!;
    this.region = process.env.AWS_REGION!;
    this.s3client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: this.region,
    });
  }

  async getfile(fileName: string, folder: string): Promise<string> {
    try {
      const sanitizedFolder = folder.endsWith("/")
        ? folder.slice(0, -1)
        : folder;

      const key = `${sanitizedFolder}/${fileName}`;

      const options = {
        Bucket: this.bucketName,
        Key: key,
      };

      const getCommand = new GetObjectCommand(options);
      const url = await getSignedUrl(this.s3client, getCommand, {
        expiresIn: 60 * 60,
      });
      return url;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }

  async uploadFileToS3(
    folderPath: string,
    file: Express.Multer.File
  ): Promise<string> {
    try {
      console.log(
        "Uploading file to S3------------------------------------------------"
      );
      const uniqueName = crypto.randomBytes(16).toString("hex");
      const params = {
        Bucket: this.bucketName,
        Key: `${folderPath}${uniqueName}.${file.mimetype.split("/")[1]}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);
      const sent = await this.s3client.send(command);

      if (sent && sent.$metadata.httpStatusCode === 200) {
        return `${folderPath}${uniqueName}.${file.mimetype.split("/")[1]}`;
      } else {
        throw new Error("File upload to S3 failed");
      }
    } catch (error: any) {
      console.error("Error uploading file to S3:", error.message);
      throw new Error("File upload failed");
    }
  }
}
