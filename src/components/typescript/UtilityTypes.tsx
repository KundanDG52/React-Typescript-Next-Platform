import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'

const TS = '#3178c6'
interface Field { name: string; type: string }
const BASE: Field[] = [
  { name: 'id', type: 'number' }, { name: 'name', type: 'string' },
  { name: 'email', type: 'string' }, { name: 'role', type: 'string' },
]
const BASE_OPTIONAL = ['email'] // email is optional in the source

type ObjUtil = 'Partial' | 'Required' | 'Readonly' | 'Pick' | 'Omit'
const OBJ: ObjUtil[] = ['Partial', 'Required', 'Readonly', 'Pick', 'Omit']

function objSig(u: ObjUtil): string {
  if (u === 'Pick') return `Pick<User, 'id' | 'name'>`
  if (u === 'Omit') return `Omit<User, 'email'>`
  return `${u}<User>`
}

type TypeUtil = 'Record' | 'Exclude' | 'Extract' | 'NonNullable' | 'ReturnType' | 'Parameters' | 'Awaited'
const TYPE_UTILS: Record<TypeUtil, { input: string; output: string; note: string }> = {
  Record: { input: `Record<'a' | 'b', number>`, output: `{ a: number; b: number }`, note: 'builds an object type from keys → value type' },
  Exclude: { input: `Exclude<'a' | 'b' | 'c', 'a'>`, output: `'b' | 'c'`, note: 'removes members of the second union from the first' },
  Extract: { input: `Extract<'a' | 'b' | 'c', 'a' | 'x'>`, output: `'a'`, note: 'keeps only members present in both' },
  NonNullable: { input: `NonNullable<string | null | undefined>`, output: `string`, note: 'strips null & undefined' },
  ReturnType: { input: `ReturnType<() => User>`, output: `User`, note: 'extracts a function’s return type' },
  Parameters: { input: `Parameters<(a: number, b: string) => void>`, output: `[number, string]`, note: 'extracts params as a tuple' },
  Awaited: { input: `Awaited<Promise<Promise<string>>>`, output: `string`, note: 'recursively unwraps Promise layers' },
}

export function UtilityTransformer() {
  const [group, setGroup] = useState<'obj' | 'type'>('obj')
  const [obj, setObj] = useState<ObjUtil>('Partial')
  const [tu, setTu] = useState<TypeUtil>('Record')

  const picked = ['id', 'name']
  function fieldState(f: Field) {
    switch (obj) {
      case 'Partial': return { optional: true, readonly: false, dim: false, gone: false }
      case 'Required': return { optional: false, readonly: false, dim: false, gone: false }
      case 'Readonly': return { optional: BASE_OPTIONAL.includes(f.name), readonly: true, dim: false, gone: false }
      case 'Pick': return { optional: BASE_OPTIONAL.includes(f.name), readonly: false, dim: !picked.includes(f.name), gone: false }
      case 'Omit': return { optional: BASE_OPTIONAL.includes(f.name), readonly: false, dim: false, gone: f.name === 'email' }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(['obj', 'type'] as const).map(g => <button key={g} onClick={() => setGroup(g)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: group === g ? `${TS}22` : 'rgba(255,255,255,0.04)', border: group === g ? `1px solid ${TS}` : '1px solid transparent', color: group === g ? TS : 'rgba(255,255,255,0.5)' }}>{g === 'obj' ? 'Object utilities' : 'Type utilities'}</button>)}
      </div>

      {group === 'obj' ? (
        <>
          <div className="flex flex-wrap gap-1.5">{OBJ.map(u => <button key={u} onClick={() => setObj(u)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: obj === u ? `${TS}22` : 'rgba(255,255,255,0.04)', border: obj === u ? `1px solid ${TS}` : '1px solid transparent', color: obj === u ? TS : 'rgba(255,255,255,0.55)' }}>{u}</button>)}</div>
          <div className="font-mono text-xs text-white/50">type Result = <span style={{ color: TS }}>{objSig(obj)}</span></div>
          <div className="rounded-xl p-3 border space-y-1" style={{ borderColor: `${TS}30`, background: `${TS}06` }}>
            <div className="text-[11px] font-mono text-white/40">{'{'}</div>
            <AnimatePresence mode="popLayout">
              {BASE.map(f => {
                const st = fieldState(f)!
                if (st.gone) return null
                return (
                  <motion.div key={f.name} layout initial={{ opacity: 0 }} animate={{ opacity: st.dim ? 0.3 : 1 }} exit={{ opacity: 0, x: 12 }} className="flex items-center gap-1.5 font-mono text-xs pl-4">
                    {st.readonly && <Lock size={11} className="text-amber" />}
                    {st.readonly && <span className="text-amber">readonly</span>}
                    <span className="text-white/85">{f.name}</span>
                    <AnimatePresence>{st.optional && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="font-bold" style={{ color: TS }}>?</motion.span>}</AnimatePresence>
                    <span className="text-white/30">:</span>
                    <span className="text-emerald-400">{f.type}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div className="text-[11px] font-mono text-white/40">{'}'}</div>
          </div>
          <p className="text-xs text-white/40">{
            obj === 'Partial' ? 'Partial<T> makes every property optional (?).' :
            obj === 'Required' ? 'Required<T> strips ? — every property becomes required.' :
            obj === 'Readonly' ? 'Readonly<T> locks every property — reassignment is a compile error.' :
            obj === 'Pick' ? 'Pick<T, K> keeps only the selected keys; the rest are dropped.' :
            'Omit<T, K> removes the selected keys, keeping everything else.'
          }</p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">{(Object.keys(TYPE_UTILS) as TypeUtil[]).map(u => <button key={u} onClick={() => setTu(u)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: tu === u ? `${TS}22` : 'rgba(255,255,255,0.04)', border: tu === u ? `1px solid ${TS}` : '1px solid transparent', color: tu === u ? TS : 'rgba(255,255,255,0.55)' }}>{u}</button>)}</div>
          <motion.div key={tu} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 border flex flex-col gap-2" style={{ borderColor: `${TS}30`, background: `${TS}08` }}>
            <div className="font-mono text-xs text-white/70">{TYPE_UTILS[tu].input}</div>
            <div className="flex items-center gap-2 text-white/30 text-xs">↓ resolves to</div>
            <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-mono text-sm font-bold" style={{ color: TS }}>{TYPE_UTILS[tu].output}</motion.div>
          </motion.div>
          <p className="text-xs text-white/40">{TYPE_UTILS[tu].note}</p>
        </>
      )}
    </div>
  )
}
