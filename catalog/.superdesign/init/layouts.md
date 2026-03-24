# Layouts — stacks

## Root Layout (app/layout.js)

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <div className="app-layout">
          <NavSidebar tenant={tenant} />
          <div className="sidebar-backdrop" />
          <AccountButton />
          <div className="main-area">
            {children}
            <SiteFooter tenant={tenant} />
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
```

## NavSidebar (app/NavSidebar.js)

Desktop only. Collapsed 80px, expands to 288px on hover.
Nav items: Start (/), Suche (/suche), Sammlungen (/sammlungen), Deins (/deins)

```jsx
<aside className="sidebar">
  <div className="sidebar-inner">
    <a href="/" className="sidebar-logo">
      <div className="logo-icon logo-icon--img"><img src={tenant.logoFavicon} /></div>
      <img src={tenant.logoFull} className="logo-full" />
    </a>
    <nav className="sidebar-nav">
      <div className="nav-section">
        {navItems.map(...)} // Home, Suche, Sammlungen
        // Deins (enabled if logged in)
      </div>
    </nav>
  </div>
</aside>
```

## BottomNav (app/BottomNav.js)

Mobile only (display:none on desktop, flex on max-width:767px).

```jsx
<nav className="bottom-nav">
  // Start, Suche, Sammlungen, Deins
</nav>
```

## AccountButton (app/AccountButton.js)

Fixed top-right. Shows avatar initials if logged in, login icon if not.
