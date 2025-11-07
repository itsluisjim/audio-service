import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export class AudioService {

    private s3Client: S3Client;

    constructor(){
        this.s3Client = new S3Client([{ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } }]);
    }

    public getAudioFromAwsS3Bucket(fileId: string){ 
        return {
            fileId,
            fileData: "UWOVU23KJNB2KB2N3K4BKNKJ2N342"
        };
    }

    public async uploadAudioToAwsS3Bucket(fileId: string, audio: any){

        // Read the file from the temporary path
        const fileStream = fs.createReadStream(audio.filepath);

        const bucketName = process.env.AWS_S3_BUCKET;
        const key = `${fileId}-${audio.originalFilename}`;

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: fileStream,
            ContentType: audio.mimetype
        };

        try {
            // Upload the file to S3 and send the command
            const command = new PutObjectCommand(uploadParams);
            const result = await this.s3Client.send(command);

            // You can construct the public URL manually if ACL = "public-read"
            const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

            // Return relevant information about the uploaded file
            return {
                key,
                bucket: bucketName,
                location: fileUrl,
                etag: result.ETag,
            };
        } catch (err: any) {
            console.error("S3 upload error:", err);
            throw new Error(`Failed to upload file: ${err.message}`);
        }
    }
}
