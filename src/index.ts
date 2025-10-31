import http from "http";

import { getAudio, uploadAudio } from "./controllers/AudioControllers.ts"

// create the server
const server = http.createServer((req, res) => {
    const audioFileId: string = req.url?.split('/')[3]!;

    // get audio file
   if (req.method == "GET" && req.url == `/api/audio/${audioFileId}`) {
     return getAudio(req, res);
   }

   // upload audio
   if (req.method == "POST" && req.url == "/api/audio/upload") {
     return uploadAudio(req, res);
   }
});

server.listen(3000, () => {
   console.log("Server is running on port 3000");
});

