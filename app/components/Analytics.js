'use client'
import { useEffect } from 'react'

const SUPABASE_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ'

export default function Analytics() {
  useEffect(() => {
    // Skip tracking for Aleko
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return
    if (window.location.search.includes('notrack')) { localStorage.setItem('notrack','1'); return }
    if (localStorage.getItem('notrack')) return

    // Generate stable visitor ID per device
    let vid = localStorage.getItem('_vid')
    if (!vid) { vid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('_vid', vid) }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || null

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site: 'alekotools',
        path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent?.slice(0, 200) || null,
        visitor_id: vid,
        timezone: tz,
      }),
    }).catch(() => {})
  }, [])

  return null
}
