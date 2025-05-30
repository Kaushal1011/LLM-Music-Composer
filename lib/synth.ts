import * as Tone from "tone";
type NewSynth = Tone.PolySynth | Tone.Synth | Tone.DuoSynth | Tone.FMSynth;
/* ---- presets (unchanged) ---- */
export const presets: Record<string, () => NewSynth> = {
    /* ─── originals ─── */
    SynthPad: () =>
        new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: { release: 2 },
        }).toDestination(),

    BrightPluck: () =>
        new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "fatsawtooth" },
        }).toDestination(),

    /* ─── new flavors ─── */

    /** Warm, breathy pad à-la Juno-60 strings */
    WarmPad: () =>
        new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle" },
            envelope: { attack: 1.5, sustain: 0.7, release: 4 },
            volume: -6,
        }).toDestination(),

    /** Soft saw with gentle filter sweep – nice for chords or leads */
    AnalogSaw: () =>
        new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 1.2 },
        }).toDestination(),

    /** FM bell / key – DX-style electric piano */
    FMKeys: () =>
        new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 2.5,
            modulationIndex: 4,
            oscillator: { type: "sine" },
            modulation: { type: "square" },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.0, release: 2 },
            modulationEnvelope: { attack: 0.2, decay: 0.1, sustain: 0.4, release: 2 },
        }).toDestination(),

    /** Glassy mallet / vibraphone */
    GlassVibes: () =>
        new Tone.PolySynth(Tone.Synth, {
            oscillator: { partials: [0, 1, 0.2, 0.12, 0.06] },
            envelope: { attack: 0.005, decay: 1.6, sustain: 0, release: 2.5 },
            volume: -8,
        }).toDestination(),

    /** Simple sub-bass (monophonic) – use for low-end riffs */
    SubBass: () =>
        // MonoSynth returns a single voice; cast for consistency
        (new Tone.MonoSynth({
            oscillator: { type: "square" },
            filter: { Q: 1, type: "lowpass", frequency: 80 },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.8 },
        }).toDestination()) as unknown as NewSynth,

    /** Dual-oscillator lead (hard-panned duet) */
    WideLead: () =>
        (new Tone.DuoSynth({
            voice0: { oscillator: { type: "sawtooth" } },
            voice1: { oscillator: { type: "square" } },
            vibratoAmount: 0.1,
            vibratoRate: 5,
            volume: -4,
        }).toDestination()) as unknown as NewSynth,
};

let synth: NewSynth | null = null;   //  <-- was PolySynth | null
let currentPart: Tone.Part | null = null;

/* ------------------------------------------------------------- */
/* 4 – playMelody stays exactly the same                         */
/* ------------------------------------------------------------- */
export type NoteEvt = { note: string; dur: number | string };
export type EventTuple = [number | string, NoteEvt];

export async function playMelody(melody: EventTuple[], preset = "SynthPad") {
    await Tone.start();

    currentPart?.dispose();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    synth?.dispose();
    synth = presets[preset]?.() ?? presets.SynthPad();

    currentPart = new Tone.Part((time, value: NoteEvt) => {
        synth!.triggerAttackRelease(value.note, value.dur, time);
    }, melody).start(0);

    Tone.Transport.start();
}

export function stopMelody() {
    currentPart?.dispose();
    currentPart = null;

    synth?.dispose();
    synth = null;

    Tone.Transport.stop();
}
