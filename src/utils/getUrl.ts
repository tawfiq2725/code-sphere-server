import { FileUploadService } from "../application/services/filesUpload";

export const getUrl = async (key: string) => {
  const uploadkey = key.split("/").pop()!;
  const folder = key.substring(0, key.lastIndexOf("/") + 1);
  const aws = new FileUploadService();
  const url = await aws.getPresignedUrl(uploadkey, folder);
  return url;
};
