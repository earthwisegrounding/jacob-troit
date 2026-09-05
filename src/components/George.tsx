import { useState } from 'react'
import { audio } from '../audio'

const SETLIST = [
  ['Faith', 'his own baptism, retroactively'],
  ['Careless Whisper', "Steve's wedding, uninvited, from the parking lot"],
  ['Father Figure', "a Father's Day brunch, to strangers"],
  ['Freedom! ’90', 'a traffic stop'],
  ['Wake Me Up Before You Go-Go', '3 AM, unprompted, on the ferry'],
  ['Everything She Wants', 'the DMV, while being told it is not a bicycle'],
  ['Praying for Time', 'the ferry line, all forty minutes of it'],
  ['One More Try', 'a fourth chord. It did not take.'],
]

export default function George() {
  const [playing, setPlaying] = useState<string | null>(null)

  const play = (song: string) => {
    audio.init()
    audio.boop()
    setPlaying(song)
  }

  return (
    <div className="grid2">
      <div>
        <div className="eyebrow">Exhibit E · Sanctuary</div>
        <h2 className="sec-title">The Chapel of George</h2>
        <p className="lede">
          Jacob owns one guitar, three chords, and an unshakable belief that every gathering, sacred or secular,
          wants to hear the same song. He is, in his own words, "keeping the faith." He is, in Steve's words,
          "doing it again."
        </p>
        <p className="lede">
          Below: a partial record of where each song has been performed against the wishes of those present.
        </p>
        <svg className="chord" viewBox="0 0 130 150" role="img" aria-label="Chord diagram for E major, the only chord Jacob needs">
          <text x="65" y="18" textAnchor="middle" fontFamily="Rye, serif" fontSize="18" fill="#ffd27a">E</text>
          <text x="65" y="32" textAnchor="middle" fontFamily="VT323, monospace" fontSize="11" fill="#f1e6c8">THE ONLY CHORD JACOB NEEDS</text>
          <rect x="25" y="40" width="80" height="4" fill="#ffd27a" />
          {[0, 1, 2, 3, 4].map((f) => <line key={f} x1="25" y1={44 + f * 22} x2="105" y2={44 + f * 22} stroke="#f1e6c8" strokeWidth="1" />)}
          {[0, 1, 2, 3, 4, 5].map((s) => <line key={s} x1={25 + s * 16} y1="40" x2={25 + s * 16} y2="132" stroke="#f1e6c8" strokeWidth="1" />)}
          <circle cx="57" cy="77" r="6" fill="#e63946" />
          <circle cx="41" cy="77" r="6" fill="#e63946" />
          <circle cx="73" cy="55" r="6" fill="#e63946" />
        </svg>
      </div>
      <div>
        <div className="cassette">
          <div className="label">JACOB'S MIX · SIDE A · "FOR STEVE (SORRY)"</div>
          <div className={`reels ${playing ? 'play' : ''}`}>
            <div className="reel" /><div className="reel" />
          </div>
          <div className="now">
            {playing ? `NOW PLAYING: ${playing.toUpperCase()}` : 'INSERT FAITH TO BEGIN'}
          </div>
          {playing && (
            <div style={{ fontSize: 13, textAlign: 'center', opacity: 0.7 }}>
              (You have to imagine the audio. Licensing. Jacob understands. Jacob has never once paid for a song.)
            </div>
          )}
        </div>
        <ul className="setlist">
          {SETLIST.map(([song, where]) => (
            <li key={song}>
              <button onClick={() => play(song)} aria-label={`Play ${song}`}>▶</button>
              <div>
                <div className="song">{song}</div>
                <div className="where">Performed at: {where}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
