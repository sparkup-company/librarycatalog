import { getTenantConfig } from '../lib/catalog/index.js'
import { buildCssVars } from '../lib/colors.js'
import Script from 'next/script'
import NavSidebar from './NavSidebar.js'
import BottomNav from './BottomNav.js'
import AccountButton from './AccountButton.js'
import SiteFooter from './SiteFooter.js'
import Providers from './providers.js'
import './globals.css'

export const metadata = {
  title: 'Library Catalog',
}

export default function RootLayout({ children }) {
  const tenant = getTenantConfig()
  const cssVars = buildCssVars(tenant.colors)
  const cssVarStr = Object.entries(cssVars).map(([k,v]) => `${k}:${v}`).join(';')

  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {tenant.logoFavicon && <link rel="icon" href={tenant.logoFavicon} />}
        <style>{`:root{${cssVarStr}}`}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div className="app-layout">
            <NavSidebar tenant={tenant} />
            <div className="sidebar-backdrop" />
            <AccountButton />

            {/* Main content */}
            <div className="main-area">
              {children}
              <SiteFooter tenant={tenant} />
            </div>

            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}
