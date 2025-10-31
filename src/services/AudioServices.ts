import { ServerResponse, IncomingMessage } from "http";

// This is a service file, it shoul dknow nothing about requests and responses, that's the controller responsiblity, a service contains business logic that can be reused
//  if it's bounded to requests and response it's less reusable, so I'd refactor these methods to receive just the data they need
export const getAudioFromAwsS3Bucket = (
  req: IncomingMessage,
  res: ServerResponse,
  fileId: string,
) => {
  console.log("Fetching audio file..");
  console.log("Audio file found..");
  console.log("Compressing file...");
  console.log("Finished...");

  return res.end(
    JSON.stringify({
      fileId,
      fileData: "UWOVU23KJNB2KB2N3K4BKNKJ2N342",
    }),
  );
};

export const uploadAudioToAwsS3Bucket = (
  req: IncomingMessage,
  res: ServerResponse,
  fileId: string,
  filename: string,
) => {
  console.log("Fetching audio file..");
  console.log("Audio file found..");
  console.log("Compressing file...");
  console.log("Finished...");

  return res.end(
    JSON.stringify({
      fileId,
      message: "Upload Successful",
      filename,
    }),
  );
};
