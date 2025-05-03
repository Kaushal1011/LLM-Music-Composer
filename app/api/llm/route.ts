import { NextRequest, NextResponse } from "next/server";
import { getMelody } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  // getMelody returns { melody: number[][], preset: string, reply: string }
  const data = await getMelody(prompt);
  return NextResponse.json(data);
}
