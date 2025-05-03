"use client";
import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { EventTuple } from "@/lib/synth";

/* visual constants --------------------------------------------------- */
const NOTE_H = 10;   // px row height
const MIN_BEAT = 30;   // minimum px per beat

type Props = { melody: EventTuple[] };

/* helpers ------------------------------------------------------------ */
function stats(melody: EventTuple[]) {
    let minMidi = Infinity, maxMidi = -Infinity, beats = 0;
    melody.forEach(([start, { note, dur }]) => {
        const m = Tone.Frequency(note).toMidi();
        minMidi = Math.min(minMidi, m);
        maxMidi = Math.max(maxMidi, m);
        beats = Math.max(beats, Number(start) + Number(dur));
    });
    return { minMidi, maxMidi, beats };
}

export default function PianoRoll({ melody }: Props) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const beatPxRef = useRef<number>(MIN_BEAT);      // shared w/ anim
    const playheadRef = useRef<SVGLineElement | null>(null);

    /* draw (or re-draw) ------------------------------------------------- */
    useEffect(() => {
        if (!svgRef.current) return;
        const svg = svgRef.current;
        const { minMidi, maxMidi, beats } = stats(melody);

        /* horizontal scale: fit container but never < MIN_BEAT ------------ */
        const parentW = svg.parentElement?.clientWidth ?? beats * MIN_BEAT;
        const beatPx = Math.max(MIN_BEAT, parentW / beats);
        beatPxRef.current = beatPx;

        /* vertical scale: true span -------------------------------------- */
        const rows = maxMidi - minMidi + 1;
        svg.innerHTML = "";
        svg.setAttribute("width", `${beats * beatPx}`);
        svg.setAttribute("height", `${rows * NOTE_H}`);

        /* draw notes ------------------------------------------------------ */
        melody.forEach(([start, { note, dur }]) => {
            const midi = Tone.Frequency(note).toMidi();
            const y = (maxMidi - midi) * NOTE_H;
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", `${Number(start) * beatPx}`);
            rect.setAttribute("y", `${y}`);
            rect.setAttribute("width", `${Number(dur) * beatPx}`);
            rect.setAttribute("height", `${NOTE_H - 1}`);
            rect.setAttribute("fill", "#0080ff");
            svg.appendChild(rect);
        });

        /* play-head ------------------------------------------------------- */
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("y1", "0");
        line.setAttribute("y2", `${rows * NOTE_H}`);
        line.setAttribute("stroke", "#ff5656");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
        playheadRef.current = line;
    }, [melody]);

    /* animate ----------------------------------------------------------- */
    useEffect(() => {
        let raf = 0;
        const step = () => {
            const beats = (Tone.Transport.seconds * Tone.Transport.bpm.value) / 60;  // <-- fixed
            const x = beats * beatPxRef.current;
            playheadRef.current?.setAttribute("x1", `${x}`);
            playheadRef.current?.setAttribute("x2", `${x}`);
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div
            className="border rounded"
            style={{
                overflowX: "auto",  // horizontal scroll when needed
                overflowY: "hidden",
                width: "100%",
                height: "70%",
            }}
        >
            <svg ref={svgRef} />
        </div>
    );
}
