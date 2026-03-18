'use client'

import Link from 'next/link'

const RECOMMENDATIONS = [
  {
    quote: '„Dieses Buch sollte jede Schülerin und jeder Schüler lesen – direkt, ehrlich und unverzichtbar."',
    authorName: 'Sandra Butte',
    authorRole: 'Kinder- & Jugendbuch',
    isbn: '9783423640985',
    title: 'Rassismus, Antirassismus und du',
    href: '/biblios/1490',
    rotate: 'rotate(3deg)',
  },
  {
    quote: '„Selten hat mich ein Manga so überrascht – warmherzig, witzig und echtes Herzrasen."',
    authorName: 'Bianca Möhle',
    authorRole: 'Manga & Graphic Novels',
    isbn: '9783753929972',
    title: 'Echt jetzt, Tamon?! [1]',
    href: '/biblios/1611',
    rotate: 'rotate(-3deg)',
  },
]

export default function LibrarianRecommendations() {
  return (
    <section className="recommendations-section">
      <h2 className="recommendations-heading">Empfohlen von unseren Bibliothekarinnen</h2>
      <div className="recommendations-grid">
        {RECOMMENDATIONS.map((rec, i) => (
          <Link key={i} href={rec.href} className="recommendation-card">
            <span className="recommendation-quote-mark">"</span>
            <div className="recommendation-content">
              <p className="recommendation-quote">{rec.quote}</p>
              <div className="recommendation-author">
                <div className="recommendation-avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                <div>
                  <p className="recommendation-author-name">{rec.authorName}</p>
                  <span className="recommendation-author-role">{rec.authorRole}</span>
                </div>
              </div>
            </div>
            <div className="recommendation-cover-wrap">
              <div className="recommendation-cover-glow" />
              <img
                src={`https://cover.ekz.de/${rec.isbn}.jpg`}
                alt={rec.title}
                className="recommendation-cover"
                style={{ '--rotate': rec.rotate }}
                onError={e => { e.target.src = `https://covers.openlibrary.org/b/isbn/${rec.isbn}-M.jpg?default=false` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
