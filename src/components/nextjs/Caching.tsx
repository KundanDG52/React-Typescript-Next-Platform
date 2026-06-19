import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store'

const NX = '#ffffff'

const LAYERS = [
  { id: 'memo', name: 'Request Memoization', what: 'Dedupes identical fetches', last: 'one render pass', optout: 'use different args', inval: 'auto (ends with render)', loc: 'server', color: '#60a5fa' },
  { id: 'data', name: 'Data Cache', what: 'fetch() results', last: 'persists across requests & deploys', optout: "cache: 'no-store'", inval: 'revalidateTag / revalidatePath / time', loc: 'server', color: '#22c55e' },
  { id: 'route', name: 'Full Route Cache', what: 'Static HTML + RSC payload', last: 'until revalidated/redeployed', optout: 'dynamic APIs (cookies, no-store)', inval: 'revalidatePath, redeploy', loc: 'server', color: '#f59e0b' },
  { id: 'router', name: 'Router Cache', what: 'Prefetched RSC payloads', last: '30s (dynamic) / 5min (static)', optout: 'router.refresh()', inval: 'revalidate, server action, refresh', loc: 'client', color: '#a855f7' },
]

export function CacheLayers() {
  const [sel, setSel] = useState(0)
  const [viewed, setViewed] = useState<Set<number>>(new Set([0]))
  const checkAchievement = useStore(s => s.checkAchievement)
  useEffect(() => { if (viewed.size >= 4) checkAchievement('cache_whisperer') }, [viewed])
  const l = LAYERS[sel]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        {LAYERS.map((layer, i) => (
          <motion.button key={layer.id} onClick={() => { setSel(i); setViewed(v => new Set(v).add(i)) }} animate={{ scale: sel === i ? 1.01 : 1 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all"
            style={{ borderColor: sel === i ? layer.color : '#27272a', background: sel === i ? `${layer.color}15` : '#0f0f12' }}>
            <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold font-mono" style={{ background: `${layer.color}25`, color: layer.color }}>{i + 1}</span>
            <span className="text-sm font-medium" style={{ color: sel === i ? layer.color : '#e5e5e5' }}>{layer.name}</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded" style={{ background: layer.loc === 'client' ? '#a855f720' : '#3b82f620', color: layer.loc === 'client' ? '#c084fc' : '#60a5fa' }}>{layer.loc}</span>
            {viewed.has(i) && <span className="text-emerald-400 text-[10px]">✓</span>}
          </motion.button>
        ))}
      </div>
      <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg p-3 border grid grid-cols-2 gap-2 text-xs" style={{ borderColor: `${l.color}40`, background: `${l.color}08` }}>
        {[['caches', l.what], ['lasts', l.last], ['opt out', l.optout], ['invalidate', l.inval]].map(([k, v]) => <div key={k}><div className="text-[10px] text-white/35">{k}</div><div style={{ color: l.color }}>{v}</div></div>)}
      </motion.div>
      <p className="text-xs text-white/40">A request flows top→bottom; a hit at any layer short-circuits the rest. View all four to earn <b className="text-white">Cache Whisperer</b> ({viewed.size}/4).</p>
    </div>
  )
}

// ─── Cache invalidation ──────────────────────────────────────────────────────
const INVAL = {
  'revalidatePath("/blog")': ['data', 'route', 'router'],
  'revalidateTag("posts")': ['data', 'route'],
  'cookies() / headers()': ['route'],
}
export function CacheInvalidation() {
  const [api, setApi] = useState<keyof typeof INVAL>('revalidatePath("/blog")')
  const cleared = INVAL[api]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">{(Object.keys(INVAL) as (keyof typeof INVAL)[]).map(k => <button key={k} onClick={() => setApi(k)} className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-left" style={{ background: api === k ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)', border: api === k ? `1px solid ${NX}` : '1px solid transparent', color: api === k ? NX : 'rgba(255,255,255,0.5)' }}>{k}</button>)}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {LAYERS.map(l => { const clr = cleared.includes(l.id); return (
          <motion.div key={l.id} animate={{ opacity: clr ? 1 : 0.3 }} className="rounded-lg p-2 text-center border" style={{ borderColor: clr ? '#f43f5e' : '#27272a', background: clr ? '#f43f5e12' : 'transparent' }}>
            <div className="text-[9px] font-mono" style={{ color: clr ? '#f43f5e' : '#52525b' }}>{l.name.split(' ')[0]}</div>
            <div className="text-[9px] mt-0.5" style={{ color: clr ? '#f43f5e' : '#3f3f46' }}>{clr ? 'cleared' : 'kept'}</div>
          </motion.div>
        )})}
      </div>
      <p className="text-xs text-white/40">{api.startsWith('cookies') ? 'Reading cookies/headers opts a route into dynamic rendering — it skips the Full Route Cache entirely.' : `${api.split('(')[0]}() purges the highlighted layers; the Router Cache also refreshes on next navigation.`}</p>
    </div>
  )
}
