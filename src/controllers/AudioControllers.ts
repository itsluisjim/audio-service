import { ServerResponse, IncomingMessage } from "http";
import { AudioService } from "../services/AudioServices.ts";
import formidable from "formidable";


export class AudioServiceController {
    private audioService: AudioService;

    constructor(){
        this.audioService = new AudioService();
    }

    public getAudio(req: IncomingMessage, res: ServerResponse, audioFileId: string) {

        const audioData = this.audioService.getAudioFromAwsS3Bucket(audioFileId);

        return res.end(
            JSON.stringify({ audioData })
        );
    }

    public uploadAudio(req: IncomingMessage, res: ServerResponse){
        const form = formidable({ multiples: false });

        form.parse(req, (err, fields, files) => {

            const audio = files.audio; // Form field name is 'audio'

            const filename = audio?.[0]?.originalFilename || "unknown_file";

            const audioFileId: string = "A_VERY_UNIQUE_ID";

            const uploadResult = this.audioService.uploadAudioToAwsS3Bucket(audioFileId, filename);

            return res.end(
                JSON.stringify({ uploadResult })
            );
        });
    }
}
