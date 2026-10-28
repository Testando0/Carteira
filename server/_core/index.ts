import "dotenv/config";
import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { publicPlatformScript } from "./publicConfig";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ noServer: true });
  type SharedState = { data?: unknown; accounts?: unknown[] };
  const stateFile = path.resolve(process.cwd(), "data", "carteira-shared-state.json");
  let shared: SharedState = {};
  try { shared = JSON.parse(fs.readFileSync(stateFile, "utf8")) as SharedState; } catch { shared = {}; }
  const persistShared = () => { fs.mkdirSync(path.dirname(stateFile), { recursive: true }); fs.writeFileSync(stateFile, JSON.stringify(shared)); };
  const broadcast = (message: string, except?: WebSocket) => { for (const client of wss.clients) if (client !== except && client.readyState === WebSocket.OPEN) client.send(message); };
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok", auth: "local-rpg", websocket: "enabled" }));
  app.get("/api/platform/config.js", (_req, res) => res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript()));
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected", source: "carteira-rpg" }));
    if (shared.data) socket.send(JSON.stringify({ type: "store-sync", payload: shared.data }));
    if (shared.accounts) socket.send(JSON.stringify({ type: "accounts-sync", payload: shared.accounts }));
    socket.on("message", (raw) => {
      try {
        const message = JSON.parse(raw.toString()) as { type?: string; payload?: unknown };
        if (message.type === "store-sync") { shared.data = message.payload; persistShared(); }
        if (message.type === "accounts-sync" && Array.isArray(message.payload)) { shared.accounts = message.payload; persistShared(); }
      } catch { /* Ignore malformed client messages and keep the socket alive. */ }
      broadcast(raw.toString(), socket);
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
