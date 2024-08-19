// import dotenv from 'dotenv';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { Readable } from 'stream';
// import { Express } from 'express';

// dotenv.config();

// // Ensure the necessary environment variables are defined
// const {
//   AWS_ACCESS_KEY_ID,
//   AWS_SECRET_ACCESS_KEY,
//   AWS_REGION,
//   AWS_BUCKET_NAME
// } = process.env;

// if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
//   throw new Error('Missing AWS configuration in .env file');
// }

// export const awsConfig = {
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   region: AWS_REGION,
//   bucketName: AWS_BUCKET_NAME
// };

// const s3Client = new S3Client({
//   region: awsConfig.region,
//   credentials: {
//     accessKeyId: awsConfig.accessKeyId,
//     secretAccessKey: awsConfig.secretAccessKey
//   }
// });

// // Function to upload a file to S3
// export const uploadToS3 = async (file: Express.Multer.File): Promise<{ Location: string }> => {
//   const fileStream = new Readable();
//   fileStream.push(file.buffer);
//   fileStream.push(null);

//   const uploadParams = {
//     Bucket: awsConfig.bucketName,
//     Key: `${file.originalname}`,
//     Body: fileStream,
//     ContentType: file.mimetype
//   };

//   try {
//     const command = new PutObjectCommand(uploadParams);
//     const data = await s3Client.send(command);
//     console.log('File uploaded successfully:', data);
//     return { Location: `https://${uploadParams.Bucket}.s3.${awsConfig.region}.amazonaws.com/${uploadParams.Key}` };
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw error;
//   }
// };
// import { S3Client, PutObjectCommandOutput } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";
// import { Readable } from 'stream';

// const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
// const region = process.env.AWS_REGION || '';
// const Bucket = process.env.AWS_BUCKET_NAME || '';

// const s3Client = new S3Client({
//   region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey
//   }
// });

// interface UploadToS3Result {
//   Location: string;
//   ETag: string;
//   Bucket: string;
//   Key: string;
// }

// export const uploadToS3 = async (file: Express.Multer.File): Promise<UploadToS3Result> => {
//   const { buffer, originalname, mimetype } = file;
//   const fileStream = Readable.from(buffer);
//   const Key = `${Date.now().toString()}-${originalname}`;

//   const upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket,
//       Key,
//       Body: fileStream,
//       ACL: 'public-read',
//       ContentType: mimetype
//     }
//   });

//   const result: PutObjectCommandOutput = await upload.done();
//   return {
//     Location: `https://${Bucket}.s3.${region}.amazonaws.com/${Key}`,
//     ETag: result.ETag as string,
//     Bucket,
//     Key
//   };
// };
// import { S3Client } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import dotenv from 'dotenv';

// dotenv.config();

// const {
//   AWS_ACCESS_KEY_ID,
//   AWS_SECRET_ACCESS_KEY,
//   AWS_REGION,
//   AWS_BUCKET_NAME,
// } = process.env;

// if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
//   throw new Error('Missing AWS configuration in .env file');
// }

// const s3Client = new S3Client({
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   },
// });

// export const uploadToS3 = async (file: Express.Multer.File): Promise<{ Location: string }> => {
//   const uploadParams = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   try {
//     const upload = new Upload({
//       client: s3Client,
//       params: uploadParams,
//     });

//     const data = await upload.done();
//     console.log('File uploaded successfully:', data);
//     return { Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}` };
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw error;
//   }
// };



import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_BUCKET_NAME) {
  throw new Error('Missing AWS configuration in .env file');
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<{ Location: string }> => {
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(command);
    console.log('File uploaded successfully:', data);
    return { Location: `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${uploadParams.Key}` };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};


