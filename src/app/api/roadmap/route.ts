import { NextResponse } from 'next/server';
import axios from 'axios';

type Roadmap = {
  phases: Array<{
    name: string;
    timeline: string;
    tasks: string[];
  }>;
};

export async function POST(request: Request) {
  try {
    const { appName, purpose, features } = await request.json();

    // Optimized prompt for DeepSeek
    const prompt = `As a product management expert, generate an MVP roadmap for a ${appName} app.
      Purpose: ${purpose}.
      Features: ${features.join(", ")}.
      Respond STRICTLY in valid JSON format:
      {
        "phases": [
          {
            "name": "Phase name (e.g., Discovery)",
            "timeline": "Duration (e.g., 2 weeks)",
            "tasks": ["Task 1", "Task 2"]
          }
        ]
      }`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', // DeepSeek endpoint
      {
        model: 'deepseek-chat', // Confirm correct model name
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Validate response
    const rawData = response.data.choices[0].message.content;
    const parsedData: Roadmap = JSON.parse(rawData);

    if (!parsedData.phases || !Array.isArray(parsedData.phases)) {
      throw new Error("Invalid roadmap format from DeepSeek");
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("DeepSeek API Error:", {
      error: error.message,
      response: error.response?.data,
    });
    return NextResponse.json(
      { error: 'Failed to generate roadmap. Contact support if billing is active.' },
      { status: 500 }
    );
  }
}