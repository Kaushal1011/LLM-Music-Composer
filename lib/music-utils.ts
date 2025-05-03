// /lib/music-utils.ts
import * as Tone from "tone";
import { bufferToWav } from "@/lib/buffer-to-wav";
import { presets } from "@/lib/synth";

export async function renderPresetSample(presetName: string) {
    return Tone.Offline(async ({ transport }) => {
        const synth = presets[presetName]?.() ?? presets.SynthPad();
        synth.triggerAttackRelease("C5", 1, 0);
        transport.start();
    }, 1).then(buffer => {
        const wav = bufferToWav(buffer);              // now accepts ToneAudioBuffer
        return new Blob([wav], { type: "audio/wav" });
    });
}
