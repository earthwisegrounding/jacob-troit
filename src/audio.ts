// Every sound on this website is synthesized on the spot.
// No samples, no licensing, no George Michael. Just oscillators and regret.

let ctx: AudioContext | null = null
let master: GainNode | null = null

function get(): { ctx: AudioContext; master: GainNode } | null {
  try {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return { ctx, master: master! }
  } catch {
    return null
  }
}

function tone(
  freqs: number[],
  dur: number,
  opts: { gain?: number; type?: OscillatorType; when?: number; slideTo?: number } = {},
) {
  const a = get()
  if (!a) return
  const { gain = 0.06, type = 'sine', when = 0, slideTo } = opts
  const t0 = a.ctx.currentTime + when
  const g = a.ctx.createGain()
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.setValueAtTime(gain, t0 + dur - 0.02)
  g.gain.linearRampToValueAtTime(0, t0 + dur)
  g.connect(a.master)
  for (const f of freqs) {
    const o = a.ctx.createOscillator()
    o.type = type
    o.frequency.setValueAtTime(f, t0)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
    o.connect(g)
    o.start(t0)
    o.stop(t0 + dur + 0.05)
  }
}

function noise(dur: number, gain = 0.08, when = 0, hp = 800) {
  const a = get()
  if (!a) return
  const t0 = a.ctx.currentTime + when
  const len = Math.max(1, Math.floor(a.ctx.sampleRate * dur))
  const buf = a.ctx.createBuffer(1, len, a.ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = a.ctx.createBufferSource()
  src.buffer = buf
  const f = a.ctx.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = hp
  const g = a.ctx.createGain()
  g.gain.value = gain
  src.connect(f).connect(g).connect(a.master)
  src.start(t0)
}

export const audio = {
  init: () => void get(),
  dialTone: (dur = 1) => tone([350, 440], dur, { gain: 0.05 }),
  pulse: () => noise(0.018, 0.12, 0, 1500),
  dialReturn: () => noise(0.06, 0.05, 0, 400),
  ringback: () => tone([440, 480], 1.6, { gain: 0.05 }),
  connect: () => {
    noise(0.05, 0.1, 0, 300)
    tone([660], 0.08, { gain: 0.04, when: 0.06 })
  },
  hangup: () => {
    noise(0.04, 0.12, 0, 200)
    tone([480, 620], 0.25, { gain: 0.05, when: 0.08 })
    tone([480, 620], 0.25, { gain: 0.05, when: 0.58 })
  },
  dead: () => {
    for (let i = 0; i < 3; i++) tone([1400, 2060, 2450], 0.3, { gain: 0.04, when: i * 0.4 })
  },
  boop: () => tone([880], 0.07, { gain: 0.05, type: 'square' }),
  nope: () => tone([220], 0.35, { gain: 0.07, type: 'sawtooth', slideTo: 90 }),
  stamp: () => {
    noise(0.08, 0.25, 0, 120)
    tone([70], 0.18, { gain: 0.15, type: 'sine' })
  },
  rev: (level: number) => tone([60 + level * 120], 0.12, { gain: 0.05, type: 'sawtooth', slideTo: 80 + level * 160 }),
  spin: () => noise(0.4, 0.05, 0, 2000),
  clunk: () => {
    noise(0.05, 0.2, 0, 150)
    tone([110], 0.2, { gain: 0.1, type: 'triangle', slideTo: 55 })
  },
  print: () => {
    for (let i = 0; i < 14; i++) noise(0.02, 0.05, i * 0.07, 2500)
  },
  chime: () => {
    tone([523.25], 0.4, { gain: 0.05 })
    tone([659.25], 0.4, { gain: 0.05, when: 0.15 })
    tone([783.99], 0.6, { gain: 0.05, when: 0.3 })
  },
  flap: () => noise(0.015, 0.06, 0, 3000),
}
