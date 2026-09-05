import { useEffect, useRef, useState } from 'react'
import { audio } from '../audio'

const SPECS: [string, string][] = [
  ['CLASS', 'Class 2. Class 3. Class action.'],
  ['TOP SPEED', '20 mph, per the sticker. The sticker is a liar.'],
  ['RANGE', 'Until Steve texts.'],
  ['PEDALS', 'Present. Ceremonial. Occasionally used to prove a point to an officer.'],
  ['HORN', 'Jacob, yelling a George Michael song title.'],
  ['REGISTRATION', 'With whom?'],
  ['HELMET', 'In the garage, keeping the guitar company.'],
  ['THROTTLE', 'Yes.'],
  ['FUEL', 'Electricity, and the certainty that this is fine.'],
]

const SPEEDO_LINES = [
  '0 MPH · PARKED · SPIRITUALLY ALSO PARKED',
  '8 MPH · A BICYCLE, OFFICER',
  '15 MPH · STILL A BICYCLE, OFFICER',
  '20 MPH · LEGALLY THE MAXIMUM',
  '20 MPH · (WINK)',
  '28 MPH · THE PEDALS ARE SPINNING FREELY',
  '34 MPH · THIS IS NOT A BICYCLE',
  '?? MPH · SPEED IS A CONSTRUCT · SO IS THE LAW',
]

export default function Bike() {
  const [level, setLevel] = useState(0)
  const [held, setHeld] = useState(false)
  const wheels = useRef<SVGGElement[]>([])
  const rot = useRef(0)

  useEffect(() => {
    let raf = 0
    let t0 = performance.now()
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = (t - t0) / 1000
      t0 = t
      rot.current += dt * level * 240
      for (const w of wheels.current) if (w) w.style.transform = `rotate(${rot.current}deg)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [level])

  useEffect(() => {
    const t = setInterval(() => {
      setLevel((l) => {
        const next = held ? Math.min(7, l + 1) : Math.max(0, l - 1)
        if (held && next > l) audio.rev(next)
        return next
      })
    }, 380)
    return () => clearInterval(t)
  }, [held])

  const start = () => { audio.init(); setHeld(true) }
  const stop = () => setHeld(false)

  return (
    <div className="grid2">
      <div>
        <div className="eyebrow">Exhibit B · Vehicle of interest</div>
        <h2 className="sec-title">The Troitcycle</h2>
        <p className="lede">
          An electric bicycle in the same way a bear is a large dog. It has pedals. It has a throttle. It has
          a top speed the manufacturer describes as "20" and Jacob describes as "a starting point."
        </p>
        <table className="specs">
          <tbody>
            {SPECS.map(([k, v]) => (
              <tr key={k}><td>{k}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bike-stage">
        <svg className={`bike ${level > 2 ? 'revving' : ''}`} viewBox="0 0 520 300" role="img" aria-label="An electric bicycle that is clearly a small motorcycle">
          <defs>
            <linearGradient id="tank" x1="0" x2="1">
              <stop offset="0" stopColor="#ffd27a" />
              <stop offset="1" stopColor="#e6902a" />
            </linearGradient>
          </defs>
          {/* ground */}
          <line x1="10" y1="262" x2="510" y2="262" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="6 8" />
          {/* frame */}
          <path d="M140 210 L215 120 L360 120 L430 210" fill="none" stroke="#dbe7ff" strokeWidth="9" strokeLinejoin="round" />
          <path d="M215 120 L280 210 L140 210" fill="none" stroke="#dbe7ff" strokeWidth="9" strokeLinejoin="round" />
          <path d="M280 210 L360 120" fill="none" stroke="#dbe7ff" strokeWidth="9" />
          {/* battery / tank */}
          <rect x="222" y="100" width="130" height="48" rx="14" fill="url(#tank)" stroke="#5a3620" strokeWidth="3" />
          <text x="287" y="131" textAnchor="middle" fontFamily="Bowlby One SC, Impact, sans-serif" fontSize="16" fill="#3a2113">TROIT 9000</text>
          {/* seat */}
          <path d="M330 92 Q380 82 420 96 L420 106 L332 106 Z" fill="#222" stroke="#000" strokeWidth="2" />
          {/* handlebars */}
          <path d="M360 120 L372 70 L400 62" fill="none" stroke="#dbe7ff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="402" cy="61" r="7" fill="#e63946" />
          {/* headlight */}
          <circle cx="440" cy="130" r="14" fill={level > 0 ? '#fff6d5' : '#8fa4c9'} stroke="#dbe7ff" strokeWidth="3" />
          {level > 0 && <path d="M452 118 L520 90 L520 170 L452 142 Z" fill="rgba(255,246,213,0.15)" />}
          {/* sticker */}
          <g transform="rotate(-8 190 170)">
            <rect x="160" y="160" width="62" height="22" rx="3" fill="#f1e6c8" />
            <text x="191" y="176" textAnchor="middle" fontFamily="VT323, monospace" fontSize="14" fill="#e63946">BICYCLE*</text>
          </g>
          {/* pedals (ceremonial) */}
          <g ref={(el) => { if (el) wheels.current[2] = el }} className="wheel" style={{ transformOrigin: '280px 210px' }}>
            <line x1="262" y1="228" x2="298" y2="192" stroke="#dbe7ff" strokeWidth="5" />
            <rect x="252" y="224" width="20" height="8" rx="2" fill="#8fd3ff" />
            <rect x="288" y="188" width="20" height="8" rx="2" fill="#8fd3ff" />
          </g>
          <circle cx="280" cy="210" r="14" fill="#0e2245" stroke="#dbe7ff" strokeWidth="4" />
          {/* wheels */}
          {[140, 430].map((cx, i) => (
            <g key={cx} ref={(el) => { if (el) wheels.current[i] = el }} className="wheel" style={{ transformOrigin: `${cx}px 210px` }}>
              <circle cx={cx} cy="210" r="52" fill="none" stroke="#111" strokeWidth="16" />
              <circle cx={cx} cy="210" r="52" fill="none" stroke="#dbe7ff" strokeWidth="3" />
              {Array.from({ length: 8 }, (_, s) => (
                <line key={s} x1={cx} y1="210" x2={cx} y2="162" stroke="#dbe7ff" strokeWidth="2" transform={`rotate(${s * 45} ${cx} 210)`} />
              ))}
              <circle cx={cx} cy="210" r="8" fill="#8fd3ff" />
            </g>
          ))}
          {/* rain of judgement */}
          {level >= 6 && <text x="70" y="60" fontFamily="VT323, monospace" fontSize="22" fill="#ff6b6b">⚠ STEVE HAS BEEN NOTIFIED</text>}
        </svg>
        <div className="speedo">{SPEEDO_LINES[level]}</div>
        <div className="throttle">
          <button
            className="btn"
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') start() }}
            onKeyUp={stop}
          >
            {held ? 'HOLDING THROTTLE...' : 'HOLD THROTTLE'}
          </button>
          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 8 }}>*Hold it down. Like Jacob does. Like Steve begs him not to.</div>
        </div>
      </div>
    </div>
  )
}
