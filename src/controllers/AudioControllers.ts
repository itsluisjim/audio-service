import { ServerResponse, IncomingMessage } from "http";
import { AudioService } from "../services/AudioServices.ts";
import formidable from "formidable";


export class AudioServiceController {
    constructor(private readonly audioService: AudioService) {}

    public getAudio(req: IncomingMessage, res: ServerResponse, audioFileId: string) {

        const audioData = this.audioService.getAudioFromAwsS3Bucket(audioFileId);

        return res.end(
            JSON.stringify({ audioData })
        );
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

            // TO DO: Generate unique ID for the audio file using a library like uuid
            const audioFileId: string = "ANOTHER_VERY_UNIQUE_ID"; 

            const uploadResult = await this.audioService.uploadAudioToAwsS3Bucket(audioFileId, audio);

            return res.end(
                JSON.stringify({ uploadResult })
            );
        });
    }
}
