import { useEffect, useMemo, useState } from 'react'

export function Rain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        dur: 0.7 + Math.random() * 0.9,
        delay: -Math.random() * 2,
        h: 8 + Math.random() * 10,
        op: 0.3 + Math.random() * 0.5,
      })),
    [],
  )
  return (
    <div className="rain" aria-hidden="true">
      {drops.map((d) => (
        <i key={d.id} style={{ left: `${d.left}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, height: `${d.h}vh`, opacity: d.op }} />
      ))}
    </div>
  )
}

export function Gull() {
  return (
    <div className="gull" aria-hidden="true">
      <svg viewBox="0 0 60 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M2 18 Q16 2 30 16 Q44 2 58 18" />
      </svg>
    </div>
  )
}

const NEWS = [
  'BREMERTON WEATHER: RAIN. SPIRITUAL FORECAST: PARTLY SINFUL.',
  'FERRY TO SEATTLE: ON TIME. FERRY TO SALVATION: DELAYED.',
  "LOCAL MAN'S E-BIKE 'BASICALLY A MOTORCYCLE,' SAYS EVERYONE BUT LOCAL MAN",
  'STEVE WOULD LIKE A WORD',
  "GEORGE MICHAEL COVER HEARD FROM GARAGE FOR THIRD CONSECUTIVE NIGHT; NEIGHBORS 'HAVE FAITH' IT WILL STOP",
  'REMINDER: THE PEDALS ARE NOT DECORATIVE, JACOB',
  'KBLY 1610 AM: NOW BROADCASTING FROM INSIDE THE RADIO',
  "TONIGHT'S SERMON: 'THOU SHALT PROBABLY NOT'",
  'BILLY IS AWAKE. BILLY IS ALWAYS AWAKE.',
  'PUGET SOUND NAVAL SHIPYARD DENIES ANY INVOLVEMENT WITH BILLY',
  "KITSAP COUNTY OPENS NEW 'TROIT LANE' ON HIGHWAY 3. TROIT LANE IS A BIKE LANE. JACOB HAS BEEN INFORMED.",
  'MORAL COMPASS RECALLED; MANUFACTURER SAYS "IT\'S NOT THE COMPASS"',
  'TYPE THE WORD "STEVE" ANYWHERE ON THIS PAGE. SEE WHAT HAPPENS. (STEVE HAPPENS.)',
]

export function Ticker() {
  return (
    <div className="ticker" role="marquee" aria-label="Bremerton news ticker">
      <div className="tag">KBLY NEWS</div>
      <div className="track">
        {NEWS.map((n) => <span key={n}>{n}</span>)}
      </div>
    </div>
  )
}

export function Counter() {
  return <div className="counter">VISITOR № 000001 · HI JACOB</div>
}

export function useTabNag() {
  useEffect(() => {
    const orig = document.title
    let t: number | undefined
    const onVis = () => {
      if (document.hidden) {
        let flip = false
        t = window.setInterval(() => {
          document.title = flip ? 'JACOB. PICK UP THE PHONE.' : '☎ BILLY IS WAITING'
          flip = !flip
        }, 1200)
      } else {
        window.clearInterval(t)
        document.title = orig
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); window.clearInterval(t); document.title = orig }
  }, [])
}

export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  return now
}
