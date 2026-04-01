import "reflect-metadata";
import { S3Client, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { injectable } from "tsyringe";
import fs from "fs";
import path from "path/win32";
import dotenv from "dotenv";

dotenv.config();
@injectable()
export class AudioRepository {
  constructor(private s3Client: S3Client) {}

  public async listAudiosInAwsS3Bucket() {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
    const bucketName = process.env.AWS_S3_BUCKET;

    const command = new ListObjectsV2Command({
      Bucket: bucketName
    });

    const response = await this.s3Client.send(command);

    const audioFiles = (response.Contents || []).filter(item => {
        const key = item.Key?.toLowerCase();
        return audioExtensions.some(ext => key?.endsWith(ext));
    });

    const audioPromises = audioFiles.map(async (file) => {
        const key = file.Key as string;

        const downloadCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`
        });

        const signedUrl = await getSignedUrl(
            this.s3Client,
            downloadCommand,
            { expiresIn: 3600 }
        );

        return {
            name: key.split('/').pop(), // removes folder prefix if present
            type: key.split('.').pop(),
            size: ((file.Size ?? 0) / 1024 / 1024).toFixed(2) + " MB",
            downloadUrl: signedUrl
        };
    });

    return Promise.all(audioPromises);
  }

  public async getAudioFromAwsS3Bucket(fileUUID: string) {

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileUUID
    };

    const command = new GetObjectCommand(uploadParams);
    const response = await this.s3Client.send(command);

    if (!response.Body) {
        throw new Error('No response body from S3');
    }

    // return stream data and metadata
    return {
        Body: response.Body,
        ContentType: response.ContentType,
        ContentLength: response.ContentLength,
        ETag: response.ETag,
        LastModified: response.LastModified
    };
  }

  public async uploadAudioToAwsS3Bucket(uuid: string, audio: any) {
    // Read the file from the temporary path
    const fileStream = fs.createReadStream(audio.filepath);

    // Append file extension
    const fileExtension = path.extname(audio.originalFilename);
    const key: string = `${uuid}${fileExtension}`;

    const bucketName = process.env.AWS_S3_BUCKET;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: audio.mimetype,
    };

    // Upload the file to S3 and send the command
    const command: PutObjectCommand = new PutObjectCommand(uploadParams);
    const result: PutObjectCommandOutput = await this.s3Client.send(command);

    const fileUrl: string = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Return relevant information about the uploaded file
    return {
      key,
      bucket: bucketName,
      location: fileUrl,
      ...result,
    };
  }
}
