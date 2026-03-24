# Routes — stacks

```
/                     → app/page.js           (Homepage: hero, search, reading strip, recommendations)
/suche                → app/suche/page.js     (Placeholder)
/sammlungen           → app/sammlungen/page.js
/sammlungen/[id]      → app/sammlungen/[id]/page.js
/biblios/[id]         → app/biblios/[id]/page.js  (Book detail)
/deins                → app/deins/page.js     (Personal dashboard, requires auth)
/konto                → app/konto/page.js     (Login)
/api/auth/[...nextauth] → NextAuth
/api/lists            → GET lists
/api/lists/[id]       → GET list
/api/lists/[id]/biblios → GET biblios in list
/api/renew            → POST renew checkout
```

## Layout

All pages share `app/layout.js` which renders:
- `<NavSidebar>` (desktop, collapsed 80px, expands on hover to 288px)
- `<BottomNav>` (mobile only, fixed bottom)
- `<AccountButton>` (fixed top-right)
- `<SiteFooter>`
