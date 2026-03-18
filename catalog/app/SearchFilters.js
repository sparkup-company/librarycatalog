'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, useTransition } from 'react'
import {
  Book, Headphones, Tablet,
  Sparkles, Heart, Zap, GraduationCap,
  SlidersHorizontal,
} from 'lucide-react'

const MEDIA_TYPES = [
  { label: 'Buch', icon: Book },
  { label: 'Hörbuch', icon: Headphones },
  { label: 'E-Book', icon: Tablet },
]

const TOPICS = [
  { label: 'Fantasy', icon: Sparkles },
  { label: 'Romantik', icon: Heart },
  { label: 'Action', icon: Zap },
  { label: 'Wissen', icon: GraduationCap },
]

const LANGUAGES = ['Deutsch', 'Englisch', 'Arabisch', 'Spanisch', 'Italienisch']

export default function SearchFilters({ available, libraries = [] }) {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState({ media: [], library: [], topic: [], lang: [] })

  const panelRef = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    if (!panelOpen) return
    function handleClick(e) {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [panelOpen])

  function toggleAvailable() {
    const p = new URLSearchParams(params)
    if (available) p.delete('available')
    else p.set('available', '1')
    startTransition(() => router.push('/?' + p.toString()))
  }

  function toggle(group, value) {
    setSelected(s => {
      const arr = s[group]
      return {
        ...s,
        [group]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  const totalSelected = Object.values(selected).flat().length

  return (
    <div className="filter-bar">
      <button
        className={`filter-toggle${available ? ' active' : ''}`}
        onClick={toggleAvailable}
      >
        Nur verfügbare Medien
      </button>

      <div className="filter-panel-anchor">
        <button
          ref={btnRef}
          className={`filter-tag-btn${panelOpen || totalSelected > 0 ? ' active' : ''}`}
          onClick={() => setPanelOpen(o => !o)}
        >
          <SlidersHorizontal size={14} />
          Filter
          {totalSelected > 0 && <span className="filter-count">{totalSelected}</span>}
        </button>

        {panelOpen && (
          <div ref={panelRef} className="filter-panel">
            <FilterSection
              title="Medientyp"
              items={MEDIA_TYPES}
              group="media"
              selected={selected.media}
              onToggle={toggle}
              withIcon
            />
            <FilterSection
              title="Teilbibliothek"
              items={libraries.map(name => ({ label: name }))}
              group="library"
              selected={selected.library}
              onToggle={toggle}
            />
            <FilterSection
              title="Thema"
              items={TOPICS}
              group="topic"
              selected={selected.topic}
              onToggle={toggle}
              withIcon
            />
            <FilterSection
              title="Sprache"
              items={LANGUAGES.map(l => ({ label: l }))}
              group="lang"
              selected={selected.lang}
              onToggle={toggle}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function FilterSection({ title, items, group, selected, onToggle, withIcon }) {
  if (!items.length) return null
  return (
    <div className="filter-section">
      <p className="filter-section-title">{title}</p>
      <div className="filter-section-chips">
        {items.map(item => {
          const Icon = item.icon
          const isActive = selected.includes(item.label)
          return (
            <button
              key={item.label}
              className={`filter-chip${isActive ? ' active' : ''}`}
              onClick={() => onToggle(group, item.label)}
            >
              {withIcon && Icon && <Icon size={13} />}
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
