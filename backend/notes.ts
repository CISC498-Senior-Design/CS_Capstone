import { Router } from "express";
import { google } from "googleapis";
import { requireGoogle } from "./auth.js";

export const notesRouter = Router();
notesRouter.use("/api/notes", requireGoogle); //runs requireGoogle before so assumes users are signed in

const DOC_MIME = "application/vnd.google-apps.document";

// List the user's notes
notesRouter.get("/api/notes", async (req, res) => {
    const drive = google.drive({ version: "v3", auth: res.locals.google });
    const { data } = await drive.files.list({ // the ".files" makes it limited to app created files
        q: `mimeType='${DOC_MIME}' and trashed=false`, //search query
        fields: "files(id, name, modifiedTime)",
        orderBy: "modifiedTime desc",
    });
    res.json(data.files ?? []); //returns either data files array or empty array
});

// Create a note as a new Google Doc
notesRouter.post("/api/notes", async (req, res) => {
    const { title = "Untitled note", content = "" } = req.body; // as in, takes info from req.body (needs express();) and sets to defaults otherwise
    const drive = google.drive({ version: "v3", auth: res.locals.google });
    const { data } = await drive.files.create({
        requestBody: { name: title, mimeType: DOC_MIME }, // Drive converts the text into a Doc
        media: { mimeType: "text/plain", body: content },
        fields: "id, name, modifiedTime",
    });
    res.status(201).json(data);
});

// Read one note: title + text content
notesRouter.get("/api/notes/:id", async (req, res) => {
  const drive = google.drive({ version: "v3", auth: res.locals.google });
  const [meta, text] = await Promise.all([
    drive.files.get({ fileId: req.params.id, fields: "id, name, modifiedTime" }),
    drive.files.export(
      { fileId: req.params.id, mimeType: "text/plain" },
      { responseType: "text" }
    ),
  ]);

  res.json({
    ...meta.data,
    // Apparently there's an invisible BOM character at the start of exported text
    content: String(text.data).replace(/^\uFEFF/, ""),
  });
});

// Save changes to the title and/or content
notesRouter.patch("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body as { title?: string; content?: string };
  const drive = google.drive({ version: "v3", auth: res.locals.google });

  const { data } = await drive.files.update({
    fileId: req.params.id,
    requestBody: title !== undefined ? { name: title } : {},
    media:
      content !== undefined ? { mimeType: "text/plain", body: content } : undefined,
    fields: "id, name, modifiedTime",
  });

  res.json(data);
});