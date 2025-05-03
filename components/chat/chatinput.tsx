"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatInput({ onSend }: { onSend: (t: string) => void }) {
    const [val, setVal] = useState("");
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSend(val); setVal(""); }}
            className="flex gap-2 p-2 border-t">
            <Input value={val} onChange={e => setVal(e.target.value)} placeholder="Describe a vibe…" />
            <Button type="submit">Send</Button>
        </form>
    );
}
