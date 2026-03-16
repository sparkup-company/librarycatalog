const BASE_URL = "https://koha.adminkuhn.ch:8443/api/v1";
const SESSION_COOKIE = process.env.KOHA_SESSION_COOKIE;

const headers = {
  "Accept": "application/json",
  "Cookie": `CGISESSID=${SESSION_COOKIE}`,
};

async function listBiblios(search = null, perPage = 10) {
  let url = `${BASE_URL}/biblios?_per_page=${perPage}`;

  if (search) {
    const q = JSON.stringify({ title: { "-like": `%${search}%` } });
    url += `&q=${encodeURIComponent(q)}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- run ---
(async () => {
  const searchTerm = process.argv[2] ?? null;

  const biblios = await listBiblios(searchTerm);

  console.log(`Found ${biblios.length} biblios${searchTerm ? ` for "${searchTerm}"` : ""}:\n`);
  for (const b of biblios) {
    console.log(`[${b.biblio_id}] ${b.title} — ${b.author ?? "unknown"} (${b.copyright_date ?? "n/a"})`);
  }
})();
