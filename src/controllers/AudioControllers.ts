import { ServerResponse, IncomingMessage } from "http";
import { AudioService } from "../services/AudioServices";
import formidable from "formidable";
import { pipeline, Readable } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);


export class AudioServiceController {
    constructor(private readonly audioService: AudioService) {}

    public async getAudio(req: IncomingMessage, res: ServerResponse, audioFileUUID: string) {
        try {
            const response = await this.audioService.getAudioFromAwsS3Bucket(audioFileUUID);
            
            // Set appropriate headers for streaming
            res.writeHead(200, {
                'Content-Type': response.ContentType || 'audio/mpeg',
                'Content-Length': response.ContentLength,
                'Last-Modified': response.LastModified?.toUTCString() || new Date().toUTCString(),
            });

            // Stream the response body
            await streamPipeline(response.Body as Readable, res);
            
        } catch (error) {
            console.error('Error streaming audio:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Failed to stream audio file',
                details: error instanceof Error ? error.message : 'Unknown error'
            }));
        }
    }

    public uploadAudio(req: IncomingMessage, res: ServerResponse){

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

            const uploadResult = await this.audioService.uploadAudioToAwsS3Bucket(audioFileUUID, audio);

            return res.end(
                JSON.stringify({ uploadResult })
            );
        });
    }
}
