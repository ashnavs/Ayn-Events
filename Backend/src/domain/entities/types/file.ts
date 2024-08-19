import { FileData } from "../../../utils/s3Uploader";
import { uploadToS3 } from "../../../utils/s3Uploader";

// Convert the file to match Express.Multer.File
const file = {
  fieldname: 'file',
  originalname: `${Date.now()}-image.jpg`,
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer: Buffer.from(imageBase64, 'base64'),
  size: Buffer.byteLength(Buffer.from(imageBase64, 'base64')),
} as Express.Multer.File;

const result = await uploadToS3(file);
