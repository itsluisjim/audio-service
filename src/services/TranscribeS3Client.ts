import { injectable } from "tsyringe";
import { TranscribeClient, StartTranscriptionJobCommand, StartTranscriptionJobCommandInput } from "@aws-sdk/client-transcribe";

@injectable()
export class TranscribeService {

    constructor(private transcribeClient: TranscribeClient) {}

    public async startTranscriptionJob(audioFileUUID: string): Promise<void> {
        const commandInput: StartTranscriptionJobCommandInput = {
            TranscriptionJobName: audioFileUUID,
            LanguageCode: "en-US",
            Media: {
                MediaFileUri: `s3://${process.env.AWS_S3_BUCKET}/${audioFileUUID}.mp3`,
            },
            OutputBucketName: process.env.AWS_S3_TRANSCRIPT_BUCKET,
        };

        const transcribeCommand = new StartTranscriptionJobCommand(commandInput);
        await this.transcribeClient.send(transcribeCommand);
    }
} 