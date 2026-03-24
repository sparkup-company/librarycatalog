# Pages — stacks

## Homepage (app/page.js)

Dependencies:
- app/page.js
- app/SearchForm.js
- app/SearchHeader.js
- app/SearchResults.js
- app/SearchResultsSkeleton.js
- app/PatronBadge.js
- app/CurrentlyReadingStrip.js
- app/LibrarianRecommendations.js
- app/BookCard.js
- app/BookCover.js
- app/StripCover.js
- lib/catalog/index.js
- app/globals.css

## Book Detail (app/biblios/[id]/page.js)

Dependencies:
- app/biblios/[id]/page.js
- app/biblios/[id]/ExpandableInfo.js
- app/BookCover.js
- lib/catalog/index.js
- app/globals.css

## Personal Dashboard (app/deins/page.js)

Dependencies:
- app/deins/page.js
- app/deins/RenewButton.js
- app/StripCover.js
- lib/auth.js
- lib/catalog/index.js
- app/globals.css

## All pages share (via layout.js):

- app/NavSidebar.js
- app/BottomNav.js
- app/AccountButton.js
- app/SiteFooter.js
- app/globals.css
