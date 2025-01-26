// mantis-frontend/src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

type ChatRequest = {
  roadmap: Roadmap;
  messages: { role: "user" | "assistant"; content: string }[];
};

export async function POST(request: Request) {
  try {
    const { roadmap, messages }: ChatRequest = await request.json();

    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant that provides guidance on MVP roadmaps. 
      The user has generated the following roadmap:
      ${JSON.stringify(roadmap, null, 2)}
      
      Your task is to answer questions and provide advice based on this roadmap.`,
    };

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [systemMessage, ...messages],
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 0.9,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 50000,
      }
    );

    const assistantMessage = response.data.choices[0].message.content;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}