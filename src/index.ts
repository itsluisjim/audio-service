import "reflect-metadata";
import { container } from "tsyringe";
import { AppServer } from "./server";
import { AudioServiceController } from "./controllers/AudioControllers";

container.register<number>('Port', { useValue: 3000 });

// Register the controller implementation for the interface token
container.register<AudioServiceController>('AudioServiceController', { useClass: AudioServiceController });

// Resolve the AppServer (tsyringe now knows how to build it)
const appServer = container.resolve(AppServer);

appServer.start();
