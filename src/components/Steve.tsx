import { useEffect, useState } from 'react'
import { audio } from '../audio'

const STEVE_SAYS = [
  'Have you eaten something today that did not come from a gas station?',
  'The e-bike has pedals. I am just saying. I am always just saying.',
  'Church is at 10. It has been at 10 for roughly two thousand years.',
  'You do not have to play "Careless Whisper" at the barbecue. You could. But you do not have to.',
  'I am not mad. I am concerned. There is a difference, and I will explain it on the ferry.',
  'A "bicycle" does not need a kickstand that size.',
  'Call Billy. He has time. He is a radio.',
  'The compass is fine, Jacob. The compass has always been fine.',
  'I put a helmet on the seat. I know you saw it. I saw you see it.',
  'Text me back. Not a thumbs up. Words.',
]

export function useSteveSummon() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let buf = ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      buf = (buf + e.key.toLowerCase()).slice(-5)
      if (buf === 'steve') { setOpen(true); audio.chime() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])
  return { open, summon: () => { setOpen(true); audio.chime() }, dismiss: () => setOpen(false) }
}

export function SteveOverlay({ onClose }: { onClose: () => void }) {
  const [picks] = useState(() => [...STEVE_SAYS].sort(() => Math.random() - 0.5).slice(0, 5))
  return (
    <div className="steve-overlay" role="dialog" aria-modal="true" aria-label="Steve has entered the chat">
      <div className="steve-card">
        <div className="from">INCOMING · FROM: STEVE · PRIORITY: GENTLE</div>
        <h2>Steve has entered the chat.</h2>
        <p>Hey. It's me. I'm not going to make this weird. I just have a few things, and then I'll go.</p>
        <ul>
          {picks.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p>That's it. I love you, man. Wear the helmet.</p>
        <div className="sig">— Steve</div>
        <button className="btn cream" onClick={onClose}>OKAY, STEVE.</button>
        <div style={{ marginTop: 14, fontFamily: 'var(--led)', fontSize: 16, opacity: 0.6 }}>
          (You can summon Steve any time by typing his name. He will always come. That is the whole thing about Steve.)
        </div>
      </div>
    </div>
  )
}

export function SteveCounter({ onSummon }: { onSummon: () => void }) {
  const [n, setN] = useState(0)
  const [stamp, setStamp] = useState(false)

  useEffect(() => {
    let alive = true
    const loop = async () => {
      while (alive) {
        await new Promise((r) => setTimeout(r, 6000 + Math.random() * 5000))
        if (!alive) return
        setN(1)
        await new Promise((r) => setTimeout(r, 1800))
        if (!alive) return
        setStamp(true)
        audio.stamp()
        await new Promise((r) => setTimeout(r, 250))
        setN(0)
        await new Promise((r) => setTimeout(r, 1500))
        setStamp(false)
      }
    }
    void loop()
    return () => { alive = false }
  }, [])

  return (
    <div>
      <div className="eyebrow">Exhibit C · Public safety notice</div>
      <h2 className="sec-title">Days since Steve tried to steer Jacob's life back on track</h2>
      <div className="bignum" aria-live="polite">
        <div className="n">{n}</div>
        <div className={`stamp ${stamp ? 'show' : ''}`}>NOPE.</div>
      </div>
      <p className="steve-note">
        This counter has never reached two. It reached one once, briefly, on a Tuesday, and Steve called about the
        pedals. Steve is Jacob's good friend. Steve is everyone's good friend. Steve is, in many ways, the reason this
        website exists and also the reason it apologizes so much.
      </p>
      <button className="btn" onClick={onSummon}>SUMMON STEVE</button>
    </div>
  )
}
