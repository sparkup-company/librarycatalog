# stacks — Entwicklungsrichtlinien
 
## Produkt & Kontext

**stacks** ist ein öffentlicher Bibliothekskatalog als Multi-Tenant-SaaS.
- Zielgruppe: Stadtbibliotheken im deutschsprachigen Raum
- Geplant: mehrere hundert Kunden, Verträge über Jahrzehnte, geringe Marge
- Priorität: **Stabilität und minimaler Wartungsaufwand** vor Features
- Geplante Erweiterung: Bibliotheks-App (PWA zuerst, React Native mittelfristig)

Aktuell konfigurierte Tenants: `augsburg`, `fuerth`, `demo` (alle gegen dieselbe Koha-Testinstanz)

---

## Architekturprinzipien

### 1. Koha-Logik gehört in API-Routes, nicht in Server Components

Datenzugriff auf Koha **immer** über `app/api/`-Routes kapseln.
Server Components dürfen API-Routes aufrufen, aber nicht direkt `getCatalogAdapter()`.

**Warum:** Die API-Routes sind die gemeinsame Schnittstelle für Web-Katalog und zukünftige App.
Eine native App kann keine Server Components aufrufen, aber die gleichen API-Routes nutzen.

```js
// FALSCH — direkt in Server Component
const catalog = getCatalogAdapter()
const biblio = await catalog.getBiblio(id)

// RICHTIG — über API-Route
const res = await fetch(`/api/biblios/${id}`)
const biblio = await res.json()
```

> Hinweis: `app/deins/page.js` und `app/biblios/[id]/page.js` rufen den Adapter noch direkt auf.
> Das ist eine bekannte offene Baustelle, noch nicht migriert.

### 2. Nie tenant-spezifisch verzweigen

Im Code niemals auf Tenant-IDs prüfen.

```js
// VERBOTEN
if (tenant.id === 'augsburg') { ... }

// RICHTIG
if (tenant.features?.branches) { ... }
```

**Warum:** Jede Ausnahme im Code für einen Tenant muss bei jedem neuen Tenant neu bewertet werden.
Features gehören in die Tenant-Config, nicht in Conditional-Logik.

### 3. Features explizit konfigurieren

Alle optionalen Funktionen werden im `features`-Objekt der Tenant-Config aktiviert/deaktiviert.
Neue Features immer zuerst als konfigurierbares Feature anlegen, auch wenn es zunächst überall aktiv ist.

```json
{
  "features": {
    "branches": false,
    "ratings": false,
    "holds": true,
    "renewals": true
  }
}
```

Abhängigkeiten zwischen Features (z.B. `ratings` setzt `branches` voraus) werden in einer
Validierungsfunktion beim Start geprüft — **nicht** als automatisches Chaining zur Laufzeit.

### 4. Framework-Abhängigkeiten minimieren

- Keine experimentellen Next.js-Features
- Keine komplexen Middleware-Chains
- Den Koha-Adapter sauber halten, damit ein späteres Framework-Wechsel nur das Rendering betrifft

---

## Tenant-Konfiguration

Jeder Tenant hat eine JSON-Datei unter `catalog/tenants/<id>.json`.
Der aktive Tenant wird per Host-Header bestimmt (siehe `lib/catalog/index.js`).

**Pflichtfelder:** `id`, `name`, `city`, `adapter`, `apiBase`
**Optionale Felder:** `colors`, `logoFull`, `logoFavicon`, `contact`, `footerLinks`, `features`, `branches`

Neue Kunden = neue JSON-Datei, kein Code-Änderung.
Mittelfristig wird eine Adminkonsole diese JSONs ersetzen — die Datenstruktur bleibt dabei gleich.

---

## Bekannte Baustellen (priorisiert)

| Priorität | Thema | Datei |
|---|---|---|
| Hoch | Datenzugriff vereinheitlichen → alles durch API-Routes | `app/deins/page.js`, `app/biblios/[id]/page.js` |
| Hoch | `force-dynamic` auf Detailseite entfernen/prüfen | `app/biblios/[id]/page.js:6` |
| Mittel | Auth-Credentials-Duplikation bereinigen | `app/api/renew/route.js`, `lib/auth.js` |
| Mittel | Empfehlungs-Platzhalter (`searchBiblios('der')`) ersetzen | `app/deins/page.js:132` |
| Mittel | `features`-Schema in alle Tenant-Configs einführen | `tenants/*.json` |
| Niedrig | Suchqualität via SRU verbessern (blockiert durch Anubis) | `lib/catalog/search/koha-sru.js` |
| Niedrig | NextAuth v4 → Auth.js v5 migrieren | `lib/auth.js` |

---

## Was explizit nicht gemacht wird

- **Kein TypeScript** aktuell — bewusste Entscheidung für Einstiegsgeschwindigkeit.
  Mittelfristig sinnvoll, aber kein Blocker.
- **Kein separates PHP-Backend** — die Adapter-Schicht in `lib/catalog/` erfüllt denselben Zweck
  mit weniger Infrastruktur.
- **Kein CGI-Scraping langfristig** — `getListBiblios` in `lib/catalog/adapters/koha.js` scraped
  aktuell die Koha Staff-Oberfläche. Das ist ein temporärer Workaround, kein dauerhafter Ansatz.
