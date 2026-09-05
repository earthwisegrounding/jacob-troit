import { useCallback, useEffect, useRef, useState } from 'react'
import { useConversation } from '@elevenlabs/react'
import { audio } from '../audio'

const AGENT_ID = 'agent_4701m1gdynm6ek6rfad3tkde76v2'
// 1-800-BILLY. B=2 I=4 L=5 L=5 Y=9. Yes, we checked a phone.
const DIGITS = ['1', '8', '0', '0', '2', '4', '5', '5', '9']
const LETTERS = '1-800-BILLY'
const LETTER_POS = [0, 2, 3, 4, 6, 7, 8, 9, 10]

type Phase = 'idle' | 'permission' | 'dialing' | 'ringing' | 'live' | 'dead'
type Caption = { id: number; who: 'BILLY' | 'JACOB'; text: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const IDLE_LINES = [
  'PICK UP THE PHONE, JACOB.',
  'BILLY IS AWAKE. BILLY IS ALWAYS AWAKE.',
  'TONIGHT: A CONVERSATION. TOMORROW: CONSEQUENCES.',
  'STEVE CALLED EARLIER. HE SAID "TELL HIM." WE DON\'T KNOW WHAT.',
  'CALLERS SO FAR TONIGHT: 0. CALLERS EXPECTED: 1. IT\'S YOU.',
  'NOW BROADCASTING FROM INSIDE THE RADIO.',
]

export default function Radio() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [dialed, setDialed] = useState('')
  const [dialAngle, setDialAngle] = useState(0)
  const [dialMs, setDialMs] = useState(250)
  const [captions, setCaptions] = useState<Caption[]>([])
  const [deadReason, setDeadReason] = useState('')
  const [idleLine, setIdleLine] = useState(0)
  const phaseRef = useRef<Phase>('idle')
  phaseRef.current = phase
  const idRef = useRef(0)
  const screenRef = useRef<HTMLDivElement>(null)
  const outNeedle = useRef<SVGGElement>(null)
  const inNeedle = useRef<SVGGElement>(null)

  const push = useCallback((who: Caption['who'], text: string) => {
    if (!text) return
    setCaptions((c) => [...c, { id: ++idRef.current, who, text }].slice(-10))
  }, [])

  const conversation = useConversation({
    onConnect: () => {
      audio.connect()
      setPhase('live')
    },
    onDisconnect: () => {
      if (phaseRef.current === 'live' || phaseRef.current === 'ringing') {
        audio.hangup()
        setPhase('idle')
      }
    },
    onError: (message: string) => {
      setDeadReason(message || 'Unknown interference. Possibly the Navy.')
      setPhase('dead')
      audio.dead()
    },
    onMessage: ({ message, source }: { message: string; source: string }) => {
      push(source === 'ai' ? 'BILLY' : 'JACOB', message)
    },
  })
  const { status, isSpeaking, startSession, endSession, getOutputVolume, getInputVolume } = conversation

  // Belt and suspenders: sync phase with SDK status.
  useEffect(() => {
    if (status === 'connected' && phaseRef.current === 'ringing') setPhase('live')
    if (status === 'disconnected' && phaseRef.current === 'live') setPhase('idle')
  }, [status])

  // Idle screen chatter
  useEffect(() => {
    if (phase !== 'idle') return
    const t = setInterval(() => setIdleLine((i) => (i + 1) % IDLE_LINES.length), 4200)
    return () => clearInterval(t)
  }, [phase])

  // Ringback while connecting
  useEffect(() => {
    if (phase !== 'ringing') return
    audio.ringback()
    const t = setInterval(() => audio.ringback(), 3600)
    return () => clearInterval(t)
  }, [phase])

  // Auto-scroll captions
  useEffect(() => {
    const el = screenRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [captions, phase])

  // VU needles
  useEffect(() => {
    let raf = 0
    let last = 0
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 40) return
      last = t
      let o = 0
      let i = 0
      if (phase === 'live') {
        try {
          o = getOutputVolume()
          i = getInputVolume()
        } catch {
          /* meters are decorative anyway */
        }
      } else if (phase === 'ringing' || phase === 'dialing') {
        o = 0.15 + Math.random() * 0.1
      }
      const clamp = (v: number) => Math.max(0, Math.min(1, v * 1.6))
      if (outNeedle.current) outNeedle.current.style.transform = `rotate(${-42 + clamp(o) * 84}deg)`
      if (inNeedle.current) inNeedle.current.style.transform = `rotate(${-42 + clamp(i) * 84}deg)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, getOutputVolume, getInputVolume])

  const call = async () => {
    if (phase !== 'idle' && phase !== 'dead') return
    setCaptions([])
    setDeadReason('')
    setDialed('')
    audio.init()
    setPhase('permission')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setDeadReason('MICROPHONE DENIED. BILLY CANNOT HEAR A MAN WHO WILL NOT BE HEARD.')
      setPhase('dead')
      audio.dead()
      return
    }
    setPhase('dialing')
    audio.dialTone(0.9)
    await sleep(950)
    for (let n = 0; n < DIGITS.length; n++) {
      const d = DIGITS[n]
      const pulses = d === '0' ? 10 : Number(d)
      const angle = 5 + 30 * pulses
      setDialMs(160 + pulses * 14)
      setDialAngle(angle)
      await sleep(180 + pulses * 14)
      setDialMs(pulses * 34)
      setDialAngle(0)
      for (let p = 0; p < pulses; p++) {
        audio.pulse()
        await sleep(34)
      }
      audio.dialReturn()
      setDialed(LETTERS.slice(0, LETTER_POS[n] + 1))
      await sleep(70)
    }
    await sleep(250)
    setPhase('ringing')
    try {
      startSession({ agentId: AGENT_ID, connectionType: 'webrtc' })
    } catch (e) {
      setDeadReason(String(e))
      setPhase('dead')
      audio.dead()
    }
  }

  const hangUp = () => {
    try {
      endSession()
    } catch {
      /* already gone */
    }
    audio.hangup()
    setPhase('idle')
  }

  const lifted = phase !== 'idle' && phase !== 'dead'
  const live = phase === 'live'

  const statusLine = (() => {
    switch (phase) {
      case 'idle':
        return IDLE_LINES[idleLine]
      case 'permission':
        return 'REQUESTING MICROPHONE. SAY YES. IT IS WHAT STEVE WOULD DO.'
      case 'dialing':
        return `DIALING ${dialed || '...'}`
      case 'ringing':
        return 'RINGING... BILLY IS GETTING UP. HE MOVES SLOWLY. HE IS A RADIO.'
      case 'live':
        return isSpeaking ? 'BILLY IS TALKING' : 'BILLY IS LISTENING. GO AHEAD, CALLER.'
      case 'dead':
        return 'LINE DEAD.'
    }
  })()

  return (
    <div className="studio">
      <div className="lamp" aria-hidden="true" />
      <div className="moth" aria-hidden="true"><i /></div>

      <div className="cabinet" aria-label="The radio">
        <div className="station">
          <div className="call">
            KBLY
            <small>1610 AM · BREMERTON</small>
          </div>
          <div className={`onair ${live ? 'lit' : ''} ${live && isSpeaking ? 'talking' : ''}`}>ON AIR</div>
        </div>

        <div className="screen" ref={screenRef} role="log" aria-live="polite">
          <div className={`status ${phase === 'ringing' || phase === 'permission' ? 'blink' : ''}`}>
            {phase === 'live' ? '● ' : '○ '}
            {statusLine}
          </div>
          {phase === 'dead' && <div className="dead">{deadReason}<br />HANG UP AND TRY AGAIN. BILLY FORGIVES. BILLY FORGETS. BILLY IS A RADIO.</div>}
          {captions.map((c) => (
            <div key={c.id} className={`cap ${c.who === 'JACOB' ? 'you' : ''}`}>
              <b>{c.who}:</b>
              <span>{c.text}</span>
            </div>
          ))}
          {phase === 'idle' && captions.length === 0 && (
            <div className="cap" style={{ opacity: 0.55 }}>
              <b>NOTE:</b>
              <span>your microphone is used only while you are on the air. off the air, the radio is just wood.</span>
            </div>
          )}
        </div>

        <div className="tuner" aria-hidden="true">
          <div className="scale">
            <span>530</span><span>700</span><span>900</span><span>1100</span><span>1300</span><span>1500</span><span>1700</span>
          </div>
          <div className="stations">
            <span>KOMO</span><span>KIRO</span><span>KJR</span><span>???</span><span>KBLY</span>
          </div>
          <div className="needle" />
          <div className="kbly">KBLY</div>
        </div>

        <div className={`grille ${live && isSpeaking ? 'talking' : ''}`} aria-hidden="true" />

        <div className="meters" aria-hidden="true">
          <VU label="BILLY" needleRef={outNeedle} />
          <VU label="JACOB" needleRef={inNeedle} />
        </div>

        <div className="knobs" aria-hidden="true">
          <div className="knob" /><div className="knob" /><div className="knob" />
        </div>
      </div>

      <div className="phone-wrap">
        <button
          className={`phone ${phase} ${lifted ? 'lifted' : ''}`}
          onClick={call}
          disabled={lifted}
          aria-label={lifted ? 'On the phone' : 'Pick up the phone and call Billy'}
          style={{ ['--dial-ms' as string]: `${dialMs}ms` }}
        >
          <PhoneSVG dialAngle={dialAngle} />
          {phase === 'idle' && <span className="hint">▲ PICK UP ▲</span>}
          {phase === 'dead' && <span className="hint">TRY AGAIN</span>}
        </button>
        <div className="numplate">
          {dialed || (phase === 'idle' ? '1-800-BILLY' : '')}
          <small>{phase === 'idle' ? 'toll-free · long distance from inside the radio' : phase.toUpperCase()}</small>
        </div>
        {lifted ? (
          <button className="hangup" onClick={hangUp}>▼ HANG UP</button>
        ) : (
          <button className="hangup ghost" onClick={call}>☎ CALL BILLY</button>
        )}
        <div className="listeners">LISTENERS TONIGHT: 1 (IT&apos;S YOU)</div>
      </div>
    </div>
  )
}

function VU({ label, needleRef }: { label: string; needleRef: React.RefObject<SVGGElement | null> }) {
  return (
    <div className="vu">
      <svg viewBox="0 0 120 72">
        <path d="M14 58 A46 46 0 0 1 106 58" fill="none" stroke="#3a2113" strokeWidth="2" />
        <path d="M84 24 A46 46 0 0 1 106 58" fill="none" stroke="#e63946" strokeWidth="5" />
        {[-42, -21, 0, 21, 42].map((a) => (
          <line key={a} x1="60" y1="16" x2="60" y2="22" stroke="#3a2113" strokeWidth="2" transform={`rotate(${a} 60 60)`} />
        ))}
        <g ref={needleRef} style={{ transformOrigin: '60px 60px', transform: 'rotate(-42deg)', transition: 'transform 80ms linear' }}>
          <line x1="60" y1="60" x2="60" y2="14" stroke="#111" strokeWidth="2" />
        </g>
        <circle cx="60" cy="60" r="5" fill="#111" />
      </svg>
      <div className="lbl">{label}</div>
    </div>
  )
}

function PhoneSVG({ dialAngle }: { dialAngle: number }) {
  const holes = Array.from({ length: 10 }, (_, i) => {
    const digit = i === 9 ? 0 : i + 1
    const ang = ((5 - 30 * i) * Math.PI) / 180
    return { digit, x: 160 + 56 * Math.cos(ang), y: 208 + 56 * Math.sin(ang) }
  })
  const stopAng = (40 * Math.PI) / 180
  return (
    <svg viewBox="0 0 320 330" aria-hidden="true">
      <defs>
        <linearGradient id="phbody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5c68" />
          <stop offset="1" stopColor="#9e1522" />
        </linearGradient>
        <radialGradient id="phdial" cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#cfcfcf" />
        </radialGradient>
      </defs>
      {/* cord */}
      <path d="M40 110 q-30 30 0 50 t0 50 t0 50 t0 50" fill="none" stroke="#7a1420" strokeWidth="5" strokeLinecap="round" />
      {/* body */}
      <path d="M40 130 L280 130 L305 300 Q305 318 287 318 L33 318 Q15 318 15 300 Z" fill="url(#phbody)" stroke="#5a0d15" strokeWidth="4" />
      <ellipse cx="160" cy="316" rx="150" ry="10" fill="rgba(0,0,0,0.4)" />
      {/* cradle */}
      <rect x="70" y="96" width="180" height="40" rx="10" fill="#b31b2a" stroke="#5a0d15" strokeWidth="4" />
      {/* dial base */}
      <circle cx="160" cy="208" r="82" fill="#2a0a0e" />
      <circle cx="160" cy="208" r="76" fill="#111" />
      {holes.map((h) => (
        <text key={h.digit} x={h.x} y={h.y + 6} fontSize="18" textAnchor="middle" fill="#f1e6c8" fontFamily="VT323, monospace">
          {h.digit}
        </text>
      ))}
      <g className="dialplate" style={{ transform: `rotate(${dialAngle}deg)` }}>
        <circle cx="160" cy="208" r="70" fill="url(#phdial)" stroke="#888" strokeWidth="2" />
        {holes.map((h) => (
          <circle key={h.digit} cx={h.x} cy={h.y} r="12" fill="#111" />
        ))}
        <circle cx="160" cy="208" r="22" fill="#e63946" stroke="#5a0d15" strokeWidth="2" />
        <text x="160" y="213" fontSize="12" textAnchor="middle" fill="#fff" fontFamily="VT323, monospace">KBLY</text>
      </g>
      {/* finger stop */}
      <circle cx={160 + 82 * Math.cos(stopAng)} cy={208 + 82 * Math.sin(stopAng)} r="7" fill="#c9a24a" stroke="#5a0d15" strokeWidth="2" />
      {/* handset */}
      <g className="handset">
        <path d="M60 80 Q160 40 260 80 L250 96 Q160 66 70 96 Z" fill="#e63946" stroke="#5a0d15" strokeWidth="4" strokeLinejoin="round" />
        <ellipse cx="62" cy="88" rx="30" ry="22" fill="#c8202f" stroke="#5a0d15" strokeWidth="4" />
        <ellipse cx="258" cy="88" rx="30" ry="22" fill="#c8202f" stroke="#5a0d15" strokeWidth="4" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={52 + i * 10} cy={88} r="2.2" fill="#5a0d15" />
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={248 + i * 10} cy={88} r="2.2" fill="#5a0d15" />
        ))}
      </g>
    </svg>
  )
}
