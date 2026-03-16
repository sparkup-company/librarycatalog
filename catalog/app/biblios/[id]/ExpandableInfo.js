'use client'
import { useState } from 'react'

export default function ExpandableInfo({ fields }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="detail-expandable">
      <button className="detail-expandable-toggle" onClick={() => setOpen(o => !o)}>
        <span>Mehr Informationen</span>
        <span style={{ fontSize: '1.25rem', transform: open ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div className="detail-expandable-grid">
          {fields.map(([lbl, val]) => (
            <div key={lbl}>
              <p className="detail-meta-label">{lbl}</p>
              <p className="detail-meta-value">{val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
