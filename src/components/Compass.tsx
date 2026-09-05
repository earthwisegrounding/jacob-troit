import { useEffect, useRef, useState } from 'react'
import { audio } from '../audio'

const POINTS = [
  { deg: 0, label: 'CHURCH', short: 'N' },
  { deg: 45, label: 'WORK, ALLEGEDLY', short: 'NE' },
  { deg: 90, label: 'TACO BELL', short: 'E' },
  { deg: 135, label: 'THE FERRY', short: 'SE' },
  { deg: 180, label: 'THE BAR', short: 'S' },
  { deg: 225, label: 'A BAD IDEA', short: 'SW' },
  { deg: 270, label: "STEVE'S HOUSE", short: 'W' },
  { deg: 315, label: 'GARAGE (GUITAR)', short: 'NW' },
]

function nearest(deg: number) {
  const d = ((deg % 360) + 360) % 360
  let best = POINTS[0]
  let bd = 999
  for (const p of POINTS) {
    const diff = Math.min(Math.abs(d - p.deg), 360 - Math.abs(d - p.deg))
    if (diff < bd) { bd = diff; best = p }
  }
  return best
}

const REMARKS: Record<string, string> = {
  CHURCH: 'a miracle. do not move.',
  'WORK, ALLEGEDLY': 'nobody has confirmed this.',
  'TACO BELL': 'again.',
  'THE FERRY': 'to where? he does not know.',
  'THE BAR': 'the needle did not hesitate.',
  'A BAD IDEA': 'the needle is very confident.',
  "STEVE'S HOUSE": 'steve has been notified.',
  'GARAGE (GUITAR)': 'the neighbors have been notified.',
}

export default function Compass() {
  const [angle, setAngle] = useState(178)
  const [spinning, setSpinning] = useState(false)
  const needle = useRef<SVGGElement>(null)
  const base = useRef(178)
  const target = useRef<number | null>(null)

  useEffect(() => {
    let raf = 0
    let t0 = performance.now()
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = (t - t0) / 1000
      t0 = t
      if (target.current !== null) {
        base.current += (target.current - base.current) * Math.min(1, dt * 2.2)
        if (Math.abs(target.current - base.current) < 0.4) {
          base.current = target.current
          target.current = null
          setSpinning(false)
          setAngle(base.current)
        }
      }
      const jitter = Math.sin(t / 130) * 2.2 + Math.sin(t / 47) * 1.1 + (Math.random() - 0.5) * 1.5
      if (needle.current) needle.current.style.transform = `rotate(${base.current + jitter}deg)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const recalibrate = () => {
    if (spinning) return
    audio.spin()
    setSpinning(true)
    // The compass has never once, in its life, pointed at church on purpose.
    const pick = POINTS.filter((p) => p.label !== 'CHURCH')[Math.floor(Math.random() * 7)]
    const turns = 3 + Math.floor(Math.random() * 3)
    target.current = base.current + turns * 360 + ((pick.deg - (base.current % 360) + 360) % 360) + (Math.random() * 10 - 5)
  }

  const p = nearest(angle)
  return (
    <div className="grid2">
      <div>
        <svg className="compass" viewBox="0 0 400 400" role="img" aria-label="A compass that refuses to point at church">
          <defs>
            <radialGradient id="cface" cx="0.5" cy="0.4">
              <stop offset="0" stopColor="#fbf3df" />
              <stop offset="1" stopColor="#d8c69a" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="196" fill="#3a2113" />
          <circle cx="200" cy="200" r="184" fill="#c9a24a" />
          <circle cx="200" cy="200" r="172" fill="url(#cface)" stroke="#3a2113" strokeWidth="3" />
          {Array.from({ length: 72 }, (_, i) => (
            <line key={i} x1="200" y1="32" x2="200" y2={i % 9 === 0 ? 52 : i % 3 === 0 ? 44 : 38} stroke="#3a2113" strokeWidth={i % 9 === 0 ? 3 : 1} transform={`rotate(${i * 5} 200 200)`} />
          ))}
          {POINTS.map((pt) => (
            <g key={pt.label} transform={`rotate(${pt.deg} 200 200)`}>
              <text x="200" y="92" textAnchor="middle" fontFamily="Bowlby One SC, Impact, sans-serif" fontSize={pt.deg % 90 === 0 ? 13 : 10} fill={pt.label === 'CHURCH' ? '#e63946' : '#3a2113'} transform={`rotate(${-pt.deg} 200 92)`}>
                {pt.label === 'CHURCH' ? '✝' : ''} {pt.label}
              </text>
            </g>
          ))}
          <text x="200" y="150" textAnchor="middle" fontFamily="Rye, Georgia, serif" fontSize="16" fill="#3a2113">TROIT &amp; SONS</text>
          <text x="200" y="168" textAnchor="middle" fontFamily="VT323, monospace" fontSize="14" fill="#7a4a2b">MORAL INSTRUMENTS · BREMERTON</text>
          <text x="200" y="262" textAnchor="middle" fontFamily="VT323, monospace" fontSize="13" fill="#7a4a2b">ACCURACY NOT GUARANTEED</text>
          <g ref={needle} className="needle" style={{ transform: 'rotate(178deg)' }}>
            <polygon points="200,60 188,200 212,200" fill="#e63946" />
            <polygon points="200,340 188,200 212,200" fill="#3a2113" />
            <circle cx="200" cy="200" r="10" fill="#c9a24a" stroke="#3a2113" strokeWidth="3" />
          </g>
        </svg>
        <div className="heading">
          HEADING: <b>{Math.round(((angle % 360) + 360) % 360)}°</b> — <b>{p.label}</b>
          <br /><span style={{ fontSize: 18, opacity: 0.75 }}>{REMARKS[p.label]}</span>
        </div>
      </div>
      <div>
        <div className="eyebrow">Exhibit A</div>
        <h2 className="sec-title">Jacob's Moral Compass</h2>
        <p className="lede">
          It works. It has always worked. It simply does not work <em>for Jacob</em>. Manufactured in Bremerton
          by Troit &amp; Sons (there are no sons; there is a Jacob), this instrument has pointed at every establishment on
          the Kitsap Peninsula except one.
        </p>
        <p className="lede">
          Steve has had it serviced twice. The technician said, and we quote, "it's not the compass."
        </p>
        <button className="btn red" onClick={recalibrate} disabled={spinning}>
          {spinning ? 'RECALIBRATING...' : 'RECALIBRATE'}
        </button>
      </div>
    </div>
  )
}
