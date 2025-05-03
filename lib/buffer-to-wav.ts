/* Works with native AudioBuffer *or* ToneAudioBuffer (Tone v15) */
import type { ToneAudioBuffer } from "tone";

/* 16-bit little-endian PCM encoder ---------------------------------- */
export function bufferToWav(buf: AudioBuffer | ToneAudioBuffer): Uint8Array {
    // Grab the raw channel data regardless of wrapper type
    const chans: Float32Array[] =
        isTone(buf) ? buf.toArray() as Float32Array[]            // ToneAudioBuffer
            : Array.from({ length: buf.numberOfChannels },
                (_, ch) => buf.getChannelData(ch));      // native AudioBuffer

    const numCh = chans.length;
    const sr = "sampleRate" in buf ? (buf as any).sampleRate : 44100;
    const frames = chans[0].length;
    const dataLen = frames * numCh * 2;                        // 16-bit
    const arr = new Uint8Array(44 + dataLen);
    const view = new DataView(arr.buffer);

    let off = 0;
    const w8 = (v: number) => { view.setUint8(off++, v); };
    const w16 = (v: number) => { view.setUint16(off, v, true); off += 2; };
    const w32 = (v: number) => { view.setUint32(off, v, true); off += 4; };
    const str = (s: string) => s.split("").forEach(c => w8(c.charCodeAt(0)));

    /* RIFF / fmt ------------------------------------------------------ */
    str("RIFF"); w32(36 + dataLen);
    str("WAVEfmt "); w32(16); w16(1);
    w16(numCh); w32(sr); w32(sr * numCh * 2);
    w16(numCh * 2); w16(16);
    str("data"); w32(dataLen);

    /* interleave + PCM-encode ---------------------------------------- */
    for (let i = 0; i < frames; i++) {
        for (let ch = 0; ch < numCh; ch++) {
            const s = Math.max(-1, Math.min(1, chans[ch][i]));
            const v = s < 0 ? s * 0x8000 : s * 0x7fff;
            view.setInt16(off, v, true);
            off += 2;
        }
    }
    return arr;
}

function isTone(b: any): b is ToneAudioBuffer {
    return typeof b.toArray === "function";
}
