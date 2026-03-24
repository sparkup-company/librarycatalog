# Components — stacks

## BookCard

Search result card. Shows availability pill, media type, title, author, cover image, action buttons.

Key classes: `.book-card-wrapper`, `.book-card`, `.book-card-title`, `.book-card-author`, `.book-card-cover-area`, `.book-card-btn--borrow`, `.book-card-btn--reserve`, `.book-card-like`, `.book-card-pill`, `.book-card-pill--unavailable`

## BookCover

Displays book cover image by ISBN via open-library API, or fallback with colored background + first letter.

## StripCover

Small thumbnail cover (96×144px) used in horizontal scrolling strips.

## SearchForm

Pill-shaped search input with search icon and orange submit button.

Classes: `.search-form`, `.search-input`, `.search-btn`, `.search-icon`

## SearchResults

Grid of BookCard components.
Classes: `.results-section`, `.results-grid` (auto-fill, minmax 220px)

## LibrarianRecommendations

Two-column grid of recommendation cards with quote, librarian name/role, and rotated book cover.
Classes: `.recommendations-section`, `.recommendations-grid`, `.recommendation-card`, `.recommendation-quote`, `.recommendation-author`

## CurrentlyReadingStrip

Horizontal scrolling strip of StripCovers with heading "Was [City] gerade liest".
Classes: `.reading-strip-section`, `.reading-strip`

## SiteFooter

Dark footer with contact info, opening hours, navigation links, branding.
Classes: `.site-footer`, `.site-footer-inner`, `.site-footer-grid`

## PatronBadge

Community banner shown on homepage: "X andere Personen nutzen gerade die Bibliothek mit dir!"

## RenewButton

Client component. Calls POST /api/renew. Shows success/error state inline.
