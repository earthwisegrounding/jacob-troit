import Radio from './components/Radio'
import Compass from './components/Compass'
import Bike from './components/Bike'
import { SteveCounter, SteveOverlay, useSteveSummon } from './components/Steve'
import Confess from './components/Confess'
import George from './components/George'
import Troitscope from './components/Troitscope'
import Ferry from './components/Ferry'
import { Counter, Gull, Rain, Ticker, useTabNag, useClock } from './components/Ambient'

export default function App() {
  const steve = useSteveSummon()
  useTabNag()
  const now = useClock()
  const hour = now.getHours()
  const greeting =
    hour < 5 ? 'It is very late. Billy is up. So, apparently, are you.'
    : hour < 12 ? 'Good morning. Church is at 10. It is always at 10.'
    : hour < 17 ? 'Good afternoon. The pedals are still there.'
    : hour < 21 ? 'Good evening. The garage is not soundproof.'
    : 'It is late. The bar is that way. The compass already told you.'

  return (
    <>
      <Rain />
      <Gull />
      <Ticker />
      <Counter />
      {steve.open && <SteveOverlay onClose={steve.dismiss} />}

      <header className="hero wrap">
        <div className="eyebrow">Bremerton, Washington · Pop. 44,000 and Jacob</div>
        <h1>Jacob Troit</h1>
        <p className="lede">
          Thirty-something. Christian (asterisk). Rides an electric bicycle that is, in the eyes of God and the
          Washington State Patrol, a small motorcycle. Plays George Michael on the guitar whether or not you asked.
          Has a friend named Steve. Steve is doing his best.
        </p>
        <div className="tags" aria-label="Vital statistics">
          <span>✝ FAITH: YES</span>
          <span>⚖ MORALS: NEGOTIABLE</span>
          <span>⛑ HELMET: SOMETIMES</span>
          <span>🎸 CHORDS: THREE</span>
          <span>🚲 BICYCLE: "BICYCLE"</span>
          <span>📞 STEVE: CONCERNED</span>
        </div>
        <p className="lede" style={{ fontSize: 16, opacity: 0.7 }}>{greeting}</p>
        <div className="arrow-down">▼ BILLY IS RIGHT THERE ▼</div>
      </header>

      <section className="radio-sec wrap" id="billy">
        <div className="eyebrow">Now broadcasting · Host: Billy · Audience: you</div>
        <h2 className="sec-title">The Voice in the Radio</h2>
        <p className="lede">
          Every night, from somewhere inside this radio, a man named Billy broadcasts to an audience of one.
          Nobody knows what Billy is. Nobody knows where the radio came from. Steve says he "found it." Pick up
          the phone. Billy answers. Billy always answers. That is the deal.
        </p>
        <Radio />
      </section>

      <section className="compass-sec wrap" id="compass"><div className="panel"><Compass /></div></section>
      <section className="bike-sec wrap" id="bike"><div className="panel"><Bike /></div></section>
      <section className="steve-sec wrap" id="steve"><div className="panel"><SteveCounter onSummon={steve.summon} /></div></section>
      <section className="confess-sec wrap" id="confess"><div className="panel"><Confess /></div></section>
      <section className="george-sec wrap" id="george"><div className="panel"><George /></div></section>
      <section className="scope-sec wrap" id="troitscope"><div className="panel"><Troitscope /></div></section>
      <section className="ferry-sec wrap" id="ferry"><div className="panel"><Ferry /></div></section>

      <footer className="wrap">
        <p className="coords">47.5623° N, 122.6248° W · THAT IS THE FERRY TERMINAL · BILLY IS SOMEWHERE NEAR THERE</p>
        <p>
          KBLY 1610 AM is not a real radio station. Bremerton is a real city. Jacob is a real guy. Billy is a voice
          that lives inside a radio, and that is all we are legally permitted to say about Billy.
        </p>
        <p>
          Built by Steve, who cares, and a computer, which does not, but tried very hard. No cookies were used
          in the making of this website. Jacob ate them.
        </p>
        <p>
          Your microphone is only used while you are on the air with Billy. Nothing on this page is stored
          anywhere except in Billy's memory, which is a radio's memory, which is to say: forever, and also not at all.
        </p>
        <p style={{ fontFamily: 'var(--led)', fontSize: 18, color: 'var(--phos)' }}>
          ✝ GO IN PEACE. USE THE PEDALS. ✝
        </p>
      </footer>
    </>
  )
}
