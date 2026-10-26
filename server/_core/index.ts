import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { publicPlatformScript } from "./publicConfig";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ noServer: true });
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok", auth: "local-rpg", websocket: "enabled" }));
  app.get("/api/platform/config.js", (_req, res) => res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript()));
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected", source: "carteira-rpg" }));
    socket.on("message", (raw) => {
      for (const client of wss.clients) {
        if (client !== socket && client.readyState === WebSocket.OPEN) client.send(raw.toString());
      }
    });
  });
  const heartbeat = setInterval(() => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.ping();
    }
  }, 30000);
  const shutdown = () => { clearInterval(heartbeat); for (const client of wss.clients) client.close(1001, "server shutdown"); server.close(() => process.exit(0)); };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws") wss.handleUpgrade(request, socket, head, ws => wss.emit("connection", ws, request));
    else socket.destroy();
  });
  if (process.env.NODE_ENV === "development") await setupVite(app, server); else serveStatic(app);
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Carteira RPG online na porta ${port} • WebSocket /ws`));
}
startServer().catch(error => { console.error(error); process.exit(1); });
