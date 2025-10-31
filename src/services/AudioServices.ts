import { ServerResponse, IncomingMessage } from "http";

export const getAudioFromAwsS3Bucket = (req: IncomingMessage, res: ServerResponse, fileId: string) =>  {

    console.log("Fetching audio file..");
    console.log("Audio file found..");
    console.log("Compressing file...");
    console.log("Finished...");

    return res.end(
        JSON.stringify({ 
            fileId, 
            fileData: "UWOVU23KJNB2KB2N3K4BKNKJ2N342"
        })
    )
    
}

export const uploadAudioToAwsS3Bucket = (req: IncomingMessage, res: ServerResponse, fileId: string, filename: string) =>  {

    console.log("Fetching audio file..");
    console.log("Audio file found..");
    console.log("Compressing file...");
    console.log("Finished...");

    return res.end(
        JSON.stringify({ 
            fileId,
            message: "Upload Successful", 
            filename
        })
    )
}