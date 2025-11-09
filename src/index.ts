import { AppServer } from "./server";
import { AudioServiceController } from "./controllers/AudioControllers";
import { AudioService } from "./services/AudioServices";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);
const audioService = new AudioService(s3Client);
const audioServiceController = new AudioServiceController(audioService);

const app = new AppServer(3000, audioServiceController);
app.start();
