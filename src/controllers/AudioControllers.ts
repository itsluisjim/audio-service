import { ServerResponse, IncomingMessage } from "http";
import { getAudioFromAwsS3Bucket, uploadAudioToAwsS3Bucket } from "../services/AudioServices.ts";
import formidable from "formidable";


export const getAudio = (req: IncomingMessage, res: ServerResponse, audioFileId: string) => {

    return getAudioFromAwsS3Bucket(req, res, audioFileId);
}

export const uploadAudio = (req: IncomingMessage, res: ServerResponse) => {

    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {

        const audio = files.audio; // Form field name is 'audio'

        const filename = audio?.[0]?.originalFilename || "unknown_file";

        const audioFileId: string = "A_VERY_UNIQUE_ID";

        return uploadAudioToAwsS3Bucket(req, res, audioFileId, filename);
    });
}
