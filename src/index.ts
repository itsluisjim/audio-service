import { AppServer } from "./server";
import { AudioServiceController } from "./controllers/AudioControllers";
import { AudioRepository } from "./services/AudioRepository";
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
const audioRepository = new AudioRepository(s3Client);
const audioServiceController = new AudioServiceController(audioRepository);

const app = new AppServer(3000, audioServiceController);
app.start();
