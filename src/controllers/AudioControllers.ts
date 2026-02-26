import "reflect-metadata";
import { AudioRepository } from "../services/AudioRepository";
import formidable from "formidable";
import { pipeline, Readable } from "stream";
import { promisify } from "util";
import { injectable } from "tsyringe";
import { TranscribeService } from "../services/TranscribeS3Client";

const streamPipeline = promisify(pipeline);

@injectable()
export class AudioServiceController {
    constructor(private readonly audioRepository: AudioRepository, private transcribeService: TranscribeService) {}

    public async listAudios(req: any, res: any) {
        const audioList = await this.audioRepository.listAudiosInAwsS3Bucket();

        return res.json({ success: true, data: audioList });
    }

    public async getAudio(req: any, res: any, audioFileUUID: string) {
        
        const response = await this.audioRepository.getAudioFromAwsS3Bucket(audioFileUUID);
            
        // Set appropriate headers for streaming
        res.writeHead(200, {
            'Content-Type': response.ContentType || 'audio/mpeg',
            'Content-Length': response.ContentLength,
            'Last-Modified': response.LastModified?.toUTCString() || new Date().toUTCString(),
        });

        // Stream the response body
        await streamPipeline(response.Body as Readable, res);
    }

    public uploadAudio(req: any, res: any){

        // Create a new formidable form instance
        const form = formidable({ multiples: false });

        // Parse the incoming request containing the form data
        form.parse(req, async (err, fields, files) => {

            // Handle any errors that occur during parsing
            if (err) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: "Error parsing the file upload" }));
            }

            // Expecting files.audio to either be an array of formidable.File objects, or to be undefined.
            const audioArray = files.audio as formidable.File[] | undefined;
            const audio = Array.isArray(audioArray) ? audioArray[0] : audioArray;

            // Validate audio file presence
            if(!audio || !audio.filepath){ 
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: "No audio file uploaded" }));
            }

            // Generate unique ID for the audio file using a library like uuid
            const audioFileUUID: string = crypto.randomUUID();

            const uploadResult = await this.audioRepository.uploadAudioToAwsS3Bucket(audioFileUUID, audio);

            const transcribeResult = await this.transcribeService.startTranscriptionJob(audioFileUUID);

            return res.end(
                JSON.stringify({ uploadResult, transcribeResult })
            );
        });
    }
}
