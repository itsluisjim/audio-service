import { S3Client, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path/win32";
import dotenv from "dotenv";

dotenv.config();

export class AudioRepository {
  constructor(private s3Client: S3Client) {}

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
