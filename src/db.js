const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const sb = async (method, path, body) => {
  const headers = {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
  };
  if (method === "POST" || method === "PATCH") {
    headers["Prefer"] = "return=minimal";
  }
  try {
    const r = await fetch(`${URL}/rest/v1/${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 204 || r.status === 201) return true;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

export const db = {
  // --- Personas (shared, Supabase) ---
  getPersonas: () => sb("GET", "personas?order=created_at.asc"),
  savePersona: (p) => sb("POST", "personas", p),
  deletePersona: (id) => sb("DELETE", `personas?id=eq.${id}`),

  // --- Logs (shared, Supabase) ---
  saveLog: (log) => sb("POST", "logs", log),
  getLogs: () => sb("GET", "logs?order=created_at.desc&limit=200"),

  // --- User history (personal, localStorage) ---
  getUserHistory: (userName) => {
    try {
      const raw = localStorage.getItem(`hist_${userName}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  setUserHistory: (userName, ids) => {
    try {
      localStorage.setItem(`hist_${userName}`, JSON.stringify(ids));
    } catch {}
  },
};
