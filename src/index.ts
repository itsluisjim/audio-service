import { AudioServiceController } from "./controllers/AudioControllers.ts";
import { AppServer } from "./server.ts";
import { AudioService } from "./services/AudioServices.ts";

const app = new AppServer(3000, new AudioServiceController(new AudioService()));
app.start();
