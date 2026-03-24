# Extractable Components — stacks

## Layout Components (high priority for extraction)

### NavSidebar
- Type: Layout
- Current: Collapsible desktop sidebar (80px → 288px on hover)
- Props: tenant (for logo), activeItem, isLoggedIn
- Candidate for replacement with TopNav

### BottomNav
- Type: Layout
- Current: Mobile-only fixed bottom navigation
- Props: activeItem, isLoggedIn

### AccountButton
- Type: Layout
- Props: userName, isLoggedIn

### SiteFooter
- Type: Layout
- Props: tenant (contact, links, hours)

## Basic Components

### BookCard
- Props: title, author, isbn, biblioId, available, dueDate

### StripCover
- Props: isbn, title, biblioId (for color generation)

### SearchForm
- Props: initialQuery

### LibrarianRecommendationCard
- Props: quote, librarianName, librarianRole, isbn, title, biblioId
