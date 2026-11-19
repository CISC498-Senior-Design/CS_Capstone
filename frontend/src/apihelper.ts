export type NoteSummary = { id: string; name: string; modifiedTime: string };
export type Note = NoteSummary & { content: string };

//generic request function that requests T and returns a promis of T
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" }, //needed, as express only takes this format; text/plain otherwise
    ...init, //built in type for usal fetch options
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>; //assumption, not check
}

export const api = {
  listNotes: () => request<NoteSummary[]>("/api/notes"),

  getNote: (id: string) => request<Note>(`/api/notes/${id}`),

  createNote: (title = "Untitled note") =>
    request<NoteSummary>("/api/notes", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  updateNote: (id: string, changes: { title?: string; content?: string }) =>
    request<NoteSummary>(`/api/notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
};