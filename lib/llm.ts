const APP_ID = process.env.APP_ID; // same as in the URL
const ENDPOINT = `https://app.wordware.ai/api/released-app/${APP_ID}/run`;


const DECODER = new TextDecoder();

/** Runs the Wordware app and returns { reply, preset, melody } */
export async function getMelody(prompt: string) {
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WORDWARE_API_KEY!}`,
        },
        body: JSON.stringify({
            inputs: { "Music Type instructions": prompt },
            version: "^1.3",
        }),
    });

    if (!res.ok) {
        throw new Error(`Wordware error ${res.status}: ${await res.text()}`);
    }

    // ---- stream-aware parser ----
    const reader = res.body!.getReader();
    let buf = "";
    let final: any = null;

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buf += DECODER.decode(value, { stream: true });

        // Split on newline – each line is an individual JSON envelope
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);

            if (!line) continue;          // heartbeat / keep-alive
            const envelope = JSON.parse(line).value;

            // The payload we care about arrives in the *last* “outputs” envelope
            if (envelope.type === "outputs") {
                // Prefer the label you set in the Structured Generation node,
                // else just grab the first entry.
                const firstKey = Object.keys(envelope.values)[0];
                final = envelope.values[firstKey];
            }
        }
    }

    if (!final) throw new Error("No outputs found in stream");

    console.log("Final output:", final);

    // Normalise to the shape your Tone.js code expects
    return {
        reply: final.Reply,
        preset: final.Preset,
        melody: final.Melody.map(
            (n: any) => [Number(n.ID), n.NoteIdentifier, n.StartTime, n.Duration]
        ),
    };
}

