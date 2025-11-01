import http from "http";

import { getAudio, uploadAudio } from "./controllers/AudioControllers.ts";

// create the server
const server = http.createServer((req, res) => {
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
    return getAudio(req, res, pathParts[2]);
  }

  // Route: POST /api/audio/upload
  if (method === "POST" && url === "/api/audio/upload") {
    return uploadAudio(req, res);
  }

  // Handle 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
