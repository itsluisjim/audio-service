import http, { IncomingMessage, ServerResponse } from "http";
import { AudioServiceController } from "./controllers/AudioControllers.ts";

export class AppServer {
    private server: http.Server;
    private port: number;
    private audioServiceController: AudioServiceController;

    constructor(port = 3000) {
        this.port = port;
        this.audioServiceController = new AudioServiceController();
        this.server = http.createServer(this.requestHandler.bind(this));
    }

    private requestHandler(req: IncomingMessage, res: ServerResponse) {

        const url = req.url || "";
        const method = req.method || "";

        // Parse URL path
        const pathParts: string[] = url.split("/").filter(Boolean);

        // Route: GET /api/audio/:id
        if (
            method === "GET" &&
            pathParts[0] === "api" &&
            pathParts[1] === "audio" &&
            pathParts[2]
        ) {
            return this.audioServiceController.getAudio(req, res, pathParts[2]);
        }

        // Route: POST /api/audio/upload
        if (method === "POST" && url === "/api/audio/upload") {
            return this.audioServiceController.uploadAudio(req, res);
        }

        // Handle 404
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not founddd" }));
    }

    public start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}