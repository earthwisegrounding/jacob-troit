import { useState } from 'react'
import { audio } from '../audio'

const SINS = [
  'Told a police officer the e-bike "only goes 20."',
  'Played "Faith" at a funeral. It was requested. By Jacob.',
  'Coveted thy neighbor\'s charger.',
  'Used the church parking lot for donuts (the motorcycle kind).',
  'Said "I\'ll be there at 10" with no intention of being anywhere at 10.',
  'Ate the last of Steve\'s leftovers and blamed a raccoon.',
  'Pedaled for exactly one rotation to qualify as "exercise."',
  'Sang the wrong words to a hymn on purpose, with confidence.',
  'Told Steve the bike was "in the shop." The bike was in the bar.',
  'Skipped the sermon to catch the 8:45 ferry to nowhere in particular.',
  'Tuned the guitar to "close enough."',
  'Called it a "bicycle" in front of God and the DMV.',
  'Used a hymnal as a coaster.',
  'Let the battery die on purpose to get a ride from Steve.',
  'Performed "Careless Whisper" at a child\'s birthday party. Nobody asked. The child cried.',
  'Told the pastor the e-bike was "a gift from above." It was from a website.',
  'Lied about the top speed to a man who had just seen the top speed.',
  'Prayed for a parking spot. Took two.',
]
const SEVERITY = ['VENIAL', 'MID', 'MORTAL-ISH', 'STEVE-LEVEL', 'BREMERTON STANDARD', 'FERRY-WORTHY', 'UNDER REVIEW']
const PENANCE = [
  'Ride to church. Throttle disconnected. Pedals only.',
  'Three (3) Hail Marys and one (1) apology to Steve.',
  'Play "Father Figure" for someone who deserves it.',
  'Wear the helmet. Just once. Feel what it is like.',
  'Text Steve back. With words.',
  'Take the foot ferry, in the rain, and think about what you have done.',
  'Remove one sticker from the bike. You know which one.',
  'Do not go to Taco Bell tonight. Go tomorrow.',
  'Read something. Anything. The back of the charger counts.',
  'Sit through an entire sermon without checking the battery app.',
  'Let Steve finish a sentence.',
  'Learn a fourth chord.',
]

type Receipt = { n: number; sin: string; sev: string; pen: string; time: string }

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

export default function Confess() {
  const [r, setR] = useState<Receipt | null>(null)
  const [busy, setBusy] = useState(false)
  const [count, setCount] = useState(() => 4417 + Math.floor(Math.random() * 300))

  const confess = async () => {
    if (busy) return
    setBusy(true)
    audio.init()
    audio.clunk()
    setR(null)
    await new Promise((res) => setTimeout(res, 500))
    audio.print()
    const n = count + 1
    setCount(n)
    setR({
      n,
      sin: pick(SINS),
      sev: pick(SEVERITY),
      pen: pick(PENANCE),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    await new Promise((res) => setTimeout(res, 1200))
    setBusy(false)
  }

  return (
    <div className="machine">
      <div className="confess-btn-wrap">
        <div className="eyebrow">Exhibit D · Coin-operated</div>
        <h2 className="sec-title">Confess-O-Matic 3000</h2>
        <p className="lede">
          Absolution while-u-wait. Installed outside the ferry terminal in 1987, removed in 1988, and reinstalled here
          because Jacob "needed it closer." Press the button. The machine already knows.
        </p>
        <button className={`confess-btn ${busy ? 'pressed' : ''}`} onClick={confess} disabled={busy} aria-label="Confess">
          {busy ? '...' : 'CONFESS'}
        </button>
        <div className="plate">NO REFUNDS · NO APPEALS · ABSOLUTION IS PROVISIONAL · SEE STEVE FOR DETAILS</div>
      </div>
      <div className="slot" aria-live="polite">
        <div className="lip" />
        <div className={`receipt ${r ? 'out' : ''}`}>
          {r ? (
            <>
              <h4>CONFESS-O-MATIC 3000</h4>
              <div style={{ textAlign: 'center', fontSize: 15, color: '#666' }}>BREMERTON, WA · UNIT #1 OF 1</div>
              <div className="row"><span>RECEIPT</span><span>#{r.n}</span></div>
              <div className="row"><span>TIME</span><span>{r.time}</span></div>
              <div className="row"><span>PENITENT</span><span>TROIT, JACOB</span></div>
              <div className="row"><span>SIN</span><span>{r.sin}</span></div>
              <div className="row"><span>SEVERITY</span><span>{r.sev}</span></div>
              <div className="row"><span>PENANCE</span><span>{r.pen}</span></div>
              <div className="row"><span>STATUS</span><span>ABSOLVED (PROVISIONAL)</span></div>
              <div className="big">✝ GO AND SIN NO MORE ✝</div>
              <div style={{ textAlign: 'center', fontSize: 15, color: '#666', marginTop: 4 }}>(or at least sin less. or differently.)</div>
            </>
          ) : (
            <div className="empty">—</div>
          )}
        </div>
      </div>
    </div>
  )
}
