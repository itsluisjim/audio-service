// This is a service file, it should know nothing about requests and responses, that's the controller responsiblity, a service contains business logic that can be reused
//  if it's bounded to requests and responses it's less reusable, so I'd refactor these methods to receive just the data they need
export class AudioService {
    public getAudioFromAwsS3Bucket(fileId: string){
        return {
            fileId,
            fileData: "UWOVU23KJNB2KB2N3K4BKNKJ2N342"
        };
    }

    public uploadAudioToAwsS3Bucket(fileId: string, filename: string){
        // Upload audio file to S3 bucket
        return {
            fileId,
            message: "Upload Successful",
            filename
        };
    }
}
