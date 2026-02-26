import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { AudioServiceController } from "./controllers/AudioControllers";
import express from "express";
import cors from "cors";

@injectable()
export class AppServer {
    private server: express.Express;
    private router: express.Router;
    private port: number;
    private audioServiceController: AudioServiceController;

    constructor(@inject("Port") port = 3000, @inject("AudioServiceController") audioServiceController: AudioServiceController) {
        this.port = port;
        this.audioServiceController = audioServiceController;
        this.server = express();
        this.router = express.Router();
    }

    public start() {
        this.server.use(cors())
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));

        this.server.use("/api/audio", this.router);
        
        this.router.get('/list', (req, res) => this.audioServiceController.listAudios(req, res));
        this.router.get('/:id', (req: any, res: any) => this.audioServiceController.getAudio(req, res, req.params.id));
        this.router.post('/upload', (req, res) => this.audioServiceController.uploadAudio(req, res));

        // global error handler
        this.server.use((err: any, req: any, res: any, next: any) => {
            console.log("Global error:", err);

            res.status(err.status || 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        });

        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
