import * as Tone from "tone";
import { EventTuple } from "@/lib/synth";

/* ---------- helpers (var-length quantities) ----------------------- */
function writeVLQ(value: number, bytes: number[] = []): number[] {
    bytes.unshift(value & 0x7f);
    value >>= 7;
    if (value > 0) writeVLQ(value, bytes);
    // set continuation bit on all *except* last
    for (let i = 0; i < bytes.length - 1; i++) bytes[i] |= 0x80;
    return bytes;
}

/* ---------- main encoder ------------------------------------------ */
export function melodyToSMF(melody: EventTuple[], tpq = 480): Uint8Array {
    /* sort by start time just in case */
    const notes = melody
        .map(([start, { note, dur }]) => ({
            start: Number(start),
            end: Number(start) + Number(dur),
            midi: Tone.Frequency(note).toMidi(),
        }))
        .sort((a, b) => a.start - b.start);

    /* gather (time, on/off) events ----------------------------------- */
    type Ev = { tick: number; on: boolean; midi: number };
    const events: Ev[] = [];
    notes.forEach(n => {
        events.push({ tick: Math.round(n.start * tpq), on: true, midi: n.midi });
        events.push({ tick: Math.round(n.end * tpq), on: false, midi: n.midi });
    });
    events.sort((a, b) => a.tick - b.tick);

    /* build track bytes ---------------------------------------------- */
    const track: number[] = [];
    let lastTick = 0;
    for (const ev of events) {
        const delta = ev.tick - lastTick;
        lastTick = ev.tick;

        /* delta-time VLQ */
        track.push(...writeVLQ(delta));

        /* MIDI message */
        if (ev.on) {
            track.push(0x90, ev.midi, 96);    // Note On, ch=0, vel=96
        } else {
            track.push(0x80, ev.midi, 0);     // Note Off
        }
    }

    /* End-of-Track meta-event */
    track.push(0x00, 0xff, 0x2f, 0x00);

    /* ---------- SMF wrapper (type-0) -------------------------------- */
    const hdr = [
        // "MThd"
        0x4d, 0x54, 0x68, 0x64,
        // header length 6
        0x00, 0x00, 0x00, 0x06,
        // format 0
        0x00, 0x00,
        // nTracks = 1
        0x00, 0x01,
        // ticks per quarter note (tpq)
        (tpq >> 8) & 0xff,
        tpq & 0xff,
    ];

    const trkLen = track.length;
    const trkHdr = [
        // "MTrk"
        0x4d, 0x54, 0x72, 0x6b,
        // length (4 bytes big-endian)
        (trkLen >> 24) & 0xff,
        (trkLen >> 16) & 0xff,
        (trkLen >> 8) & 0xff,
        trkLen & 0xff,
    ];

    return new Uint8Array([...hdr, ...trkHdr, ...track]);
}
