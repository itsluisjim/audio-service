import {AppServer} from "./server";
import {AudioServiceController} from "./controllers/AudioControllers";
import {AudioService} from "./services/AudioServices";


const app = new AppServer(3000, new AudioServiceController(new AudioService()));
app.start();
