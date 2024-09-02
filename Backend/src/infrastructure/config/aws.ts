import { generateName } from "user_random_name_generator";
import { S3Client,PutObjectCommand,ObjectCannedACL } from "@aws-sdk/client-s3";
import fs from "fs";

const s3 = new S3Client({
    region: process.env.AWS_REGION + "",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY + "",
      secretAccessKey: process.env.AWS_SECRET_KEY + "",
    },
  });

  export async function uploadImage(image: any) {
    
    const fileContent = fs.readFileSync(image);

    
    const fileName = await generateName() ;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME + "",
        Key: fileName,
        Body:fileContent,
    };

   
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
    }
}