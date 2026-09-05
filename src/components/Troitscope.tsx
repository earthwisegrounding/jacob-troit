const TODAY = [
  'A man on a bicycle will be mistaken for a man on a motorcycle. You know who you are.',
  'The stars suggest pedaling. The stars have suggested this before.',
  'Someone named Steve will say something true. Pretend to hear it.',
  'A door will open. It is the garage. Do not play the guitar in it after nine.',
  'You will feel a strong pull toward the bar. This is not the stars. This is the compass.',
  'Today is a good day to be honest with a police officer. Try it once.',
  'A ferry will leave without you. Let it. It was going somewhere you should not.',
  'Mercury is in retrograde. So is your relationship with the helmet.',
  'You will be tempted to play "Faith." Resist until at least noon.',
  'An old friend will reach out. It is Steve. It is always Steve. Answer.',
  'The battery will die at the exact moment you need it. This is called consequences.',
  'A raccoon will be blamed for something. The raccoon is innocent.',
]
const AVOID = [
  'Throttles', 'Fourth chords', 'The 8:45 ferry', 'Explaining the sticker', 'Taco Bell after ten', 'Eye contact with the pastor',
  'Saying "technically"', 'Parking lots with fresh asphalt', 'Steve\'s voicemail', 'Unplugged amplifiers (plugging them in)',
]
const LUCKY = ['20*', '3', '1610', '0', '8:45', '4 (chords)', '1', '10 AM', '2', '22.5']

function seed() {
  const d = new Date()
  return d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate()
}
function at<T>(a: T[], k: number) { return a[Math.abs(k) % a.length] }

export default function Troitscope() {
  const s = seed()
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <div>
      <div className="eyebrow">Exhibit F · Syndicated</div>
      <h2 className="sec-title">The Troitscope</h2>
      <div className="dateline">{date.toUpperCase()} · BREMERTON, WA · FOR PEOPLE BORN UNDER THE SIGN OF TROIT (THERE IS ONE)</div>
      <div className="scope-cols">
        <div>
          <h3>TODAY</h3>
          <p>{at(TODAY, s)}</p>
          <p style={{ fontSize: 14, opacity: 0.7 }}>Tomorrow: {at(TODAY, s + 7)}</p>
        </div>
        <div>
          <h3>LUCKY NUMBER</h3>
          <div className="lucky">{at(LUCKY, s * 3)}</div>
          <p style={{ fontSize: 14, opacity: 0.7 }}>*mph. Lucky in that it has never once been enforced.</p>
        </div>
        <div>
          <h3>AVOID</h3>
          <p>{at(AVOID, s * 7)}. Also {at(AVOID, s * 11 + 3).toLowerCase()}.</p>
          <h3 style={{ marginTop: 14 }}>COMPATIBLE WITH</h3>
          <p>Steve. Only Steve. The stars were very clear.</p>
        </div>
      </div>
    </div>
  )
}
