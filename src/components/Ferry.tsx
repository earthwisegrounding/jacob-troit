import { useEffect, useState } from 'react'
import { audio } from '../audio'

type Row = { t: string; to: string; st: string; kind: 'ok' | 'bad' | 'warn' }
const ROWS: Row[] = [
  { t: '06:20', to: 'SEATTLE', st: 'ON TIME', kind: 'ok' },
  { t: '08:45', to: 'NOWHERE IN PARTICULAR', st: 'JACOB ABOARD', kind: 'warn' },
  { t: '10:00', to: 'CHURCH', st: 'JACOB NOT ABOARD', kind: 'bad' },
  { t: '11:59', to: 'HEAVEN', st: 'DELAYED (PAPERWORK)', kind: 'warn' },
  { t: '12:00', to: 'PURGATORY', st: 'NOW BOARDING', kind: 'ok' },
  { t: '14:15', to: 'PORT ORCHARD (FOOT FERRY)', st: 'CANCELLED (MORAL REASONS)', kind: 'bad' },
  { t: '03:33', to: 'TACO BELL', st: 'DEPARTED', kind: 'warn' },
  { t: '??:??', to: "STEVE'S HOUSE", st: 'HOLDING FOR PASSENGER', kind: 'ok' },
]
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ():?'

function Flap({ text, delay }: { text: string; delay: number }) {
  const [shown, setShown] = useState(() => text.replace(/[^ ]/g, () => CHARS[Math.floor(Math.random() * CHARS.length)]))
  useEffect(() => {
    let frame = 0
    const start = setTimeout(() => {
      const t = setInterval(() => {
        frame++
        if (frame % 3 === 0) audio.flap()
        setShown(
          text
            .split('')
            .map((ch, i) => (i < frame - 2 || ch === ' ' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join(''),
        )
        if (frame > text.length + 2) { clearInterval(t); setShown(text) }
      }, 45)
    }, delay)
    return () => clearTimeout(start)
  }, [text, delay])
  return <span className="flap">{shown}</span>
}

export default function Ferry() {
  const [gen, setGen] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setGen((g) => g + 1), 45000)
    return () => clearInterval(t)
  }, [])
  return (
    <div>
      <div className="eyebrow">Exhibit G · Washington State Ferries (unaffiliated) (please do not call them)</div>
      <h2 className="sec-title">Bremerton Terminal · Departures</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="board" key={gen}>
          <thead>
            <tr><th>TIME</th><th>DESTINATION</th><th>STATUS</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.to}>
                <td>{r.t}</td>
                <td><Flap text={r.to} delay={i * 220} /></td>
                <td className={`st ${r.kind}`}><Flap text={r.st} delay={i * 220 + 400} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: 'var(--led)', fontSize: 18, color: 'var(--muted)', marginTop: 14 }}>
        ALL SAILINGS SUBJECT TO WEATHER, TIDE, AND WHETHER JACOB REMEMBERED THE CHARGER.
      </p>
    </div>
  )
}
