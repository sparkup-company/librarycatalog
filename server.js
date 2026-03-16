const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const KOHA_BASE = "https://koha.adminkuhn.ch:8443/api";
const SESSION_COOKIE = process.env.KOHA_SESSION_COOKIE;

http.createServer((req, res) => {
  // Serve the HTML file
  if (req.url === "/" || req.url === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(__dirname, "koha_test.html")).pipe(res);
    return;
  }

  // Proxy /api/* to Koha
  if (req.url.startsWith("/api/")) {
    const kohaUrl = KOHA_BASE + req.url.slice(4); // strip /api prefix
    https.get(kohaUrl, {
      headers: {
        "Accept": "application/json",
        "Cookie": `CGISESSID=${SESSION_COOKIE}`,
      }
    }, (kohaRes) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      kohaRes.pipe(res);
    }).on("error", (e) => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(3001, () => console.log("Open http://localhost:3001"));
