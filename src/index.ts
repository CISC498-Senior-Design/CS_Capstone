import express from "express";
import type { Request, Response } from "express";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// API routes
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Backened connected" });
});

// In production, serve the built React app
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(import.meta.dirname, "../frontend/dist");
  app.use(express.static(frontendDist));
  // Send index.html for any non-API route so React Router works
  app.get("/{*splat}", (req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});