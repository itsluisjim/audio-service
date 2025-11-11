import { AudioServiceController } from "./controllers/AudioControllers";
import express from "express";

export class AppServer {
    private server: express.Express;
    private router: express.Router;
    private port: number;
    private audioServiceController: AudioServiceController;

    constructor(port = 3000, audioServiceController: AudioServiceController) {
        this.port = port;
        this.audioServiceController = audioServiceController;
        this.server = express();
        this.router = express.Router();
    }

    public start() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));

        this.server.use("/api/audio", this.router);

        this.router.get('/:id', (req, res) => this.audioServiceController.getAudio(req, res, req.params.id));
        this.router.post('/upload', (req, res) => this.audioServiceController.uploadAudio(req, res));

        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
