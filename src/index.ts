import { AppServer } from "./server.ts";

const app = new AppServer(3000);
app.start();
