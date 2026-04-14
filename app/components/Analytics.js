'use client'
import { useEffect } from 'react'

const SUPABASE_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ'

export default function Analytics() {
  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        site: 'alekotools',
        path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent?.slice(0, 200) || null,
      }),
    }).catch(() => {})
  }, [])

  return null
}
